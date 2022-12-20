<template>
  <div class="grid gap-4">
    <div class="flex justify-between items-center">
      <BeatCounter
        class=""
        :beat="TheGameRunner.beat"
        :measure="TheGameRunner.measure"
      />
      <p
        class="text-green-700 bg-white font-xl p-1 rounded-full font-bold text-xl px-4 border"
      >
        ${{ TheGameRunner.cash[TheGameRunner.player] }}
      </p>
    </div>
    <div class="grid place-content-center">
      <div
        v-for="(row, r) in TheGameRunner.gameBoard"
        class="flex border-r border-l first:border-t last:border-b border-gray-300"
      >
        <div v-for="(pieceOnBoard, c) in row" class="grid">
          <div
            class="group w-8 h-8 border grid place-content-stretch"
            :class="[
              // Checkerboard pattern
              (c + r) % 2 ? 'bg-gray-300/50' : 'bg-gray-50/50',
              canPlace({ r, c })
                ? 'hover:bg-gray-400 cursor-pointer'
                : 'pointer-events-none',
            ]"
            @click="handlePurchase({ r, c })"
          >
            <GamePiece
              v-if="pieceOnBoard !== null"
              :pieceType="pieceOnBoard.type"
              :player="pieceOnBoard.player"
            />
            <GamePiece
              class="w-1/2 hidden group-hover:block"
              v-else-if="toPurchase"
              :pieceType="toPurchase"
              :player="TheGameRunner.player"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="relative grid grid-cols-3 grid-rows-2 gap-4 place-content-end">
      <GameUIPurchasePiece
        v-for="pieceType in pieceTypes"
        :pieceType="pieceType"
        :player="player"
        :disabled="false"
        @click="toPurchase = pieceType"
        :selected="toPurchase === pieceType"
      />
      <div
        v-if="toPurchase !== null"
        class="absolute inset-0 bg-gray-300/25 grid place-content-center rounded-xl group cursor-pointer hover:bg-gray-400/50 transition-all"
        @click="toPurchase = null"
      >
        <h2
          class="p-4 rounded-xl text-white bg-gray-600/75 font-bold text-2xl group-hover:text-3xl group-hover:p-6 transition-all"
        >
          Cancel
        </h2>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameRunner from "~~/models/GameRunner";

const props = defineProps<{
  player: "white" | "black";
  TheGameRunner: GameRunner;
}>();

const emit = defineEmits<{
  (e: "purchaseAndPlace", pieceType: PieceTypes, location: BoardLocation): void;
}>();

const toPurchase = ref<null | PieceTypes>(null);

const handlePurchase = (loc: BoardLocation) => {
  if (toPurchase.value === null) return;
  emit("purchaseAndPlace", toPurchase.value, loc);
  toPurchase.value = null;
};

const canPlace = (location: BoardLocation) => {
  return true;
};
</script>
