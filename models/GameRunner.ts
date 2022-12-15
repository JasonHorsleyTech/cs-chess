export default class GameRunner {
  static size: number = 8;
  board: Array<Array<null | Piece>>;
  mode: "purchase" | "move";

  constructor() {
    this.board = new Array(8).fill(new Array(8).fill(null));
    this.mode = "purchase";
  }

  purchasePiece(piece: Piece, location: BoardLocation) {
    if (this.mode !== "purchase")
      throw new Error("Cannot purchase piece when not in purchase mode");
    if (this.board[location.r][location.c] !== null)
      throw new Error("Cannot purchase piece on non-empty location");

    this.board[location.r][location.c] = piece;
  }
}
