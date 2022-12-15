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
  #maxPingRoundTrip = 500;

  status: "connecting" | "connected" | "disconnected" = "connecting";
  dc: DataConnection;

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

  receive(event: DataConnectionEvent) {
    switch (event.type) {
      case "ping":
        this.dc.send({ type: "pong", content: event.content });
        break;
      case "pong":
        if (this.pingResolve === null || this.pingReject === null) {
          console.error("Got a pong but no ping was sent");
        } else {
          this.pingRoundTrip = Date.now() - event.content.stamp;
          if (this.pingRoundTrip < this.#maxPingRoundTrip) {
            if (this.status === "connecting") this.status = "connected";
            
            this.pingResolve(this.pingRoundTrip);
          } else {
            this.pingReject(`Ping too high (${this.pingRoundTrip}ms)`);
          }
          this.pingResolve = null;
          this.pingReject = null;
        }
        break;
      default:
        console.log(`Unknown event type: ${event.type}. Ignoring.s`);
        break;
    }
  }

  pingResolve: null | ((value: any | PromiseLike<void>) => void) = null;
  pingReject: null | ((reason?: any) => void) = null;
  pingRoundTrip: number = -1;
  ping() {
    return new Promise<void>((resolve, reject) => {
      this.pingResolve = resolve;
      this.pingReject = reject;

      this.dc.send({ type: "ping", content: { stamp: Date.now() } });
    });
  }

  disconnect() {
    this.dc.close();
  }
}
