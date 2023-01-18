<template>
  <div class="max-w-xl mx-auto py-4">
    <p v-if="TheGameRunner.clock === null">Counting us off...</p>
    <GameModePurchase
      :player="player"
      :TheGameRunner="TheGameRunner"
      v-else-if="TheGameRunner.gameMode === 'purchase'"
      @purchaseAndPlace="purchaseAndPlace"
    />
    <GameModeMove
      v-else-if="TheGameRunner.gameMode === 'move'"
      :player="player"
      :TheGameRunner="TheGameRunner"
      @queueMove="queueMove"
    />
    <div v-else-if="TheGameRunner.gameMode === 'gloat'">
      <template v-if="!TheGameRunner.gameWinner">
        <p>Match: {{ TheGameRunner.wins[TheGameRunner.wins.length - 1] }}</p>
        <p>Restarting in {{ Math.abs(4 - TheGameRunner.measure) }}</p>
      </template>
      <p v-else>Game: {{ TheGameRunner.gameWinner }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameConnector from "~~/models/GameConnector";
import GameRunner from "~~/models/GameRunner";
import debugGameState from "~/utils/debugGameState";

const props = defineProps<{
  TheGameConnector: GameConnector;
  role: "host" | "client";
}>();

// TODO: Game setup screen
const player = computed<"black" | "white">(() => {
  return props.role === "host" ? "white" : "black";
});

const TheGameRunner = reactive(
  new GameRunner({
    player: player.value,
  })
);

const purchaseAndPlace = async (type: PieceTypes, location: BoardLocation) => {
  const payload = {
    type,
    location,
    player: player.value,
  };

  // Make sure the move is valid locally
  TheGameRunner.purchaseAndPlace(payload);

  try {
    // p2 verifies move as well
    await props.TheGameConnector.purchaseAndPlace(payload);
  } catch (error) {
    // P2 disagrees with move?? Maybe a race condition
  }

  // Both p1 and p2 end up in callbacks['purchase-and-place'].resolve, which confirms placement.
};

props.TheGameConnector.callbacks["purchase-and-place"] = {
  resolve: (content: DataConnectionEvent["content"]) => {
    const { type, location, player } = content;

    try {
      if (TheGameRunner.player !== player) {
        // Remote player checks placement
        // Will throw if purchase invalid, which will catch inside GameConnector.processNewEvent and send a failed response code.
        var piece = TheGameRunner.purchaseAndPlace({ type, location, player });
      } else {
        var piece = TheGameRunner.findPiece(content.location, {
          type,
          location,
          player,
          purchaseVerified: false,
        });
      }

      piece.purchaseVerified = true;
    } catch (error) {
      /*
       * TODO: Catch TheGameRunner.purchaseAndPlace throw for following race condition
       *
       * p2 places, waiting callback
       * p1 places in same loc, waiting callback
       * p2 gets p1 request. Says p1 can't place because p2 already did
       */
      throw error;
    }
    return content;
  },
  reject: () => {},
};

const queueMove = async (
  type: PieceTypes,
  location: BoardLocation,
  moveTo: BoardLocation
) => {
  const payload = {
    type,
    location,
    moveTo,
    player: TheGameRunner.player,
  };

  try {
    // sue me
    var piece = TheGameRunner.queueMove(payload);
  } catch (error) {
    // Move invalid
    console.error(error);
    return;
  }

  try {
    // p2 verifies move as well
    await props.TheGameConnector.queueMove(payload);
  } catch (error) {
    console.error(error);
    piece.moveTo = null;
    // P2 disagrees with move?? Maybe a race condition
  }
};

props.TheGameConnector.callbacks["queue-move"] = {
  resolve: (content: DataConnectionEvent["content"]) => {
    const { type, location, moveTo, player } = content;

    try {
      if (TheGameRunner.player !== content.player) {
        const piece = TheGameRunner.queueMove({
          type,
          location,
          moveTo,
          player,
        });
        piece.movementVerified = true;
      } else {
        const piece = TheGameRunner.findPiece(location, {
          type,
          location,
          moveTo,
          player,
        });
        piece.movementVerified = true;
      }
    } catch (error) {
      /*
       * TODO: Catch TheGameRunner.purchaseAndPlace throw for following race condition
       *
       * p2 places, waiting callback
       * p1 places in same loc, waiting callback
       * p2 gets p1 request. Says p1 can't place because p2 already did
       */
      throw error;
    }
    return content;
  },
  reject: () => {},
};

const gameClock = computed(() => {
  return [TheGameRunner.measure, TheGameRunner.beat];
});
watch(gameClock, async ([measure, beat]) => {
  if (measure === 2 && beat === 5) {
    if (props.role === "client") {
      const moveMeasureEnd = 18 * TheGameRunner.bpm;
      props.TheGameConnector.syncGameState({
        gameBoard: JSON.stringify(TheGameRunner.gameBoard),
        moveMeasureEnd,
      });
    }
  }
});

props.TheGameConnector.callbacks["sync-game-state"] = {
  resolve: (content: DataConnectionEvent["content"]) => {
    if (TheGameRunner.measure !== 2) throw "Error: Too far out to sync";

    const { moveMeasureEnd, stamp } = content;
    const theirEnd = moveMeasureEnd + stamp;
    const myEnd =
      (11 - TheGameRunner.beat + 12) * TheGameRunner.bpm + Date.now();

    TheGameRunner.moveMeasureCatchup = theirEnd - myEnd;

    return content;
  },
  reject: () => {},
};

onMounted(async () => {
  try {
    const startTime = await props.TheGameConnector.syncStart(
      props.role === "client"
    );
    await delay(startTime - Date.now());

    debugGameState(TheGameRunner, props.role === "client");

    TheGameRunner.start();
  } catch (error) {
    console.log(error);
    // connection error... back to main?
  }
});
onUnmounted(() => {
  TheGameRunner.stop();
});
</script>
