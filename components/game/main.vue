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
    />
    <!-- TODO: Breather between matches. -->
    <!-- 
    <div class="grid place-content-center">
      <div v-for="(rIndex, row) in GameRunner.size" class="flex">
        <div v-for="(cIndex, col) in GameRunner.size" class="grid">
          <div class="w-8 h-8 border grid place-content-center">
            {{ rIndex }}-{{ cIndex }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import GameConnector from "~~/models/GameConnector";
import GameRunner from "~~/models/GameRunner";
import Piece from "~~/models/Piece";

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

const purchaseAndPlace = async (
  pieceType: PieceTypes,
  location: BoardLocation
) => {
  const payload = {
    pieceType,
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
    try {
      if (TheGameRunner.player !== content.player) {
        // Remote player checks placement
        // Will throw if purchase invalid, which will catch inside GameConnector.processNewEvent and send a failed response code.
        const piece = TheGameRunner.purchaseAndPlace({
          pieceType: content.pieceType,
          location: content.location,
          player: content.player,
        });

        // Remote player should auto-confirm if GameRunner passes valid.
        piece.purchaseVerified = true;
      } else {
        const piece =
          TheGameRunner.gameBoard[content.location.r][content.location.c];

        // Weird error, but just in case.
        if (!piece || piece.purchaseVerified === true)
          throw "Purchase already verified";

        // Local player receive good response from remote should confirm.
        piece.purchaseVerified = true;
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

const beat = computed(() => {
    return [TheGameRunner.beat, TheGameRunner.measure];
})
watch(beat, (beat, measure) => {
    console.log(beat, measure);
})

onMounted(async () => {
  try {
    const startTime = await props.TheGameConnector.syncStart(
      props.role === "client"
    );
    await delay(startTime - Date.now());

    debugGameState(TheGameRunner);

    TheGameRunner.start();
  } catch (error) {
    // connection error... back to main?
  }
});
onUnmounted(() => {
  console.log("unmounted");
  TheGameRunner.stop();
});

// Manually tinker up a game based on some particular state I'm trying to debug
const debugGameState = (TheGameRunner: GameRunner) => {
  TheGameRunner.gameBoard = [
    [
      new Piece("black", "queen", { r: 0, c: 0 }, {r: 7, c: 7}),
      null,
      null,
      null,
      null,
      null,
      null,
      new Piece("white", "queen", { r: 0, c: 7 }, {r: 7, c: 0}),
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  ];
  TheGameRunner.gameMode = "move";
};
</script>
