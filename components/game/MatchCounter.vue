<template>
  <div class="mx-auto flex gap-x-2 items-end text-center">
    <p>Wins:</p>
    <div
      v-for="index in GameRunner.maxMatches"
      class="w-5 h-5 border-b"
      :class="{
        'border-green-500': wins[index - 1] === player,
        'border-red-500': wins[index - 1] === opposite,
        'border-gray-600 ': wins[index - 1] === 'tie',
        'border-gray-600 border-dashed': !wins[index - 1],
      }"
    >
      <div
        class="w-4 h-4 bg-center bg-no-repeat bg-contain"
        :style="bgsvg(`${wins[index - 1]}-king`)"
      >
        <p class="-mt-[3px]" v-if="wins[index - 1] === 'tie'">-</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameRunner from "~~/models/GameRunner";

const props = defineProps<{
  wins: Array<"white" | "black" | "tie">;
  player: "white" | "black";
}>();
const opposite = props.player === "white" ? "black" : "white";
</script>
