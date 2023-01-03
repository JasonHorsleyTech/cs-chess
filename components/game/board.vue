<template>
  <div
    class="relative flex mx-auto border border-gray-400"
    :class="[player === 'black' ? 'flex-col-reverse' : 'flex-col']"
  >
    <div class="absolute w-full h-full inset-0">
      <slot name="board" />
    </div>
    <div
      v-for="(row, r) in board"
      class="flex border-gray-300"
      :class="[player === 'black' ? 'flex-row-reverse' : 'flex-row']"
    >
      <div v-for="(piece, c) in row" class="grid">
        <div
          class="group relative w-8 h-8"
          :class="[
            // Checkerboard pattern
            (c + r) % 2 ? 'bg-gray-300/50' : 'bg-gray-50/50',
            'hover:bg-gray-400 cursor-pointer',

            piece !== null ? 'hover:bg-blue-200' : '',

            piece?.stunned || disabled
              ? 'pointer-events-none opacity-50'
              : 'pointer-events-auto',
          ]"
          @click="$emit('clickSquare', { r, c })"
        >
          <slot
            class="w-8 h-8 absolute inset-0"
            name="square"
            v-bind="{ r, c }"
          />

          <div class="w-8 h-8 inset-0 absolute grid place-content-stretch">
            <slot v-if="piece !== null" name="piece" v-bind="piece"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Piece from "~~/models/Piece";

const props = defineProps<{
  player: "white" | "black";
  board: Array<Array<null | Piece>>;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "clickSquare", location: BoardLocation): void;
}>();
</script>
