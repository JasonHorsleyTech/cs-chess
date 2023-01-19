<template>
  <p
    class="flex font-semibold gap-x-1 items-start w-full border px-2 py-1 text-base rounded-xl"
    :class="[colors.text, colors.bg, colors.border]"
  >
    <SvgInfo
      v-if="props.type === 'info'"
      class="h-5 w-5 shrink-0 m-[2px]"
      :class="[colors.icon]"
    />
    <SvgWarning
      class="h-5 w-5 shrink-0 m-[2px]"
      :class="[colors.icon]"
      v-else-if="props.type === 'warning'"
    />
    <slot />
  </p>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    type?: "success" | "info" | "warning" | "error";
  }>(),
  {
    type: "info",
  }
);

const colors = computed(() => {
  return {
    info: {
      icon: "text-blue-400",
      text: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    success: {
      icon: "",
      text: "",
      bg: "",
    },
    warning: {
      icon: "text-red-600",
      text: "text-red-900",
      bg: "bg-red-200",
      border: "border-red-900",
    },
    error: {
      icon: "",
      text: "",
      bg: "",
    },
  }[props.type];
});
</script>
