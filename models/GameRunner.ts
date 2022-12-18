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
    this.gameBoard = new Array(GameRunner.size).fill(
      new Array(GameRunner.size).fill(null)
    );
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
    console.log(this.beat);
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
  }

  /**
   * How many pieces does the current player have?
   */
  get pieceCount(): { [key in Piece["type"]]: number } {
    const pieceCount = {
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
        pieceCount[piece.type]++;
      });
    });

    return pieceCount;
  }

  /**
   * TODO: Config swap out so I can play test different pricing schemes
   */
  get piecePrices(): { [key in Piece["type"]]: number } {
    // Price progression: Anything above highest price is double the last value
    const priceMap: { [key in Piece["type"]]: Array<number> } = {
      pawn: new Array(8).fill(1).concat(new Array(4).fill(2)).concat([3]),
      knight: [3, 4],
      bishop: [3, 4],
      rook: [5, 5, 8],
      queen: [9, 20, 25],
      king: [0, 4, 15, 25],
    };

    const currentPrices: { [key in Piece["type"]]: number } = {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    };

    (Object.keys(priceMap) as Array<Piece["type"]>).map((type) => {
      const count = this.pieceCount[type];
      currentPrices[type] =
        priceMap[type].length < count
          ? priceMap[type][priceMap[type].length - 1]
          : priceMap[type][count];
    });

    return currentPrices;
  }

  purchaseAndPlace(
    piece: Piece,
    location: BoardLocation,
    player: "black" | "white"
  ): ConfirmRejectCallbacks {
    const price = this.piecePrices[piece.type];
    if (this.gameMode !== "purchase")
      throw "Cannot purchase piece when not in purchase mode";
    if (this.gameBoard[location.r][location.c] !== null)
      throw "Cannot place on non-empty location";
    if (price > this.cash[player]) throw "Cannot afford that piece";

    this.cash[player] -= price;
    this.gameBoard[location.r][location.c] = piece;

    return [
      () => {
        let boardLoc = this.gameBoard[location.r][location.c];
        if (boardLoc === null) throw "TODO: Figure this out, good luck";

        boardLoc.purchaseVerified = true;
      },
      (rejectReason) => {
        // TODO: Check for valid reject reason (didn't sync in time) and cheater flag
        this.gameBoard[location.r][location.c] = null;
        this.cash[player] += price;
      },
    ];
  }
}
