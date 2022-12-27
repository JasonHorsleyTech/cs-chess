<template>
  <div
    class="absolute pointer-events-none"
    :style="[
      `height: ${(Math.abs(moveFrom.r - moveTo.r) + 1) * 100}%`,
      `width: ${(Math.abs(moveFrom.c - moveTo.c) + 1) * 100}%`,
      player === 'white'
        ? `top: ${(moveFrom.r > moveTo.r ? moveTo.r - moveFrom.r : 0) * 100}%`
        : `top: ${(moveFrom.r < moveTo.r ? moveTo.r - moveFrom.r : 0) * -100}%`,
      player === 'white'
        ? `left: ${(moveFrom.c > moveTo.c ? moveTo.c - moveFrom.c : 0) * 100}%`
        : `left: ${
            (moveFrom.c < moveTo.c ? moveTo.c - moveFrom.c : 0) * -100
          }%`,
    ]"
  >
    <div
      class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 border border-transparent"
      :class="{
        '0deg w-2 h-full border-t-[1rem] border-b-[1rem]':
          moveFrom.r > moveTo.r && moveFrom.c == moveTo.c,
        'rotate-[45deg] w-2 h-[141%] border-t-[1.4rem] border-b-[1.4rem]':
          moveFrom.r > moveTo.r && moveFrom.c < moveTo.c,
        '90 h-2 w-full border-l-[1rem] border-r-[1rem]':
          moveFrom.r == moveTo.r && moveFrom.c < moveTo.c,
        'rotate-[135deg] w-2 h-[141%] border-t-[1.4rem] border-b-[1.4rem]':
          moveFrom.r < moveTo.r && moveFrom.c < moveTo.c,
        '180 w-2 h-full border-t-[1rem] border-b-[1rem]':
          moveFrom.r < moveTo.r && moveFrom.c == moveTo.c,
        'rotate-[225deg] w-2 h-[141%] border-t-[1.4rem] border-b-[1.4rem]':
          moveFrom.r < moveTo.r && moveFrom.c > moveTo.c,
        '270 h-2 w-full border-l-[1rem] border-r-[1rem]':
          moveFrom.r == moveTo.r && moveFrom.c > moveTo.c,
        'rotate-[315deg] w-2 h-[141%] border-t-[1.4rem] border-b-[1.4rem]':
          moveFrom.r > moveTo.r && moveFrom.c > moveTo.c,
      }"
    >
      <div class="h-full w-full bg-blue-200 rounded-full" />
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  player: "black" | "white";
  moveFrom: BoardLocation;
  moveTo: BoardLocation;
}>();

const arrowStyle = computed(() => {
  const height = Math.abs(props.moveFrom.r - props.moveTo.r) * 100;
  const width = Math.abs(props.moveFrom.c - props.moveTo.c) * 100;
  return {
    height: height === 0 ? "auto" : height,
    width: width === 0 ? "auto" : width,
  };
});

onMounted(() => {
  console.log(props);
});
</script>
