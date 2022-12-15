<template>
  <div>
    <p>TODO: New game, join private, search public</p>
  </div>
</template>
<script lang="ts" setup>
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";

const secret = uuidv4();
const router = useRouter();

/**
 * Automatically set up a new connection to PeerJS and reroute to /game as host
 *
 * TODO:
 *  - New game
 *  - Join private ID
 *  - Search public games (light backend)
 */
const autostart = () => {
  const PeerInstance = new Peer();
  PeerInstance.on("open", (id: string) => {
    PeerInstance.on("disconnected", () => {
      navigateTo({
        path: "/game",
        query: {
          id,
          secret,
          role: "host",
        },
      });
    });

    PeerInstance.disconnect();
  });
};

onMounted(autostart);
</script>
