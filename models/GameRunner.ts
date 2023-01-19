import Piece from "./Piece";
import Wad from "web-audio-daw";
import { isEqual } from "lodash";

const saw = new Wad({
  source: "sawtooth",
  panning: [0, 1, 10],
  panningModel: "HRTF",
  rolloffFactor: "1",
});
// saw.play();
var sine = new Wad({ source: "sine" });
var square = new Wad({ source: "square" });
var triangle = new Wad({ source: "triangle" });

var tripleOscillator = new Wad.Poly({});

tripleOscillator.add(sine);
// tripleOscillator.add(square)
tripleOscillator.add(triangle);
tripleOscillator.add(saw);

const knock = (count: number) => {
  new Wad({
    source: "noise",
    env: {
      attack: 0.01,
      decay: 0.01,
      sustain: 0.1,
      hold: 0.05,
      release: 0.05,
    },
    filter: { type: "lowpass", frequency: 1000, q: 1 },
    volume: 1,
  }).play();
  const toneToPitch = {
    0: "C3",
    1: "C#3",
    2: "D3",
    3: "D#3",
    4: "E3",
    5: "F3",
    6: "F#3",
    7: "G3",
    8: "G#3",
    9: "A3",
    10: "A#3",
    11: "B3",
    12: "C4",
  };
  tripleOscillator.play({
    // @ts-ignore
    pitch: toneToPitch[count] ?? "C4",
    env: { attack: 0.1, decay: 0.1, sustain: 0.1, hold: 0.1, release: 0.1 },
    volume: 0.1,
  });
};

const crash = (count: number) => {
  new Wad({
    source: "noise",
    env: {
      attack: 0.01,
      decay: 0.01,
      sustain: 0.1,
      hold: 0.1,
      release: 0.1,
    },
    filter: { type: "highpass", frequency: 1000, q: 1 },
    volume: count,
  }).play();
};

// const clack = () => {
//     new Wad({
//         source: "noise",
//         env: {
//             attack: 0.01,
//             decay: 0.01,
//             sustain: 0.1,
//             hold: 0.05,
//             release: 0.05
//         },
//         filter: { type: "lowpass", frequency: 1000, q: 1 },
//         volume: 1
//     }).play()
// }

const newBoard = () => {
  return [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
};

export default class GameRunner {
  static size: number = 8;
  static maxMatches: number = 5;

  /** Internal game clock */
  bpm: number = 125;
  measure: 0 | 1 | 2 | 3 = 0;
  beat: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 = 0;
  clock: NodeJS.Timer | number | null = null;

  player: "black" | "white";
  gameBoard: Array<Array<null | Piece>>;
  gameMode: "purchase" | "move" | "gloat";

  // Normal chess starts with 43 in piece value
  cash: { black: number; white: number } = { black: 60, white: 60 };
  wins: Array<"black" | "white" | "tie"> = [];

  // How many MS, total, does THIS GameRunnerInstance need to catchup/slowdown in order to sync with the OTHER GameRunnerInstance
  moveMeasureCatchup: number = 0;

  constructor(setupOptions: { player: "black" | "white" }) {
    this.player = setupOptions.player;

    this.gameMode = "purchase";
    this.gameBoard = newBoard();
  }

  // Start the game
  start(bpm: null | number = null) {
    this.clock = setInterval(() => {
      this.tick();
    }, bpm || this.bpm);
  }

  stop() {
    if (typeof this.clock === "number") clearInterval(this.clock);
    this.clock = 0;
  }

  /** Measure: --|0000|1111|2222|3333|-- **/
  /** Beat:    --|0123|0123|0123|0123|-- **/
  tick() {
    this.beat++;

    if (this.beat >= 12) {
      this.beat = 0;
      this.measure++;
    }

    if (this.measure >= 4) {
      this.measure = 0;
    }

    if (this.measure === 3 && this.beat === 0) {
      if (this.moveMeasureCatchup !== 0) {
        this.stop();
        this.start(this.bpm + this.moveMeasureCatchup / 12);
      }
    }

    if (this.gameMode === "move" && this.measure === 3) {
      if (this.beat === 0) {
        this.unstunForNextRound();
      }

      this.stepPieces(this.beat);
    }

    if (this.measure === 0 && this.beat === 0) {
      if (this.moveMeasureCatchup !== 0) {
        this.moveMeasureCatchup = 0;
        this.stop();
        this.start(this.bpm);
      }

      // Need to loop one final time at measure0 beat0, running same collision logic
      if (this.gameMode === "move") {
        this.stepPieces(12);
        this.clearMovementPathing();
      } else if (this.gameMode === "purchase") {
        if (this.purchasesPendingCount === 0 && this.startingBoardValid) {
          this.gameMode = "move";
        }

        this.lockPendingPurchases();
      } else if (this.gameMode === "gloat") {
        this.gameBoard = newBoard();
        this.gameMode = "purchase";
      }

      const matchWinner = this.checkMatchWinner();
      if (matchWinner) {
        this.wins.push(matchWinner);
        this.gameMode = "gloat";

        if (this.gameWinner) {
          this.stop();
        }
      }
    }
  }

  /**
   * Find piece at board location
   *
   * Throw if no piece found
   * Additionally throw if piece does not match expected values
   */
  findPiece(
    location: BoardLocation,
    assertions?: { [key: string]: any }
  ): Piece {
    const piece = this.gameBoard[location.r][location.c];

    if (piece === null) {
      throw new Error("No piece found at location");
    }

    if (assertions) {
      Object.keys(assertions).map((key) => {
        if (!isEqual(piece[key as keyof Piece], assertions[key])) {
          throw new Error(
            `Piece at location does not match assertion ${key}=${assertions[key]}`
          );
        }
      });
    }

    return piece;
  }

  get startingBoardValid(): boolean {
    let whiteCount = 0;
    let blackCount = 0;

    this.gameBoard.flat().map((piece) => {
      if (piece !== null) {
        if (piece.player === "white") whiteCount++;
        if (piece.player === "black") blackCount++;
      }
    });

    return whiteCount > 0 && blackCount > 0;
  }

  get boardKings(): { blackKing: Piece | false; whiteKing: Piece | false } {
    const whiteKing =
      this.gameBoard
        .flat()
        .find((piece) => piece?.type === "king" && piece.player === "white") ||
      false;
    const blackKing =
      this.gameBoard
        .flat()
        .find((piece) => piece?.type === "king" && piece.player === "black") ||
      false;

    return { whiteKing, blackKing };
  }

  checkMatchWinner(): "white" | "black" | "tie" | false {
    if (this.gameMode !== "move") return false;

    const { whiteKing, blackKing } = this.boardKings;

    if (!whiteKing && !blackKing) return "tie";
    if (!whiteKing) return "black";
    if (!blackKing) return "white";
    return false;
  }

  // TODO: Finite this fucking state machine
  get gameWinner(): "white" | "black" | "tie" | undefined {
    const counts = {
      white: 0,
      black: 0,
      tie: 0,
    };
    const needed = Math.ceil(GameRunner.maxMatches / 2);
    let played = 0;

    this.wins.map((winner) => {
      counts[winner]++;
      played++;
    });

    if (counts.white >= needed) return "white";
    if (counts.black >= needed) return "black";

    let remaining = GameRunner.maxMatches - played;
    if (counts.white + remaining < counts.black) return "black";
    if (counts.black + remaining < counts.white) return "white";

    if (played < GameRunner.maxMatches) return undefined;
    if (counts.white === counts.black) return "tie";
    return counts.white > counts.black ? "white" : "black";
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

  get piecesWithMovement(): Array<Piece> {
    const pieces: Array<Piece> = [];

    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null || !piece.moveTo) return;
        pieces.push(piece);
      });
    });

    return pieces;
  }

  get syncing(): boolean {
    return (this.measure == 2 && this.beat >= 6) || this.measure >= 3;
  }

  get purchasesPendingCount(): number {
    let piecesLocked = 0;

    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null) return;

        if (piece.purchaseLocked === false) {
          piecesLocked++;
        }
      });
    });

    return piecesLocked;
  }

  lockPendingPurchases(): void {
    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null) return;
        piece.purchaseLocked = true;
      });
    });
  }

  purchaseAndPlace(payload: {
    type: PieceTypes;
    location: BoardLocation;
    player: "black" | "white";
  }): Piece {
    const { type, location, player } = payload;

    const price = this.piecePrices[type];
    if (this.gameMode !== "purchase")
      throw "Cannot purchase piece when not in purchase mode";

    if (this.gameBoard[location.r][location.c] !== null)
      throw "Cannot place on non-empty location";

    if (price > this.cash[player]) throw "Cannot afford that piece";

    this.cash[player] -= price;
    const piece = new Piece(player, type, location);
    this.gameBoard[location.r][location.c] = piece;
    return piece;
  }

  queueMove(payload: {
    type: PieceTypes;
    location: BoardLocation;
    moveTo: BoardLocation;
    player: "black" | "white";
  }): Piece {
    const { type, location, moveTo, player } = payload;
    const piece = this.findPiece(location, { type, player });

    /** Handy variables **/
    const distanceHorizontal = Math.abs(location.c - moveTo.c);
    const distanceVertical = Math.abs(location.r - moveTo.r);
    Math.abs(distanceVertical) === Math.abs(distanceHorizontal);
    const rInc = location.r === moveTo.r ? 0 : location.r < moveTo.r ? 1 : -1;
    const cInc = location.c === moveTo.c ? 0 : location.c < moveTo.c ? 1 : -1;

    /** CS-chess specific ruleset **/
    if (piece.stunned) {
      throw "Can't move stunned piece, try again next turn";
    }

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
    //     if (this.gameBoard[location.r + i * rInc][location.c + i * cInc]) {
    //       throw "Can't jump over other pieces";
    //     }
    //   }
    // }

    /** Piece specific move checks **/
    switch (piece.type) {
      case "pawn":
        const pieceAtDestination = this.gameBoard[moveTo.r][moveTo.c];

        if (
          (location.r - moveTo.r > 0 && player === "black") ||
          (location.r - moveTo.r < 0 && player === "white")
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

        break;
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

    piece.movementPathing = this.setupPieceMovementPathing(piece);

    return piece;
  }

  stepPieces(beat: number) {
    const tempBoard: Array<Array<null | Array<Piece>>> = newBoard();

    // Move pieces based on current "beat"
    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null || piece.moveTo === null) {
          return;
        }

        let transit = piece.movementPathing.find((path) => {
          return path.beat <= beat;
        }) ?? { location: { r: piece.location.r, c: piece.location.c } };

        const { r, c } = transit.location;

        if (tempBoard[r][c] === null) {
          tempBoard[r][c] = [];
        }
        // @ts-ignore
        tempBoard[r][c].push(piece);
      });
    });

    // If tempBoard has a square with more than 1 piece, stun them at their pre-collision locations.
    let collisionCount = 0;
    let movementCount = 0;
    tempBoard.map((row, rIndex) => {
      row.map((pieces, cIndex) => {
        if (pieces === null) {
          return;
        }

        if (pieces.length > 1) {
          pieces.map((piece) => {
            piece.movementPathing = [];
            piece.stunned = true;
          });

          collisionCount++;
        } else {
          const piece = pieces[0];
          if (piece.location.r !== rIndex || piece.location.c !== cIndex) {
            this.gameBoard[piece.location.r][piece.location.c] = null;
            this.gameBoard[rIndex][cIndex] = piece;
            piece.location = { r: rIndex, c: cIndex };

            movementCount++;
          }
        }
      });
    });

    // TODO: Collision detection for two pieces swapping location with each other on the same beat.
    //       ^ {type: 'queen', loc: {r: 0, c: 0}, moveTo: {r: 0, c: 2}}
    //       ^ {type: 'queen', loc: {r: 0, c: 3}, moveTo: {r: 0, c: 1}}

    // TODO: Sound effect handler to abstract [Data needed to render reactive sound] [the effect itself]
    if (movementCount > 0) {
      knock(movementCount);
    }
    if (collisionCount > 0) {
      crash(collisionCount);
    }
  }

  setupPieceMovementPathing(piece: Piece): Piece["movementPathing"] {
    if (!piece.moveTo) throw "Piece has no moveTo property";
    if (piece.movementPathing.length !== 0)
      throw "Piece already has movementPathing";

    // Such a weird exception better to handle it here
    if (piece.type === "knight") return this.setupKnightMovementPathing(piece);

    const movementPathing = [];

    const distance = Math.max(
      Math.abs(piece.location.r - piece.moveTo.r),
      Math.abs(piece.location.c - piece.moveTo.c)
    );

    for (let i = 1; i < distance; i++) {
      const r =
        piece.location.r + (i * (piece.moveTo.r - piece.location.r)) / distance;
      const c =
        piece.location.c + (i * (piece.moveTo.c - piece.location.c)) / distance;

      const interval = 12 / (distance - 1);
      let beat = Math.floor((i - 1) * interval);

      /* D6 exception explained */

      // d1:                                      (12)
      // d2: 0,                                   (12)
      // d3: 0,                6,                 (12)
      // d4: 0,          4,          8,           (12)
      // d5: 0,       3,       6,       9,        (12)
      // d6: 0,    2.4,  4.8,     7.2,  9.6,      (12) <-- Exception!
      // d7: 0,    2,    4,    6,    8,    10,    (12)

      // Can't have decimals, so Math.floor(beat)
      // Works for all except 7.2.         [0  2  4   7  9  X] feels like a misplaced beat.
      // We want triplet | double rythem   [0  2  4  6   9  X]
      if (distance === 6 && i === 4) beat = 6;

      movementPathing.push({
        location: { r, c },
        beat,
      });
    }

    // All movement ends on beat 12 at final location
    movementPathing.push({
      location: { r: piece.moveTo.r, c: piece.moveTo.c },
      beat: 12,
    });

    // Reverse the pathing so we can .find() easier
    return movementPathing.reverse();
  }

  setupKnightMovementPathing(piece: Piece): Piece["movementPathing"] {
    if (!piece.moveTo) throw "Piece has no moveTo property";

    // Knights always travel longest distance first EG:
    // 0,0 -> 2,1: [{0, 0}, {1, 0}, {2, 0}, {2, 1}]

    // @ts-ignore
    const yMod: 0 | 2 | -2 =
      Math.abs(piece.moveTo.r - piece.location.r) === 1
        ? 0
        : piece.moveTo.r - piece.location.r;
    // @ts-ignore
    const xMod: 0 | 2 | -2 =
      Math.abs(piece.moveTo.c - piece.location.c) === 1
        ? 0
        : piece.moveTo.c - piece.location.c;

    const movementPathing = [];
    movementPathing.push({
      beat: 0,
      location: {
        r: piece.location.r + yMod / 2,
        c: piece.location.c + xMod / 2,
      },
    });

    movementPathing.push({
      beat: 6,
      location: {
        r: piece.location.r + yMod,
        c: piece.location.c + xMod,
      },
    });

    movementPathing.push({ beat: 12, location: piece.moveTo });

    return movementPathing.reverse();
  }

  unstunForNextRound() {
    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null) return;
        piece.stunned = false;
      });
    });
  }

  clearMovementPathing() {
    this.gameBoard.map((row) => {
      row.map((piece) => {
        if (piece === null) return;
        piece.movementPathing = [];
        piece.moveTo = null;
      });
    });
  }
}
