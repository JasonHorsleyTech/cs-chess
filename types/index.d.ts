declare global {
  type ConfirmRejectCallbacks = [() => void, (rejectReason? = string) => void];

  interface DataConnectionEvent {
    type: "ping" | "sync-start" | "purchase-and-place";
    content: {
      stamp: number;
      [key: string]: any;
    };
    handleAs: "host" | "client";
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
    "purchase-and-place": {
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

  type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

  interface Piece {
    player: "black" | "white";
    type: PieceType;
    location: BoardLocation;
    moveTo: null | BoardLocation;
    purchaseVerified: boolean;
    // Has player 2 also verified the move/purchase?
  }
}
export {};
