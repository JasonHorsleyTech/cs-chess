<template>
  <div
    class="relative p-4 border h-16 w-16 mx-auto"
    :class="[disabled ? '' : 'group cursor-pointer']"
  >
    <div class="absolute flex items-center flex-wrap inset-0 p-1">
      <div
        class="w-full h-full rounded-lg bg-green-600/50 group-hover:bg-green-500/75 shadow-inner border-green-700/50 border-2"
      ></div>

      <span
        class="rounded-md border border-gray-300 text-white bg-gray-500 text-center px-1 text-xs mx-auto -translate-y-1/2 shadow"
      >
        Free!
      </span>
    </div>

    <Piece :piece-type="pieceType" :player="player"></Piece>
    <!-- :class="[selected ? 'animate-wiggle' : '']" -->

    <span
      class="absolute top-0 right-0 rounded-full bg-red-600 text-white w-4 h-4 overflow-hidden text-[8px] font-bold border border-red-700"
    >
      <span class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        0
      </span>
    </span>
  </div>
</template>
<script lang="ts" setup>
import Piece from "../Piece.vue";

const props = defineProps<{
  pieceType: Piece["type"];
  player: "black" | "white";
  disabled: Boolean;
  //   selected: Boolean;
}>();
</script>
