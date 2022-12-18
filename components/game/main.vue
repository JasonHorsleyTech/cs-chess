<template>
  <div class="">
    <BeatCounter
      class="ml-auto"
      :beat="TheGameRunner.beat"
      :measure="TheGameRunner.measure"
    />

    <p v-if="TheGameRunner.clock === null">Counting us off...</p>
    <GamePurchaseMode
      v-else-if="TheGameRunner.gameMode === 'purchase'"
      @purchaseAndPlace="purchaseAndPlace(piece, location)"
    />
    <GameMoveMode v-else-if="TheGameRunner.gameMode === 'move'" />
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

const props = defineProps<{
  TheGameConnector: GameConnector;
  role: "host" | "client";
}>();

// TODO: Game setup screen
const player = computed(() => {
  return props.role === "host" ? "white" : "black";
});

const TheGameRunner = reactive(
  new GameRunner({
    player: player.value,
  })
);

const purchaseAndPlace = async (piece: Piece, location: BoardLocation) => {
  const [confirmPlacement, rejectPlacement] = TheGameRunner.purchaseAndPlace(
    piece,
    location,
    player.value
  );
  
  try {
    await props.TheGameConnector.syncPurchaseAndPlace(
      player.value,
      piece,
      location
    );
    confirmPlacement();
  } catch (error) {
    rejectPlacement();
  }
};

const count = ref(1);
onMounted(async () => {
  try {
    const startTime = await props.TheGameConnector.syncStart();
    await delay(startTime - Date.now());
    TheGameRunner.start();
  } catch (error) {
    // connection error... back to main?
  }
});
onUnmounted(() => {
  TheGameRunner.stop();
});
</script>
