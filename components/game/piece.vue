<template>
  <div
    :style="styleSrc"
    class="h-full w-full bg-center bg-no-repeat bg-contain"
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  pieceType: PieceTypes;
  player: "black" | "white";
}>();

const styleSrc = computed(() => {
  return bgsvg(`${props.player}-${props.pieceType}`);
});
</script>
