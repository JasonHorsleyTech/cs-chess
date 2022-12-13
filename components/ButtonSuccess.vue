<template>
  <button
    class="py-2 px-4 inline-block bg-green-300 border-green-400 border rounded-lg"
    :class="[disabled ? 'opacity-50' : 'opacity-100']"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>