<template>
  <div
    class="relative p-4 h-16 w-16 mx-auto"
    :class="[
      disabled ? 'opacity-50 pointer-events-none' : 'group cursor-pointer',
      selected ? 'scale-110' : 'scale-100',
    ]"
  >
    <div class="absolute flex items-center flex-wrap inset-0 p-1">
      <div
        class="w-full h-full rounded-lg border-2"
        :class="[
          selected
            ? 'bg-green-500 shadow-xl border-green-800 '
            : 'bg-green-600/50 group-hover:bg-green-500/75 shadow-inner border-green-700/50 ',
        ]"
      ></div>

      <span
        class="absolute rounded-md border font-bold text-center px-2 py-1 text-xs shadow bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4"
        :class="[countColor]"
      >
        {{ price === 0 ? "Free" : `$${price}` }}
      </span>
    </div>

    <GamePiece
      :piece-type="pieceType"
      :player="player"
      :class="[selected ? 'animate-wiggle' : '']"
      :stunned="false"
      class="h-6 w-6"
    ></GamePiece>

    <span
      class="absolute top-0 right-0 rounded-full w-4 h-4 overflow-hidden text-[8px] font-bold border"
      :class="countColor"
    >
      <span class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        {{ count }}
      </span>
    </span>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  pieceType: PieceTypes;
  player: "black" | "white";
  price: number;
  count: number;
  disabled: Boolean;
  selected: Boolean;
}>();

const normal = { pawn: 8, knight: 2, rook: 2, bishop: 2, king: 1, queen: 1 }[
  props.pieceType
];
const countColor = computed(() => {
  if (props.count < normal)
    return `bg-green-700/75 text-green-100 border-green-300`;

  if (props.count === normal)
    return `bg-yellow-300/75 text-yellow-900 border-yellow-900`;

  return `bg-red-300/75 text-red-900 border-red-900`;
});
</script>
