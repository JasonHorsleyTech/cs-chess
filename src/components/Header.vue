<template>
  <div class="Header p-1" @mouseover="hover=true" @mouseleave="hover=false" :class="{'p-3': hover}">
    <div class="container">
      <h1 class="text-center">CS Chess</h1>
    </div>
  </div>
</template>

<script>
export default {
  methods: {},
  data() {
    return {
      hover: false
    };
  }
};
</script>

<style lang="scss">
.Header {
  background-color: #45423e;
  color: #3498db;
  &,
  & * {
    transition: 0.2s;
  }
}
</style>