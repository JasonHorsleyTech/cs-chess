<template>
  <div class="grid gap-4">
    <Notification>How to play</Notification>
    <article class="prose">
      <h2>It's chess, except</h2>
      <h4>You have to set up your own starting position</h4>
      <ul>
        <li>You must purchase your own pieces</li>
        <li>You can purchase as many as you like</li>
        <li>You can place them on any open board square, for a price</li>
        <li>Both sides must have at least one king for the game to start</li>
      </ul>
      <p>
        You have to purchase your own pieces. You can buy as many/few as you
        want and place them on any open board space
      </p>
    </article>

    <BaseButton @click="handleReady" v-if="!isReady">Got it!</BaseButton>
    <p v-else>Waiting for player 2...</p>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: "ready"): void;
}>();

const isReady = ref<boolean>(false);
const handleReady = () => {
  isReady.value = true;
  emit("ready");
};
</script>
