<template>
  <p class="px-4" v-if="label" v-text="label" />
  <div class="flex flex-nowrap gap-x-2">
    <label class="relative grow group text-xl">
      <input
        ref="input"
        type="text"
        v-model="valueProxy"
        class="peer bg-transparent py-2 px-4 text-white !outline-none decoration-transparent text-gray-200/90 focus:text-white"
        style="caret-color: transparent"
      />

      <div
        class="absolute top-0 left-[6px] right-[6px] h-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute right-0 top-[6px] bottom-[6px] w-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute bottom-0 left-[6px] right-[6px] h-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute left-0 top-[6px] bottom-[6px] w-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute left-[3px] top-[3px] h-[3px] w-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute right-[3px] top-[3px] h-[3px] w-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute left-[3px] bottom-[3px] h-[3px] w-[3px] bg-gray-200/50 peer-focus:bg-white"
      />
      <div
        class="absolute right-[3px] bottom-[3px] h-[3px] w-[3px] bg-gray-200/50 peer-focus:bg-white"
      />

      <p
        class="absolute py-2 px-4 text-white top-0 pointer-events-none hidden peer-focus:block"
      >
        <span v-text="props.modelValue"></span>
        <span class="border-b-[2px] animate-blink text-transparent">M</span>
      </p>
    </label>
    <slot name="button" />
  </div>
</template>

<script lang="ts" setup>
// Standard text input with prop modelValue and emit new value
const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string | null;
    autofocus?: boolean;
  }>(),
  { label: null, autofocus: true }
);
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const valueProxy = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const input = ref<HTMLInputElement>();

onMounted(() => {
  if (props.autofocus && input.value) {
    input.value.focus();
  }
});
</script>
