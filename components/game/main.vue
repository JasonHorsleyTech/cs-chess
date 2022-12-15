<template>
  <div class="grid place-content-center">
    <div v-for="(rIndex, row) in GameRunner.size" class="flex">
      <div v-for="(cIndex, col) in GameRunner.size" class="grid">
        <div class="w-8 h-8 border grid place-content-center">
          {{ rIndex }}-{{ cIndex }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameConnector from "~~/models/GameConnector";
import GameRunner from "~~/models/GameRunner";

const props = defineProps({
  TheGameConnector: {
    type: GameConnector,
    required: true,
  },
});
</script>
