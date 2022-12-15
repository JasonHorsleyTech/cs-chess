<template>
  <button
    class="py-2 px-4 inline-block border rounded-lg"
    :class="[
      disabled ? 'opacity-50' : 'opacity-100',
      'data-[appearance=danger]:bg-red-500 data-[appearance=danger]:border-red-600',
      'data-[appearance=success]:bg-green-300 data-[appearance=success]:border-green-400 ',
    ]"
    :data-appearance="appearance"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    required: true,
  },
  appearance: {
    type: String,
    required: true,
  },
});
</script>
