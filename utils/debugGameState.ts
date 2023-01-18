import GameRunner from "~~/models/GameRunner";
import Piece from "~~/models/Piece";

// Manually tinker up a game based on some particular state I'm trying to debug
const debugGameState = (TheGameRunner: GameRunner, isClient: boolean) => {
  if (isClient) {
    TheGameRunner.beat = 3;
  }
};

export default debugGameState;
