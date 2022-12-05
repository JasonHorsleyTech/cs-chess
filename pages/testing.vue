<template>
  <div class="flex flex-nowrap items-stretch w-full h-1/8" v-for="(row, rIndex) in game.board">
    <div
      class="w-1/8 h-full border grid place-content-center hover:bg-gray-100 cursor-pointer"
      v-for="(piece, cIndex) in game.board[rIndex]"
    >
      <GamePiece v-if="piece" :piece="piece" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const game: {
  board: Array<Array<null | Piece>>;
  stage: "setup" | "purchase" | "play";
  tempo: number;
} = reactive({
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  stage: "setup",
  tempo: 60,
});
</script>
