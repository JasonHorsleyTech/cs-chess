import { compileScript } from "@vue/compiler-sfc";
import type { DataConnection } from "peerjs";
import Piece from "./Piece";

const isDataConnectionEvent = (data: any): data is DataConnectionEvent => {
  return (
    typeof data === "object" &&
    // TODO: How to keep this in sync with DataConnectionEvent interface??
    typeof data.type === "string" &&
    typeof data.content === "object" &&
    typeof data.content.stamp === "number"
  );
};

export default class GameConnector {
  #maxPing = 500;

  dc: DataConnection;

  status: "connecting" | "connected" | "disconnected" = "connecting";
  callbacks: GameConnectorEventCallbacks = {
    ping: { resolve: null, reject: null },
    "tutorial-finished": { resolve: null, reject: null },
    "sync-start": { resolve: null, reject: null },
    "purchase-and-place": { resolve: null, reject: null },
    "queue-move": { resolve: null, reject: null },
    "sync-game-state": { resolve: null, reject: null },
  };

  constructor(dc: DataConnection) {
    this.dc = dc;

    this.dc.on("data", (d) => {
      if (isDataConnectionEvent(d)) {
        this.receive(d);
      } else {
        console.error("Failed to parse event");
        console.debug(d);
      }
    });
  }

  /**
   * Send a message through PeerJS: Add stamp if none present
   */
  send(type: DataConnectionEvent["type"], content: object = {}) {
    this.dc.send({
      type,
      content: Object.assign(content, { stamp: Date.now() }),
    });
  }

  /**
   * Handle incoming messages from PeerJS: Branch path for client and host
   */
  receive(event: DataConnectionEvent) {
    return typeof event.responseCode === "undefined"
      ? this.processNewEvent(event)
      : this.receieveProcessedEvent(event);
  }

  /**
   * Host receives an event, like a ping, from the client
   *
   * If no callbacks, tell client to retry.
   * Try to resolve, then tell client ok.
   * If you couldn't resolve, fail and tell client.
   */
  processNewEvent(receiveEvent: DataConnectionEvent) {
    const { type, content } = receiveEvent;
    const { resolve, reject } = this.callbacks[type];

    // console.log("Host: I received response from client: ", receiveEvent);

    if (resolve === null) {
      this.respond(type, content, "retry");
      return;
    }

    try {
      const responseContent = resolve(content);
      this.respond(type, responseContent, "ok");
    } catch (error) {
      console.error(error);
      if (reject !== null) reject();
      this.respond(type, {}, "failed");
    }
  }

  /**
   * Client gets their initiated event returned, after host processed it
   *
   * Retry: Host didn't set up his event yet... Try again three times
   * Failed: Host rejected the event. You should too
   * OK: Host has already resolved event specific promises. You should too.
   */
  retryCount = 0;
  receieveProcessedEvent(responseEvent: DataConnectionEvent) {
    const { type, content, responseCode } = responseEvent;
    const { resolve, reject } = this.callbacks[type];

    // console.log("Client: I received response from host: ", responseEvent);

    if (!resolve) throw "Weird error, idk you figure it out.";

    if (responseCode === "retry") {
      this.retryCount++;
      if (this.retryCount >= 3) {
        return this.disconnect("Connection lost, reason: Retry count maxed.");
      }

      const safeRetryDelay =
        this.oneWayPing === -1 ? this.#maxPing : this.oneWayPing * 10;

      return setTimeout(() => {
        this.send(type, content);
      }, safeRetryDelay);
    }

    if (responseCode === "failed") {
      return reject && reject();
    }

    if (responseCode === "ok") {
      return resolve(content);
    }
  }

  respond(
    type: DataConnectionEvent["type"],
    content: object = {},
    responseCode: DataConnectionEvent["responseCode"]
  ) {
    const payload = {
      type,
      content: Object.assign(content, { stamp: Date.now() }),
      responseCode,
    };
    // console.log(`Host: I responded to ${type} with: `, payload);

    this.dc.send(payload);
  }

  oneWayPing: number = -1;

  /* ----------------------------- Events! ----------------------------- */
  ping(initiate: boolean = true) {
    return new Promise<void>((resolve, reject) => {
      const rejectCallback = (reason = "") => {
        reject(reason);
      };
      const pingFail = window.setTimeout(() => {
        rejectCallback("Ping timed out");
      }, 1000);

      this.callbacks["ping"] = {
        reject: rejectCallback,
        resolve: (content: DataConnectionEvent["content"]) => {
          clearTimeout(pingFail);

          this.oneWayPing = Date.now() - content.stamp;
          if (this.oneWayPing >= this.#maxPing) {
            throw `Ping too high (${this.oneWayPing}ms`;
          }

          if (this.status === "connecting") this.status = "connected";

          resolve();
          return content;
        },
      };

      if (initiate) this.send("ping");
    });
  }

  syncStart(initiate: boolean = true) {
    return new Promise<number>((resolve, reject) => {
      const proposedStart = Date.now() + 1000;
      const unsetCallbacks = () => {
        this.callbacks["sync-start"] = {
          reject: null,
          resolve: null,
        };
      };

      this.callbacks["sync-start"] = {
        reject: () => {
          unsetCallbacks();
          reject();
        },
        resolve: (content: DataConnectionEvent["content"]) => {
          const latestProposed = Math.max(content.proposedStart, proposedStart);
          const now = Date.now();

          if (latestProposed - now <= this.#maxPing) {
            throw `Sync start too high (${latestProposed - Date.now()}ms)`;
          }

          resolve(latestProposed);
          unsetCallbacks();
          return Object.assign(content, {
            proposedStart: latestProposed,
          });
        },
      };

      if (initiate) this.send("sync-start", { proposedStart });
    });
  }

  // Generic events: Used for anything where the callback logic is set up elsewhere
  event(
    event:
      | "purchase-and-place"
      | "queue-move"
      | "sync-game-state"
      | "tutorial-finished",
    payload: Object = {}
  ) {
    return new Promise<void>((resolve, reject) => {
      this.send(event, payload);
    });
  }

  disconnect(failure?: string) {
    if (failure) {
      console.error(`Disconnecting due to failure: ${failure}`);
    }

    this.dc.close();
  }
}
