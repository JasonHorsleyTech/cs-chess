<template>
  <ButtonBase :disabled="disabled" appearance="success">
    <slot />
  </ButtonBase>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
