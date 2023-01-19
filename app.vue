<template>
  <div class="h-[100vh] w-[100vw] bg-gray-900">
    <div
      class="max-w-6xl py-16 px-2 mx-auto grid gap-x-8 gap-y-16 grid-cols-2 place-items-center"
    >
      <PixelText
        text="cs-chess"
        :animate="true"
        :class="[
          'col-span-2',
          '[&_.isPixel]:md:h-4 [&_.isPixel]:md:w-4 [&_.isPixel]:lg:h-6 [&_.isPixel]:lg:w-6',
        ]"
      ></PixelText>
      <PixelButton type="info" @click="newGame" :disabled="starting">
        {{ starting ? "Connecting to the moon..." : "New game" }}
      </PixelButton>
      <PixelButton type="info" :disabled="starting">Join game</PixelButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
const secret = uuidv4();

const starting = ref<boolean>(false);
const newGame = () => {
  starting.value = true;
  const PeerInstance = new Peer();
  PeerInstance.on("open", (id: string) => {
    PeerInstance.on("disconnected", () => {
      navigateTo({
        path: "/play",
        query: {
          id,
          secret,
          role: "host",
        },
      });
    });

    PeerInstance.disconnect();
  });
};
</script>
