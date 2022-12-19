<template>
  <div class="grid">
    <p v-if="error">{{ error }}</p>
    <template v-else-if="status !== 'connected'">
      <p>Status: {{ status }}</p>
      <template v-if="role === 'host'">
        <p>Send this link to your friend to start playing</p>
        <input
          type="text"
          readonly
          class="w-full"
          :value="`localhost:3000/play?id=${id}&role=${'client'}&secret=${secret}`"
        />
      </template>
    </template>
    <GameMain v-else :TheGameConnector="TheGameConnector" :role="role" />
  </div>
</template>
<script lang="ts" setup>
import { Peer } from "peerjs";
import type { DataConnection } from "peerjs";
import GameConnector from "~/models/GameConnector";

definePageMeta({
  middleware: "has-game-id",
});

const route = useRoute();
const id: string = `${route.query.id}`;
const role: "host" | "client" =
  `${route.query.role}` === "host" ? "host" : "client";
const secret: string = `${route.query.secret}`;

const status = ref<
  | "connecting-to-servers"
  | "waiting-for-other-players"
  | "connecting-to-host"
  | "testing-connection-strength"
  | "connected"
  | "disconnected"
>("connecting-to-servers");
const error = ref<null | string>();

let ThePeerInstance: Peer;
const setupDataConnection = () => {
  return new Promise<DataConnection>((resolve, reject) => {
    if (role === "host") {
      // First one here
      ThePeerInstance = new Peer(id, { debug: 0 });

      ThePeerInstance.on("open", () => {
        status.value = "waiting-for-other-players";
      });

      ThePeerInstance.on("connection", (dc) => {
        if (dc.metadata?.secret !== secret) {
          reject("Handshake failed");
        } else {
          resolve(dc);
        }
      });

      ThePeerInstance.on("error", (error) => {
        // @ts-ignore
        if (error.type === "unavailable-id") {
          console.log("Copy the input idiot");
        }
      });
    } else {
      // Second one here
      if (typeof route.query.secret !== "string") {
        reject("Bad join URL");
      }

      ThePeerInstance = new Peer("", { debug: 0 });

      ThePeerInstance.on("open", () => {
        status.value = "connecting-to-host";
        const dc = ThePeerInstance.connect(id, {
          metadata: { secret },
        });

        resolve(dc);
      });
    }

    // TODO: reject for timeout to PeerJS
  });
};

let TheGameConnector: GameConnector;
const setupGameConnector = (dc: DataConnection) => {
  return new Promise<GameConnector>((resolve, reject) => {
    TheGameConnector = new GameConnector(dc);

    setTimeout(async () => {
      try {
        await TheGameConnector.ping(role === "client");
        resolve(TheGameConnector);
      } catch (message) {
        reject(message);
      }
    }, 500);
  });
};

onMounted(async () => {
  try {
    const dc = await setupDataConnection();
    status.value = `testing-connection-strength`;

    await setupGameConnector(dc);
    status.value = `connected`;
  } catch (message) {
    status.value;
    error.value = `${message}`;
    tearDown(error.value);
  }
});

const tearDown = (message?: string) => {
  TheGameConnector?.disconnect(message);
  ThePeerInstance?.disconnect();
};

// Mostly so I can use HMR without
// * Reloading with same game ID
// * Attempting to reconnect on same host UUID
// * Getting a "Someone already has that" error (because keepalive: 5s)
onBeforeUnmount(tearDown);
</script>
