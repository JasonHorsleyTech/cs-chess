<template>
  <div class="grid gap-4">
    <GameMatchCounter
      :wins="TheGameRunner.wins"
      :player="TheGameRunner.player"
    />

    <GameBeatAndCash
      :beat="TheGameRunner.beat"
      :measure="TheGameRunner.measure"
      :cash="TheGameRunner.cash[TheGameRunner.player]"
    />

    <GameBoard
      :player="TheGameRunner.player"
      :board="TheGameRunner.gameBoard"
      :disabled="TheGameRunner.syncing"
      @clickSquare="handleBoardClick"
    >
      <template #piece="piece">
        <GamePiece
          :pieceType="piece.type"
          :player="piece.player"
          :stunned="piece.stunned"
          :class="[piece.purchaseLocked ? 'opacity-100' : 'opacity-50']"
        />
      </template>
      <template #board>
        <div
          v-if="
            TheGameRunner.purchasesPendingCount === 0 && TheGameRunner.syncing
          "
          class="text-2xl grid place-content-center h-full text-red-900 font-bold animate-pulse"
        >
          GET READY!
        </div>
      </template>
    </GameBoard>

    <div class="relative grid grid-cols-3 grid-rows-2 gap-4 place-content-end">
      <GameUIPurchasePiece
        v-for="pieceType in Piece.allTypes"
        :pieceType="pieceType"
        :player="player"
        :disabled="purchaseDisabled(pieceType)"
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
  (e: "purchaseAndPlace", type: PieceTypes, location: BoardLocation): void;
}>();

const toPurchase = ref<null | PieceTypes>(null);

const handleBoardClick = (loc: BoardLocation) => {
  if (toPurchase.value === null) return;
  emit("purchaseAndPlace", toPurchase.value, loc);
  toPurchase.value = null;
};

// TODO: Additional logic to force "you have to purchase a king"...
const purchaseDisabled = (pieceType: PieceTypes) => {
  return (
    props.TheGameRunner.cash[props.TheGameRunner.player] <
    props.TheGameRunner.piecePrices[pieceType]
  );
};
</script>
