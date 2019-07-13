<template>
  <div class="chessBoard">
    <div class="board">
      <div class="r" v-for="(rows, r) in piecesOnBoard" v-bind:key="'row' + r">
        <div
          class="c"
          v-for="(col, c) in rows"
          v-bind:key="'row' + r + 'col' + c"
          @click="selectPiece(r, c)"
        >
          <div class="f">
            <font-awesome-icon
              class="square"
              :class="{selected: (selectedSquare && selectedSquare[0] == r && selectedSquare[1] == c)}"
              icon="square-full"
              :style="{color: ['#DEC897', '#5A3D1F'][((c + (r*7)) % 2)]}"
            />
            <font-awesome-icon
              v-if="availableMoves.find((i) => (i[0] == r && i[1] == c))"
              class="movable"
              icon="circle"
            />
            <font-awesome-icon
              v-if="col"
              class="piece"
              :code="col"
              :icon="lookupPiece(col)"
              :style="{color: {b: 'black', w: 'white'}[col.substring(0, 1)]}"
            />
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
      piecesOnBoard: [
        ["br", "bn", "bb", "bk", "bq", "bb", "bn", "br"],
        ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
        ["wr", "wn", "wb", "wk", "wq", "wb", "wn", "wr"]
      ],
      piecesLookupTable: {
        p: "chess-pawn",
        r: "chess-rook",
        n: "chess-knight",
        b: "chess-bishop",
        q: "chess-queen",
        k: "chess-king"
      },
      selectedSquare: null
    };
  },
  computed: {
    selectedPiece: function() {
      // Updates when selectedSquare changes
      return this.selectedSquare
        ? this.piecesOnBoard[this.selectedSquare[0]][this.selectedSquare[1]]
        : false;
    },
    availableMoves: function() {
      // Updates when selectedPices changes (But also when selectedSquare changes??? Don't want that)
      let moves = this.findAvailableMoves(
        this.selectedPiece,
        this.selectedSquare
      );
      return moves;
    }
  },
  mounted: function() {
  },
  methods: {
    selectPiece(r, c) {
      this.selectedSquare = [r, c];
    },
    findAvailableMoves(piece, square) {
      let available = [];
      if (piece && square) {
        let color = piece.substring(0, 1);
        let pieceType = piece.substring(1, 2);
        switch (pieceType) {
          case "p":
            console.log(this);
            let dir = color == "w" ? -1 : 1;
            // Can always move up one
            available.push([square[0] + dir, square[1]]);
            // Can move up two if below line of scrimage (first two rows on it's side)
            if (
              (color == "w" && square[0] <= this.piecesOnBoard.length - 1) ||
              (color == "b" && square[0] >= 1)
            ) {
              available.push([square[0] + dir * 2, square[1]]);
            }
            break;
        }
      }
      return available;
    },
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
$dim: 100px;
.board {
  display: block;
  margin: auto;
  width: $dim * 8;
  .r {
    display: block;
    height: $dim;
    .c {
      display: inline-block;
      width: 100% / 8;
      .f {
        display: block;
        margin: auto;
        height: $dim;
        width: $dim;
        svg {
          position: absolute;
          &.square {
            height: $dim;
            width: $dim;
            &.selected {
              border: 5px solid grey;
            }
          }
          &.piece {
            $ratio: 0.75;
            height: $dim * $ratio;
            width: $dim * $ratio;
            margin: $dim * (1-$ratio) / 2;
          }
          &.movable {
            $ratio: 0.5;
            height: $dim * $ratio;
            width: $dim * $ratio;
            margin: $dim * (1-$ratio) / 2;
            color: grey;
          }
        }
      }
    }
  }
}
</style>