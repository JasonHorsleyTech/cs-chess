<template>
  <div class="grid grid-cols-8 grid-rows-8 border border-gray-800/25">
    <ButtonSuccess @click="ping">Ping</ButtonSuccess>
    <p v-if="received">Ping received {{ received }}</p>
    <!-- <template v-for="(row, rIndex) in board">
      <template
        v-for="(piece, cIndex) in row"
        :key="`${rIndex}-${cIndex}-slot`"
      >
        <div
          class="grid place-content-stretch p-1"
          :class="[rIndex % 2 ? 'odd:bg-gray-800/25' : 'even:bg-gray-800/25']"
        >
          <GamePiece
            v-if="piece !== null"
            :piece="piece"
            :key="`${rIndex}-${cIndex}-piece`"
          />
          <div v-else class="" :key="`${rIndex}-${cIndex}-space`">&nbsp;</div>
        </div>
      </template>
    </template> -->
  </div>
</template>

<script lang="ts" setup>
import { DataConnection } from "peerjs";

const props = defineProps<{
  dc: DataConnection;
  // board: Array<Array<null | Piece>>;
}>();

const ping = () => {
  const content = `${Date.now()}`;
  console.log(content)
  const ret = props.dc.send({
    event: "ping",
    content,
  });
  console.log(ret);
};
const received = ref<boolean | string>(false);

onMounted(() => {
  props.dc.on("data", (data: any) => {
    console.log(data)
    if (data?.event === "ping") {
      received.value = `${data.content}`;
    }
  });
});
</script>
