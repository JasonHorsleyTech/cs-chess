<template>
  <p>
    <span v-text="message" />
    <span class="relative">
      <span class="invisible">...</span>
      <span class="absolute left-0" v-text="loadingDots" />
    </span>
  </p>
</template>
<script setup lang="ts">
defineProps<{
  message: string;
}>();

const loadingDots = ref<string>(".");
setInterval(() => {
  loadingDots.value += ".";
  if (loadingDots.value.length > 3) {
    loadingDots.value = ".";
  }
}, 500);
</script>
