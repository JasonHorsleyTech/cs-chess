<template>
  <div class="grid">
    <div class="grid place-content-center">
      <div v-for="(row, rIndex) in TheGameRunner.gameBoard" class="flex">
        <div v-for="(pieceOnBoard, cIndex) in row" class="grid">
          <div class="w-8 h-8 border grid place-content-center">
            <GamePiece
              class="h-6 w-6"
              v-if="pieceOnBoard !== null"
              :pieceType="pieceOnBoard.type"
              :player="pieceOnBoard.player"
            />
            <p v-else class="opacity-50">{{ rIndex }}-{{ cIndex }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 grid-rows-2 gap-4 place-content-end py-8">
      <GameUIPurchasePiece
        v-for="pieceType in pieceTypes"
        :pieceType="pieceType"
        :player="player"
        :disabled="false"
        @click="$emit('purchaseAndPlace', pieceType, { r: 0, c: 0 })"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameRunner from "~~/models/GameRunner";

const props = defineProps<{
  player: "white" | "black";
  TheGameRunner: GameRunner;
}>();
const emit = defineEmits<{
  (e: "purchaseAndPlace", pieceType: PieceTypes, location: BoardLocation): void;
}>();
</script>
