<template>
  <div class="flex flex-col space-y-4">
    <div class="self-end">{{ `${game.measure}-${game.beat}` }}</div>
    <GameBoard :board="game.board" />
    <button
      v-if="game.started == false"
      class="mx-auto py-2 px-4 block bg-green-300 border-green-400 border rounded-lg"
      @click="sound"
    >
      Start
    </button>
  </div>
</template>

<script lang="ts" setup>
const { $Wad } = useNuxtApp();
const sound = () => {
  let saw = new $Wad({ source: "sawtooth" });
  saw.play();
};

const queen: Piece = {
  player: "white",
  type: "queen",
  location: { r: 0, c: 0 },
  moveTo: null,
};

const game: {
  started: boolean;
  intervalId: any;
  intervalFnc: Function;
  board: Array<Array<null | Piece>>;
  stage: "setup" | "purchase" | "play";
  measure: 0 | 1 | 2 | 3;
  beat: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  tempo: number;
} = reactive({
  started: false,
  board: [
    [queen, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
  stage: "play",

  intervalId: null,
  intervalFnc: () => {
    if (game.beat < 11) {
      game.beat += 1;
    } else if (game.measure < 3) {
      game.beat = 0;
      game.measure += 1;
    } else {
      game.beat = 0;
      game.measure = 0;
    }
  },
  measure: 0,
  beat: 0,
  tempo: 100,
});

watch(
  computed(() => {
    return game.started;
  }),
  (newValue) => {
    if (!newValue) {
      window.clearInterval(game.intervalId);
    } else {
      game.measure = 0;
      game.beat = 0;
      game.intervalId = window.setInterval(game.intervalFnc, game.tempo);
    }
  }
);

onMounted(() => {
  // game.started = true;
  // let saw = new Wad({ source: "sawtooth" });
  // saw.play();
});
</script>
