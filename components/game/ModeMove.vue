<template>
  <div class="grid gap-4">
    <div class="grid">
      <h2 class="">Purchase and place pieces.</h2>
      <h2>{{ pieceSelected }}</h2>
    </div>

    <div class="flex justify-between items-center">
      <div
        class="700 bg-white font-xl py-2 rounded-full font-bold text-xl px-4 border"
      >
        <BeatCounter
          class=""
          :beat="TheGameRunner.beat"
          :measure="TheGameRunner.measure"
        />
      </div>
      <p
        class="text-green-700 bg-white font-xl py-1 rounded-full font-bold text-lg px-4 border"
      >
        ${{ TheGameRunner.cash[TheGameRunner.player] }}
      </p>
    </div>

    <div
      class="flex mx-auto border border-gray-400"
      :class="[
        TheGameRunner.player === 'black' ? 'flex-col-reverse' : 'flex-col',
      ]"
    >
      <div
        v-for="(row, r) in TheGameRunner.gameBoard"
        class="flex border-gray-300"
        :class="[
          TheGameRunner.player === 'black' ? 'flex-row-reverse' : 'flex-row',
        ]"
      >
        <div v-for="(pieceOnBoard, c) in row" class="grid">
          <div
            class="group relative w-8 h-8 grid place-content-stretch"
            :class="[
              // Checkerboard pattern
              (c + r) % 2 ? 'bg-gray-300/50' : 'bg-gray-50/50',
              'hover:bg-gray-400 cursor-pointer',
              pieceSelected !== null ? 'hover:bg-blue-200' : '',
            ]"
            @click="handleBoardClick({ r, c })"
          >
            <div v-if="pieceOnBoard === null" />
            <GamePiece
              v-else-if="pieceOnBoard.player === TheGameRunner.player"
              :pieceType="pieceOnBoard.type"
              :player="pieceOnBoard.player"
              :class="[
                pieceSelected === pieceOnBoard
                  ? 'animate-wiggle bg-black/25'
                  : '',
              ]"
            />
            <GamePiece
              v-else
              :pieceType="pieceOnBoard.type"
              :player="pieceOnBoard.player"
            />

            <GameMovementArrow
              v-if="pieceOnBoard !== null && pieceOnBoard.moveTo !== null && pieceOnBoard.player === TheGameRunner.player"
              :player="pieceOnBoard.player"
              :moveFrom="pieceOnBoard.location"
              :moveTo="pieceOnBoard.moveTo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameRunner from "~~/models/GameRunner";
import Piece from "~~/models/Piece";

const props = defineProps<{
  player: "white" | "black";
  TheGameRunner: GameRunner;
}>();

const pieceSelected = ref<null | Piece>(null);
const handleBoardClick = (loc: BoardLocation) => {
  const boardSquare = props.TheGameRunner.gameBoard[loc.r][loc.c];

  if (pieceSelected.value === null) {
    if (
      boardSquare !== null &&
      boardSquare.player === props.TheGameRunner.player
    ) {
      pieceSelected.value = boardSquare;
      return;
    }
  } else {
    try {
      props.TheGameRunner.movePiece({
        piece: pieceSelected.value,
        moveTo: loc,
        player: props.TheGameRunner.player,
      });

      // It's gonna move now
    } catch (error) {
      console.error(error);
    }
    pieceSelected.value = null;
  }
};
</script>
