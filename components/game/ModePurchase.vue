<template>
  <div class="grid gap-4">
    <div class="grid">
      <h2 class="">Purchase and place pieces.</h2>
      <h2>Both players must skip a turn to start.</h2>
    </div>

    <div class="flex justify-between items-center">
      <div
        class="700 bg-white font-xl py-2 rounded-full font-bold text-xl px-4 border"
      >
        <BeatCounter
          class=""
          :beat="TheGameRunner.beat"
          :measure="TheGameRunner.measure"
        />
      </div>
      <p
        class="text-green-700 bg-white font-xl py-1 rounded-full font-bold text-lg px-4 border"
      >
        ${{ TheGameRunner.cash[TheGameRunner.player] }}
      </p>
    </div>

    <div
      class="flex mx-auto border border-gray-400"
      :class="[
        TheGameRunner.player === 'black' ? 'flex-col-reverse' : 'flex-col',
      ]"
    >
      <div
        v-for="(row, r) in TheGameRunner.gameBoard"
        class="flex border-gray-300"
        :class="[
          TheGameRunner.player === 'black' ? 'flex-row-reverse' : 'flex-row',
        ]"
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
            @click="handleBoardClick({ r, c })"
          >
            <GamePiece
              v-if="pieceOnBoard !== null"
              :pieceType="pieceOnBoard.type"
              :player="pieceOnBoard.player"
              :class="[
                pieceOnBoard?.purchaseLocked
                  ? 'opacity-100'
                  : 'opacity-50 group-hover:animate-wiggle group-hover:w-3/4',
              ]"
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
        v-for="pieceType in Piece.allTypes"
        :pieceType="pieceType"
        :player="player"
        :disabled="
          TheGameRunner.cash[TheGameRunner.player] <
          TheGameRunner.piecePrices[pieceType]
        "
        :count="TheGameRunner.pieceCounts[pieceType]"
        :price="TheGameRunner.piecePrices[pieceType]"
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
import Piece from "~~/models/Piece";

const props = defineProps<{
  player: "white" | "black";
  TheGameRunner: GameRunner;
}>();

const emit = defineEmits<{
  (e: "purchaseAndPlace", pieceType: PieceTypes, location: BoardLocation): void;
}>();

const toPurchase = ref<null | PieceTypes>(null);

const handleBoardClick = (loc: BoardLocation) => {
  // Handle removal

  if (toPurchase.value === null) return;
  emit("purchaseAndPlace", toPurchase.value, loc);
  toPurchase.value = null;
};

const undoPurchase = (piece: Piece) => {
  if (piece.purchaseLocked) return false;
};

const canPlace = (location: BoardLocation) => {
  return true;
};
</script>
