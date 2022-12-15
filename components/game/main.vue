<template>
  <p></p>
</template>
<script lang="ts" setup>
import GameConnector from "~~/models/GameConnector";

const props = defineProps({
  TheGameConnector: {
    type: GameConnector,
    required: true,
  },
});
</script>
