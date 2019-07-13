<template>
  <div>
    <ChessBoardSquare />
    <ChessBoardSquare />
    <ChessBoardSquare />
    <ChessBoardSquare />
  </div>
</template>
<script>
import ChessBoardSquare from "./ChessBoardSquare.vue";

export default {
  name: "ChessBoard",
  components: {
    ChessBoardSquare
  }
};
</script>
