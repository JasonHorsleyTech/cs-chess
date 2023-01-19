<template>
  <button
    class="group relative text-xl cursor-pointer disabled:cursor-default disabled:pointer-events-none"
    :disabled="disabled || loading"
  >
    <div
      :class="[
        'absolute w-full h-full inset-0 translate-y-[2px] translate-x-[2px]',
        colors.bg,
      ]"
    />
    <p
      :class="[
        'relative px-4 py-2 border-2 bg-white -translate-y-[2px] -translate-x-[2px] font-semibold',
        'group-active:translate-x-0 group-active:translate-y-0',
        'group-hover:-translate-y-[3px]',
        colors.border,
        colors.text,
      ]"
    >
      <span :class="[!loading ? 'opacity-100' : 'opacity-0']">
        <slot />
      </span>
      <span
        class="absolute grid h-full w-full top-0 left-0 place-content-center"
        v-if="loading"
      >
        <SvgCircle class="animate-spin h-5 w-5" />
      </span>
    </p>
  </button>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    type?: "info" | "success" | "warning" | "error";
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    type: "info",
    loading: false,
    disabled: false,
  }
);
const colors = computed(() => {
  return {
    info: {
      text: "text-blue-700 group-disabled:text-blue-700/50",
      bg: "bg-blue-700 group-disabled:bg-blue-700/75",
      border: "border-blue-700 group-disabled:border-blue-700/75",
    },
    success: {
      text: "text-green-700 group-disabled:text-green-700/50",
      bg: "bg-green-700 group-disabled:bg-green-700/75",
      border: "border-green-700 group-disabled:border-green-700/75",
    },
    warning: {
      text: "text-yellow-800 group-disabled:text-yellow-800/50",
      bg: "bg-yellow-400 group-disabled:bg-yellow-400/75",
      border: "border-yellow-400 group-disabled:border-yellow-400/75",
    },
    error: {
      text: "text-red-700 group-disabled:text-red-700/50",
      bg: "bg-red-700 group-disabled:bg-red-700/75",
      border: "border-red-700 group-disabled:border-red-700/75",
    },
  }[props.type];
});
</script>
