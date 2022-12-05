declare global {
  interface BoardLocation {
    r: number;
    c: number;
  }
  interface Piece {
    player: "black" | "white";
    type: "pawn" | "rook" | "knight" | "bishop" | "king" | "queen";
    location: BoardLocation;
    moveTo: null | BoardLocation;
  }
}
export {};
