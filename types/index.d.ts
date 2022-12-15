declare global {
  interface DataConnectionEvent {
    type:
      | "ping"
      | "pong"
      | "game-setup"
      | "game-start"
      | "game-move"
      | "game-end";
    content: {
      stamp: number;
    };
  }

  interface GameSetupOptions {
    tempo: number;
    startingCash: number;
    remotePlayerId: string;
  }

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
