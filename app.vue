<template>
  <div
    class="h-[100vh] w-[100vw] bg-gray-900 grid place-content-center overflow-hidden"
  >
    <div class="max-w-6xl py-16 px-8 border-8">
      <div
        v-if="!ready"
        class="grid gap-x-8 gap-y-16 grid-cols-2 place-items-center"
      >
        <PixelText
          text="cs-chess"
          :animate="true"
          :class="[
            'col-span-2',
            '[&_.isPixel]:md:h-4 [&_.isPixel]:md:w-4 [&_.isPixel]:lg:h-6 [&_.isPixel]:lg:w-6',
          ]"
        ></PixelText>

        <PixelButton
          type="info"
          @click="hostGame"
          :disabled="hosting || joining"
        >
          Host game
        </PixelButton>

        <div>
          <template v-if="hosting">
            <PixelLoader
              v-if="!generatedHostCode"
              message="Connecting to the moon"
            />
            <p v-else class="grid gap-y-2">
              <span>Share this code with your opponent</span>
              <span
                class="border-white border rounded text-white text-xs p-1 text-center"
                v-text="generatedHostCode"
              />
            </p>
          </template>
        </div>

        <PixelButton
          class="self-end mb-1"
          type="info"
          :disabled="hosting"
          @click="joining = !joining"
        >
          {{ !joining ? "Join game" : "&nbsp;&nbsp;...wait" }}
        </PixelButton>

        <div class="grid gap-y-2 min-h-[5rem]">
          <PixelTextInput
            v-if="joining"
            label="Paste gamecode here"
            v-model="enteredHostCode"
          >
            <template #button>
              <PixelButton
                @click="joinGame"
                type="success"
                class="shrink-0"
                :loading="connectingToPeerInstace"
              >
                ✓
              </PixelButton>
            </template>
          </PixelTextInput>
        </div>
      </div>
      <GameMain
        v-else
        :TheGameConnector="TheGameConnector"
        :role="hosting ? 'host' : 'client'"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
import type { DataConnection } from "peerjs";
import GameConnector from "./models/GameConnector";

let ThePeerInstance: Peer;
let TheGameConnector: GameConnector;

const connectingToPeerInstace = ref<boolean>(false);

// Are we ready to play?
const ready = ref<boolean>(false);

// Does the player want to host?
const hosting = ref<boolean>(false);
// This is the host's ID
const generatedHostCode = ref<string>("");

// Does the palyer want to join?
const joining = ref<boolean>(false);
// This is what the client think's their host ID is
const enteredHostCode = ref<string>("");

const hostGame = () => {
  hosting.value = true;
  connectingToPeerInstace.value = true;
  const ThePeerInstance = new Peer("", { debug: 0 });
  setupPeerHooks(ThePeerInstance);

  ThePeerInstance.on("open", (id: string) => {
    generatedHostCode.value = id;
  });
  ThePeerInstance.on("connection", (dc) => {
    setupDataConnection(dc, true);
  });
};

const joinGame = () => {
  connectingToPeerInstace.value = true;
  ThePeerInstance = new Peer("", { debug: 0 });
  setupPeerHooks(ThePeerInstance);

  ThePeerInstance.on("open", () => {
    const dc = ThePeerInstance.connect(enteredHostCode.value);
    setupDataConnection(dc, false);
  });
};

const setupDataConnection = async (
  TheDataConnection: DataConnection,
  isHost: boolean
) => {
  TheGameConnector = new GameConnector(TheDataConnection);
  await delay(500);
  await TheGameConnector.ping(isHost);
  ready.value = true;
};

const setupPeerHooks = (PeerInstance: Peer) => {
  PeerInstance.on("error", (err) => {
    console.error(err);
  });

  PeerInstance.on("disconnected", () => {
    // TODO: Handle
  });

  PeerInstance.on("close", () => {
    // TODO: Handle
  });
};
</script>
