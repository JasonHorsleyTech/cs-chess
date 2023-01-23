<template>
  <canvas
    ref="movementArrowCanvas"
    :height="dimension * 8"
    :width="dimension * 8"
    class="w-full h-full opacity-25"
    :class="[player === 'white' ? 'rotate-0' : 'rotate-180']"
  />
</template>
<script lang="ts" setup>
import Piece from "~~/models/Piece";

const dimension = 128;
const half = dimension / 2;
const lineWidth = dimension / 4;

const props = defineProps<{
  piecesWithMovement: Array<Piece>;
  player: "black" | "white";
}>();

const movements = computed(() => {
  return props.piecesWithMovement;
});

const movementArrowCanvas = ref<HTMLCanvasElement | null>(null);

const render = (newMovement: Array<Piece>) => {
  if (movementArrowCanvas.value === null) return;
  const ctx = movementArrowCanvas.value.getContext("2d");
  if (ctx === null) return;

  movementArrowCanvas.value.width = movementArrowCanvas.value.width;

  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  // Line
  ctx.strokeStyle = "blue";
  // Arrow
  ctx.fillStyle = "red";

  newMovement.map((piece) => {
    if (!piece.moveTo) return;

    let canvasPath: Array<{ x: number; y: number }> = [];

    // [{x: 0, y: 0}, ..., {x: 7, y: 7}]
    canvasPath.push({ x: piece.location.c, y: piece.location.r });
    piece.movementPathing
      .slice()
      .reverse()
      .map(({ location }) => {
        canvasPath.push({ x: location.c, y: location.r });
      });

    // [{x: 32, y: 32}, ..., {x: 891, y: 891}]
    canvasPath = canvasPath.map(({ x, y }) => {
      return { x: x * dimension + half, y: y * dimension + half };
    });

    // Stop last movement half way short to make room for arrow/effect/etc
    // const penultimateStep = canvasPath[canvasPath.length - 2];
    // const final = canvasPath.pop();
    // canvasPath.push({
    //   x: (penultimateStep.x + final.x) / 2,
    //   y: (penultimateStep.y + final.y) / 2,
    // });

    // const final = canvasPath.pop();

    // Draw it
    ctx.beginPath();
    const first = canvasPath.shift();

    if (!first || first.x === undefined || first.y === undefined)
      throw "Go fish";

    ctx.moveTo(first.x, first.y);
    canvasPath.map(({ x, y }) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      canvasPath[canvasPath.length - 1].x,
      canvasPath[canvasPath.length - 1].y,
      lineWidth,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
};

watch(movements, () => {
  render(movements.value);
});

onMounted(() => {
  render(movements.value);
});

const canvas_arrow = (
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number,
  r: number
) => {
  let x_center = tox;
  let y_center = toy;

  let angle: number;
  let x;
  let y;

  context.beginPath();

  angle = Math.atan2(toy - fromy, tox - fromx);
  x = r * Math.cos(angle) + x_center;
  y = r * Math.sin(angle) + y_center;

  context.moveTo(x, y);
  angle += (1 / 3) * (2 * Math.PI);
  x = r * Math.cos(angle) + x_center;
  y = r * Math.sin(angle) + y_center;

  context.lineTo(x, y);
  angle += (1 / 3) * (2 * Math.PI);
  x = r * Math.cos(angle) + x_center;
  y = r * Math.sin(angle) + y_center;

  context.lineTo(x, y);
  context.closePath();
  context.fill();
};
</script>
