<template>
  <div class="grid gap-4">
    <div class="grid">
      <h2 class="">Play chess!</h2>
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
          :class="[
            pieceSelected && pieceSelected.location === piece.location
              ? 'animate-wiggle'
              : '',
          ]"
        />
      </template>
      <!-- <template #square="{ r, c }">
        <p>{{ r }}, {{ c }}</p>
      </template> -->
      <template #board>
        <GameMovementArrows
          :piecesWithMovement="TheGameRunner.piecesWithMovement"
          :player="TheGameRunner.player"
        />
      </template>
    </GameBoard>
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
  (
    e: "queue-move",
    type: PieceTypes,
    location: BoardLocation,
    moveTo: BoardLocation
  ): void;
}>();

const pieceSelected = ref<null | Piece>(null);
const handleBoardClick = (target: BoardLocation) => {
  const boardSquare = props.TheGameRunner.gameBoard[target.r][target.c];

  if (pieceSelected.value === null) {
    if (
      boardSquare !== null &&
      boardSquare.player === props.TheGameRunner.player
    ) {
      pieceSelected.value = boardSquare;
      return;
    }
  } else {
    emit(
      "queue-move",
      pieceSelected.value.type,
      pieceSelected.value.location,
      target
    );

    pieceSelected.value = null;
  }
};
</script>
