<template>
  <div
    :style="styleSrc"
    class="w-full self-center mx-auto bg-center bg-no-repeat bg-contain"
  >
    &nbsp;
  </div>
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
