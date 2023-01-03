<template>
  <div class="flex justify-between items-center">
    <div
      class="700 bg-white font-xl py-2 rounded-full font-bold text-xl px-4 border"
    >
      <BeatCounter class="" :beat="beat" :measure="measure" />
    </div>
    <p
      class="text-green-700 bg-white font-xl py-1 rounded-full font-bold text-lg px-4 border"
    >
      ${{ cash }}
    </p>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  measure: 0 | 1 | 2 | 3;
  beat: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  cash: Number;
}>();
</script>
