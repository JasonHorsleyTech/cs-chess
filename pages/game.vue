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
          :value="`localhost:3000/game?id=${id}&role=${'client'}&secret=${hostSecret}`"
        />
      </template>
    </template>
    <GameMain :TheGameConnector="TheGameConnector" />
  </div>
</template>
<script lang="ts" setup>
import { Peer } from "peerjs";
import type { DataConnection } from "peerjs";
import { v4 as uuidv4 } from "uuid";
import GameConnector from "~/models/GameConnector";

definePageMeta({
  middleware: "has-game-id",
});

const route = useRoute();
const id: string = `${route.query.id}`;
const role: "host" | "client" =
  `${route.query.role}` === "host" ? "host" : "client";
const hostSecret = uuidv4();

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
        if (dc.metadata?.secret !== hostSecret) {
          reject("Handshake failed");
        } else {
          resolve(dc);
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
          metadata: { secret: route.query.secret },
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
        await TheGameConnector.ping();
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
    tearDown();
  }
});

const tearDown = () => {
  TheGameConnector?.disconnect();
  ThePeerInstance?.disconnect();
};

// Mostly so I can use HMR without
// * Reloading with same game ID
// * Attempting to reconnect on same host UUID
// * Getting a "Someone already has that" error (because keepalive: 5s)
onBeforeUnmount(tearDown);
</script>
