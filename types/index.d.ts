import Piece from "~~/models/Piece";

declare global {
  type ConfirmRejectCallbacks = [() => void, (rejectReason? = string) => void];

  interface DataConnectionEvent {
    type:
      | "ping"
      | "tutorial-finished"
      | "sync-start"
      | "purchase-and-place"
      | "queue-move"
      | "sync-game-state";
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
    "tutorial-finished": {
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
    "queue-move": {
      resolve: null | ((any) => DataConnectionEvent["content"]);
      reject: null | (() => void);
    };
    "sync-game-state": {
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

  type PieceTypes = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
}
export {};
