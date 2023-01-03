<template>
  <div class="mx-auto flex gap-x-2 items-baseline">
    Wins:
    <div
      v-for="win in wins"
      :style="bgsvg(`${win}-king`)"
      class="w-4 h-4 bg-center bg-no-repeat bg-contain"
      :class="[win === null ? 'border-b border-black' : '']"
    ></div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  wins: Array<"white" | "black" | null>;
}>();
</script>
