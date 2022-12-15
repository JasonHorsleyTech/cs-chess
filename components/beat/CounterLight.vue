<template>
  <div
    class="grid grid-cols-2 grid-rows-2 h-full"
  >
    <div
      class="w-full h-full relative overflow-hidden"
      :class="[at >= 0 ? 'opacity-100' : 'opacity-0']"
    >
      <div
        class="absolute w-[200%] h-[200%] rounded-full"
        :class="[color === 'red' ? 'bg-red-500' : 'bg-green-500']"
      />
    </div>
    <div
      class="w-full h-full relative overflow-hidden"
      :class="[at >= 1 ? 'opacity-100' : 'opacity-0']"
    >
      <div
        class="absolute w-[200%] h-[200%] rounded-full -translate-x-1/2"
        :class="[color === 'red' ? 'bg-red-500' : 'bg-green-500']"
      />
    </div>
    <div
      class="w-full h-full relative overflow-hidden"
      :class="[at >= 3 ? 'opacity-100' : 'opacity-0']"
    >
      <div
        class="absolute w-[200%] h-[200%] rounded-full -translate-y-1/2"
        :class="[color === 'red' ? 'bg-red-500' : 'bg-green-500']"
      />
    </div>
    <div
      class="w-full h-full relative overflow-hidden"
      :class="[at >= 2 ? 'opacity-100' : 'opacity-0']"
    >
      <div
        class="absolute w-[200%] h-[200%] rounded-full -translate-y-1/2 -translate-x-1/2"
        :class="[color === 'red' ? 'bg-red-500' : 'bg-green-500']"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  at: 0 | 1 | 2 | 3;
  color: "green" | "red";
}>();
</script>
