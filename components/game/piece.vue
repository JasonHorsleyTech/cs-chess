<template>
  <div
    v-if="props.piece !== null"
    :style="styleSrc"
    class="h-full w-full bg-center bg-no-repeat bg-contain"
  />
</template>
<script setup lang="ts">
const props = defineProps<{ piece: Piece }>();

const styleSrc = computed(() => {
  return `background-image: url('/pieces/${props.piece.player}-${props.piece.type}.svg');`;
});
</script>
