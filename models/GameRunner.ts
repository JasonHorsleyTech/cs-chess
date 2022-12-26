import Piece from "./Piece";

export default class GameRunner {
  static size: number = 8;

  /** Internal game clock */
  measure: 0 | 1 | 2 | 3 = 0;
  beat: 0 | 1 | 2 | 3 = 0;
  clock: NodeJS.Timer | number | null = null;

  player: "black" | "white";
  gameBoard: Array<Array<null | Piece>>;
  gameMode: "purchase" | "move";

  // Normal chess starts with 43 in piece value
  cash: { black: number; white: number } = { black: 60, white: 60 };

  constructor(setupOptions: { player: "black" | "white" }) {
    this.player = setupOptions.player;

    this.gameMode = "purchase";
    this.gameBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ];
  }

  // Start the game
  start() {
    this.clock = setInterval(() => {
      this.tick();
    }, 250);
  }
  stop() {
    if (typeof this.clock === "number") clearInterval(this.clock);
    this.clock = null;
  }

  /** Measure: --|0000|1111|2222|3333|-- **/
  /** Beat:    --|0123|0123|0123|0123|-- **/
  tick() {
    this.beat++;

    if (this.beat >= 4) {
      this.beat = 0;
      this.measure++;
    }

    if (this.measure >= 4) {
      this.measure = 0;
    }

    /** Here:  --|    |    |  X |    |-- **/
    if (this.measure === 2 && this.beat === 2) {
      // Initiate data sync
    }

    /** Here:  --|    |    |   X|    |-- **/
    if (this.beat === 2 && this.measure === 3) {
      // If sync hasn't resolved, fail the game
    }

    if (this.beat === 0 && this.measure === 0) {
      let piecesLocked = 0;

      this.gameBoard.map((row) => {
        row.map((piece) => {
          if (piece === null) return;

          if (piece.purchaseLocked === false) {
            piece.purchaseLocked = true;
            piecesLocked++;
          }
        });
      });

      if (piecesLocked === 0) {
        this.gameMode = "move";
      }
    }
  }

  /**
   * How many pieces does the current player have?
   */
  get pieceCounts(): { [key in PieceTypes]: number } {
    const pieceCounts = {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    };

    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null || piece.player !== this.player) return;
        pieceCounts[piece.type]++;
      });
    });

    return pieceCounts;
  }

  /**
   * TODO: Config swap out so I can play test different pricing schemes
   */
  get piecePrices(): { [key in PieceTypes]: number } {
    // Price progression: Anything above highest price is double the last value
    const priceMap: { [key in PieceTypes]: Array<number> } = {
      pawn: new Array(8).fill(1).concat(new Array(4).fill(2)).concat([3]),
      knight: [3, 4, 5],
      bishop: [3, 4, 5],
      rook: [5, 5, 8],
      queen: [9, 20, 25],
      king: [0, 4, 15, 25],
    };

    const currentPrices: { [key in PieceTypes]: number } = {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    };

    Piece.allTypes.map((type) => {
      const count = this.pieceCounts[type];
      currentPrices[type] =
        priceMap[type].length <= count
          ? priceMap[type][priceMap[type].length - 1]
          : priceMap[type][count];
    });

    return currentPrices;
  }

  purchaseAndPlace(payload: {
    pieceType: PieceTypes;
    location: BoardLocation;
    player: "black" | "white";
  }): Piece {
    const { pieceType, location, player } = payload;

    const price = this.piecePrices[pieceType];
    if (this.gameMode !== "purchase")
      throw "Cannot purchase piece when not in purchase mode";

    if (this.gameBoard[location.r][location.c] !== null)
      throw "Cannot place on non-empty location";

    if (price > this.cash[player]) throw "Cannot afford that piece";

    this.cash[player] -= price;
    const piece = new Piece(player, pieceType, location, null, false);
    this.gameBoard[location.r][location.c] = piece;
    return piece;
  }

  movePiece(payload: {
    piece: Piece;
    moveTo: BoardLocation;
    player: "black" | "white";
  }): Piece {
    const { piece, moveTo, player } = payload;

    console.log("here");
    /** Handy variables **/
    const moveFrom = piece.location;
    const distanceHorizontal = Math.abs(moveFrom.c - moveTo.c);
    const distanceVertical = Math.abs(moveFrom.r - moveTo.r);
    Math.abs(distanceVertical) === Math.abs(distanceHorizontal);
    const rInc = moveFrom.r === moveTo.r ? 0 : moveFrom.r < moveTo.r ? 1 : -1;
    const cInc = moveFrom.c === moveTo.c ? 0 : moveFrom.c < moveTo.c ? 1 : -1;

    /** Global bad move checks **/
    if (this.gameMode !== "move") {
      throw "Can't move piece when not in move mode";
    }

    if (moveTo.r < 0 || moveTo.r > 7 || moveTo.c < 0 || moveTo.c > 7) {
      throw "Can't move off board";
    }

    if (this.gameBoard[moveTo.r][moveTo.c]?.player === player) {
      throw "Can't take your own piece";
    }

    if (piece.location.r === moveTo.r && piece.location.c === moveTo.c) {
      throw "Can't move to same space";
    }

    // if (piece.type !== "knight") {
    //   for (let i = 1; i < Math.max(distanceHorizontal, distanceVertical); i++) {
    //     if (this.gameBoard[moveFrom.r + i * rInc][moveFrom.c + i * cInc]) {
    //       throw "Can't jump over other pieces";
    //     }
    //   }
    // }

    /** Piece specific move checks **/
    switch (piece.type) {
      case "pawn":
        const pieceAtDestination = this.gameBoard[moveTo.r][moveTo.c];

        if (
          (moveFrom.r - moveTo.r > 0 && player === "black") ||
          (moveFrom.r - moveTo.r < 0 && player === "white")
        ) {
          throw "Not a valid pawn move: Can't move backwards";
        }

        // 1 space forwards
        if (
          distanceHorizontal === 0 &&
          distanceVertical === 1 &&
          pieceAtDestination === null
        ) {
          break;
        }

        // 2 spaces forwads
        if (
          distanceHorizontal === 0 &&
          distanceVertical === 2 &&
          // And we haven't jumped over another piece (checked in globals)
          pieceAtDestination === null &&
          piece.firstMove
        ) {
          break;
        }

        // Diagonal capture
        if (
          distanceHorizontal === 1 &&
          distanceVertical === 1 &&
          pieceAtDestination !== null &&
          pieceAtDestination.player !== player
        ) {
          break;
        }

        throw "Not a valid pawn move: Can only move 1/2 space forwards or 1 space diagonally if capturing";
      case "knight":
        if (
          (distanceHorizontal === 2 && distanceVertical === 1) ||
          (distanceHorizontal === 1 && distanceVertical === 2)
        ) {
          break;
        }

        throw "Not a valid knight move";
      case "bishop":
        if (distanceHorizontal !== distanceVertical) {
          throw "Bishops can only move diagonally";
        }
      case "rook":
        if (
          distanceHorizontal !== 0 &&
          distanceVertical !== 0
          // And we *are* moving (checked in globals)
        ) {
          throw "Rooks can only move horizontally or vertically";
        }

        break;
      case "queen":
        if (distanceHorizontal === distanceVertical) {
          // Diagonal
          break;
        } else if (distanceHorizontal === 0 || distanceVertical === 0) {
          // Horizontal or vertical
          break;
        }

        throw "Queens can only move horizontally, vertically, or diagonally";
      case "king":
        if (distanceHorizontal > 1 || distanceVertical > 1) {
          throw "Kings can only move 1 space";
        }

        break;
    }

    piece.moveTo = moveTo;
    piece.firstMove = false;
    return piece;
  }
}
