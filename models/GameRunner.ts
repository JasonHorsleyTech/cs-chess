export default class GameRunner {
  static size: number = 8;

  measure: 0 | 1 | 2 | 3 = 0;
  beat: 0 | 1 | 2 | 3 = 0;
  beatSubdivision: number = 0;

  board: Array<Array<null | Piece>>;
  mode: "purchase" | "move";

  clock: NodeJS.Timer | number | null = null;
  #deep: { test: number };

  constructor() {
    this.board = new Array(8).fill(new Array(8).fill(null));
    this.mode = "purchase";
    this.#deep = {
      test: 1,
    };
  }

  // Start the game
  start() {
    console.log("started");
    this.clock = setInterval(() => {
      this.tick();
    }, 250);
  }
  stop() {
    if (typeof this.clock === "number") clearInterval(this.clock);
  }

  test() {
    this.#deep.test++;
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

  purchasePiece(piece: Piece, location: BoardLocation) {
    if (this.mode !== "purchase")
      throw new Error("Cannot purchase piece when not in purchase mode");
    if (this.board[location.r][location.c] !== null)
      throw new Error("Cannot purchase piece on non-empty location");

    this.board[location.r][location.c] = piece;
  }
}
