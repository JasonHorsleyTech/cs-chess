<template>
  <div
    :style="styleSrc"
    class="w-full self-center mx-auto bg-center bg-no-repeat bg-contain"
    :class="{ 'opacity-50': stunned }"
  >
    &nbsp;
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  pieceType: PieceTypes;
  player: "black" | "white";
  stunned: boolean;
}>();

const styleSrc = computed(() => {
  return bgsvg(`${props.player}-${props.pieceType}`);
});
</script>
