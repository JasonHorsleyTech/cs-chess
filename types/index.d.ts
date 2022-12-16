declare global {
  interface DataConnectionEvent {
    type: "ping" | "sync-start";
    content: {
      stamp: number;
      [key: string]: any;
    };
    responseCode?: "ok" | "retry" | "failed";
  }
  interface GameConnectorEventCallbacks {
    ping: {
      resolve: null | ((any) => DataConnectionEvent["content"]);
      reject: null | (() => void);
    };
    "sync-start": {
      resolve: null | ((any) => DataConnectionEvent["content"]);
      reject: null | (() => void);
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
