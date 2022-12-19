<template>
  <div class="grid col-span-3 row-span-2 gap-4 place-content-center">
    <GameUIPurchasePiece
      v-for="pieceType in pieceTypes"
      :piece="pieceType"
      :disabled="false"
      @click="$emit('purchaseAndPlace', pieceType, { r: 0, c: 0 })"
    />
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  player: "white" | "black";
}>();
const emit = defineEmits<{
  (e: "purchaseAndPlace", pieceType: PieceTypes, location: BoardLocation): void;
}>();
</script>
