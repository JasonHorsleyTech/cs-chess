<template>
  <div class="grid grid-cols-8 grid-rows-8 border border-gray-800/25">
    <template v-for="(row, rIndex) in board">
      <template
        v-for="(piece, cIndex) in row"
        :key="`${rIndex}-${cIndex}-slot`"
      >
        <div
          class="grid place-content-stretch p-1"
          :class="[rIndex % 2 ? 'odd:bg-gray-800/25' : 'even:bg-gray-800/25']"
        >
          <GamePiece
            v-if="piece !== null"
            :piece="piece"
            :key="`${rIndex}-${cIndex}-piece`"
          />
          <div v-else class="" :key="`${rIndex}-${cIndex}-space`">&nbsp;</div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  board: Array<Array<null | Piece>>;
}>();
</script>
