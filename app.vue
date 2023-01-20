<template>
  <div
    class="h-[100vh] w-[100vw] bg-gray-900 grid place-content-center overflow-hidden"
  >
    <div
      class="max-w-6xl py-16 px-8 border-8"
      :class="[!ready ? '' : 'bg-gray-300 text-black']"
    >
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

        <template v-if="!resuming">
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

          <div class="col-span-2 grid items-center" v-if="message.text">
            <Notification :type="message.type">
              {{ message.text }}
            </Notification>
          </div>
        </template>

        <template v-else>
          <h2 class="text-2xl text-white col-span-2 grid gap-y-2">
            <p>Resuming previous game</p>
            <PixelLoader
              :message="`Waiting for ${enteredHostCode ? 'host' : 'client'}`"
            />
          </h2>

          <div class="col-span-2 grid items-center">
            <PixelButton type="warning" @click="disconnect(null)">
              Cancel
            </PixelButton>
          </div>
        </template>
      </div>
      <!-- TODO: Switch to a dark mode for GameMain -->
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

const message = reactive<{
  text: string | null;
  type: "error" | "success" | "info";
}>({
  text: "",
  type: "info",
});

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
  const ThePeerInstance = new Peer("", { debug: 3 });
  setupPeerHooks(ThePeerInstance);

  ThePeerInstance.on("open", (id: string) => {
    generatedHostCode.value = id;
  });
  ThePeerInstance.on("connection", (dc) => {
    setupDataConnection(dc, true);
  });
};

const joinGame = () => {
  joining.value = true;
  connectingToPeerInstace.value = true;
  ThePeerInstance = new Peer("", { debug: 3 });
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

  if (isHost) {
    localStorage.setItem("generatedHostCode", generatedHostCode.value);
  } else {
    localStorage.setItem("enteredHostCode", enteredHostCode.value);
  }

  ready.value = true;
};

const setupPeerHooks = (PeerInstance: Peer) => {
  // @ts-ignore
  PeerInstance.on("error", ({ type }) => {
    console.log(type);
    if (type === "peer-unavailable") {
      disconnect("Cannot connect to host :(");
    }
  });

  PeerInstance.on("disconnected", () => {
    console.log("disconnected");
    // TODO: Handle
  });

  PeerInstance.on("close", () => {
    console.log("close");
    // TODO: Handle
  });
};

const resuming = ref<boolean>(false);
const disconnect = (error: string | null = null) => {
  localStorage.removeItem("generatedHostCode");
  localStorage.removeItem("enteredHostCode");
  generatedHostCode.value = "";
  enteredHostCode.value = "";
  hosting.value = false;
  joining.value = false;
  connectingToPeerInstace.value = false;

  if (ThePeerInstance) ThePeerInstance.disconnect();
  resuming.value = false;

  if (error !== null) {
    message.text = error;
    message.type = "error";
  }
};

onMounted(() => {
  if (localStorage.getItem("generatedHostCode") !== null) {
    // @ts-ignore
    generatedHostCode.value = localStorage.getItem("generatedHostCode");
    hostGame();
  } else if (localStorage.getItem("enteredHostCode") !== null) {
    // @ts-ignore
    enteredHostCode.value = localStorage.getItem("enteredHostCode");
    joinGame();
  } else {
    return;
  }

  resuming.value = true;
});
</script>
