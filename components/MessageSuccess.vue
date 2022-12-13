<template>
  <div
    class="p-2 bg-green-300 border border-green-400 rounded-xl flex items-center gap-x-2 text-green-800"
  >
    <div class="w-4 h-4 rounded-full" :style="icon" />
    <slot />
  </div>
</template>
<script lang="ts" setup>
const icon = computed(() => {
  return bgsvg("circle-check-regular");
});
</script>
