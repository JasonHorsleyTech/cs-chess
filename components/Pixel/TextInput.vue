<template>
  <p class="px-4" v-if="label" v-text="label" />
  <div class="flex flex-nowrap gap-x-2">
    <label
      class="relative overflow-hidden grid place-content-center grow group text-xl py-2 px-4"
    >
      <textarea
        ref="input"
        rows="1"
        cols="14"
        v-model="valueProxy"
        class="peer bg-transparent text-white !outline-none decoration-transparent text-gray-200/90 focus:text-white selection:bg-transparent whitespace-nowrap overflow-hidden"
        style="caret-color: transparent; resize: none"
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
        class="absolute overflow-hidden text-white left-4 top-1/2 -translate-y-1/2 pointer-events-none /hidden peer-focus:block"
      >
        <span
          class="opacity-0 whitespace-nowrap"
          v-text="modelValue.slice(0, insertionPoint.location)"
        ></span>
        <span
          :key="insertionPoint.location"
          class="animate-blink text-transparent"
          :class="[insertionPoint.width === 1 ? 'border-b-[2px]' : 'bg-white']"
          :style="`margin-left: ${-1 * insertionPoint.left}px`"
        >
          <span
            v-for="i in Math.max(insertionPoint.width - 1, 1)"
            :key="i"
            v-text="'M'"
          />
        </span>
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
    return props.modelValue.replace(/(\r\n|\n|\r)/gm, "");
  },
  set(value) {
    emit("update:modelValue", value.replace(/(\r\n|\n|\r)/gm, ""));
    fixInsertionPoint();
  },
});

const input = ref<HTMLInputElement>();

const insertionPoint = reactive<{
  location: number;
  width: number;
  left: number;
}>({
  location: 0,
  width: 1,
  left: 0,
});

// TODO: Add correct event type, the one with selectionStart
const fixInsertionPoint = () => {
  if (!input.value) throw "Input not found";
  const { selectionStart, selectionEnd, scrollLeft } = input.value;

  if (selectionStart === null || selectionEnd === null || scrollLeft === null)
    return;
  insertionPoint.left = scrollLeft;
  insertionPoint.location = selectionStart;
  insertionPoint.width = selectionEnd - selectionStart + 1;
};

onMounted(() => {
  if (!input.value) throw "Input not found";

  if (props.autofocus) {
    input.value.focus();
  }

  input.value.addEventListener("keydown", (event) => {
    if (event.code === "Enter") event.preventDefault();
  });
  input.value.addEventListener("keyup", fixInsertionPoint);
  input.value.addEventListener("mouseup", fixInsertionPoint);
});
</script>
