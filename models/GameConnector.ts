import { compileScript } from "@vue/compiler-sfc";
import type { DataConnection } from "peerjs";

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
  role: "host" | "client";

  status: "connecting" | "connected" | "disconnected" = "connecting";
  callbacks: GameConnectorEventCallbacks = {
    ping: { resolve: null, reject: null },
    "sync-start": { resolve: null, reject: null },
    "purchase-and-place": { resolve: null, reject: null },
  };

  constructor(dc: DataConnection, role: "host" | "client") {
    this.dc = dc;
    this.role = role;

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
    return this.role === "client"
      ? this.clientReceive(event)
      : this.hostReceive(event);
  }

  /**
   * Initiate an event, like a ping.
   * Only the client initiates events
   */
  initiate(type: DataConnectionEvent["type"], content: object = {}) {
    if (this.role === "host") return;
    this.send(type, content);
    console.log("Client: I initiated event: ", { type, content });
  }

  /**
   * Host receives an event, like a ping, from the client
   *
   * If no callbacks, tell client to retry.
   * Try to resolve, then tell client ok.
   * If you couldn't resolve, fail and tell client.
   */
  hostReceive(receiveEvent: DataConnectionEvent) {
    const { type, content } = receiveEvent;
    const { resolve, reject } = this.callbacks[type];

    console.log("Host: I received response from client: ", receiveEvent);

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
   * Client receives an event, like a ping, from the host
   *
   * Retry: Host didn't set up his event yet... Try again three times
   * Failed: Host rejected the event. You should too
   * OK: Host has already resolved event specific promises. You should too.
   */
  retryCount = 0;
  clientReceive(responseEvent: DataConnectionEvent) {
    const { type, content, responseCode } = responseEvent;
    const { resolve, reject } = this.callbacks[type];

    console.log("Client: I received response from host: ", responseEvent);

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
    if (this.role === "client")
      throw "Client does not respond to communication";

    const payload = {
      type,
      content: Object.assign(content, { stamp: Date.now() }),
      responseCode,
    };
    console.log(`Host: I responded to ${type} with: `, payload);

    this.dc.send(payload);
  }

  oneWayPing: number = -1;

  /* ----------------------------- Events! ----------------------------- */
  ping() {
    return new Promise<void>((resolve, reject) => {
      // TODO: Callbacks is new EventCallback(), which sets resolve and reject, but also a timeout (which rejects) and an always (which clears everything out);
      this.callbacks["ping"] = {
        reject: () => {
          reject("Ping failed");
        },
        resolve: (content: DataConnectionEvent["content"]) => {
          this.oneWayPing = Date.now() - content.stamp;
          if (this.oneWayPing >= this.#maxPing) {
            throw `Ping too high (${this.oneWayPing}ms`;
          }

          if (this.status === "connecting") this.status = "connected";

          resolve();
          return content;
        },
      };

      this.initiate("ping");
    });
  }

  syncStart() {
    return new Promise<number>((resolve, reject) => {
      const proposedStart = Date.now() + 1000;

      this.callbacks["sync-start"] = {
        reject,
        resolve: (content: DataConnectionEvent["content"]) => {
          const latestProposed = Math.max(content.proposedStart, proposedStart);
          const now = Date.now();

          if (latestProposed - now <= this.#maxPing) {
            throw `Sync start too high (${latestProposed - Date.now()}ms)`;
          }

          resolve(latestProposed);
          return Object.assign(content, {
            proposedStart: latestProposed,
          });
        },
      };

      this.initiate("sync-start", { proposedStart });
    });
  }

  purchaseAndPlace() {
    return new Promise<void>((resolve, reject) => {
      //   this.callbacks["purchase-and-place"] = {
      //     reject,
      //     resolve: (content: DataConnectionEvent["content"]) => {
      //       resolve();
      //       return content;
      //     },
      //   };
      // shit
      //   this.send("purchase-and-place");
    });
  }

  disconnect(failure?: string) {
    if (failure) {
      console.error(`Disconnecting due to failure: ${failure}`);
    }

    this.dc.close();
  }
}
