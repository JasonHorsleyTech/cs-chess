<template>
  <div class="chessBoard">
    <div class="board">
      <div class="r" v-for="(rows, r) in squares" v-bind:key="'row' + r">
        <div class="c" v-for="(col, c) in rows" v-bind:key="'row' + r + 'col' + c">
          <div v-if="col">
            <font-awesome-icon
              :code="col"
              :icon="lookupPiece(col)"
              :style="{color: {b: 'black', w: 'white'}[col.substring(0, 1)]}"
            />
          </div>
          <div v-else>
            <font-awesome-icon class="invisible" icon="square-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChessBoardSquare from "./ChessBoardSquare.vue";
import ChessBoardPurchaseWheel from "./ChessBoardPurchaseWheel.vue";

export default {
  name: "ChessBoard",
  components: {
    ChessBoardPurchaseWheel
  },
  data() {
    return {
      /*
        8X8 grid for each piece: Black/White + Pawn, Rook, ...
        ["b", "w"] + ["p", "r", "h", "b", "k", "q"]
      */
      squares: [
        ["br", "bn", "bb", "bk", "bq", "bb", "bn", "br"],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["wr", "wn", "wb", "wk", "wq", "wb", "wn", "wr"]

        // ["wr", "wn", "wb", "wk", "wq", "wb", "wn", "wr"]
      ],
      piecesLookupTable: {
        p: "chess-pawn",
        r: "chess-rook",
        n: "chess-knight",
        b: "chess-bishop",
        q: "chess-queen",
        k: "chess-king"
      }
    };
  },
  mounted: function() {
    console.log(this.squares);
  },
  methods: {
    lookupPiece(piece) {
      if (piece) {
        let code = piece.substring(1, 2);
        return this.piecesLookupTable[code];
      } else {
        // FontAwesome has no "empty" icon, so we're using a square and setting the visibility to hidden in the style below
        return "square-full";
      }
    }
  }
};
</script>

<style lang="scss">
.board {
  background-color: grey;
  margin-left: 300px;
  width: 50px * 8;
  .r {
    display: block;
    .c {
      display: inline-block;
      width: 100% / 8;
      div {
        display: block;
        margin: auto;
        height: 50px;
        width: 50px;
        svg {
          height: 40px;
          width: 40px;
          margin: 5px;
        }
      }
    }
  }
}
</style>