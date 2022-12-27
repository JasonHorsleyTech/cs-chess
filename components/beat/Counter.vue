<template>
  <div class="flex w-[4.25rem] justify-between">
    <div
      class="w-4 h-4 border border-green-800 rounded-full"
      v-for="i in 4"
      :key="i"
    >
      <BeatCounterLight
        v-if="measure + 1 >= i"
        :at="measure === i - 1 ? Math.floor(beat/3) : 3"
        :color="measure === i - 1 ? 'red' : 'green'"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  measure: 0 | 1 | 2 | 3;
  beat: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}>();
</script>
