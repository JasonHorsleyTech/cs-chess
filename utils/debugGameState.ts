import GameRunner from "~~/models/GameRunner";
import Piece from "~~/models/Piece";

// Manually tinker up a game based on some particular state I'm trying to debug
const debugGameState = (TheGameRunner: GameRunner) => {
  setTimeout(() => {
    TheGameRunner.beat = 7;
    TheGameRunner.measure = 3;
    TheGameRunner.pause();
  }, 1000);

  //   TheGameRunner.gameBoard = [
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [
  //       new Piece("white", "pawn", { r: 7, c: 0 }, null),
  //       new Piece("white", "knight", { r: 7, c: 1 }, null),
  //       new Piece("white", "bishop", { r: 7, c: 2 }, null),
  //       new Piece("white", "queen", { r: 7, c: 3 }, null),
  //       new Piece("white", "king", { r: 7, c: 4 }, null),
  //       null,
  //       null,
  //       new Piece("white", "rook", { r: 7, c: 7 }, null),
  //     ],
  //   ];
  //   TheGameRunner.queueMove({
  //     type: "pawn",
  //     location: { r: 7, c: 0 },
  //     moveTo: { r: 5, c: 0 },
  //     player: "white",
  //   });
  //   TheGameRunner.queueMove({
  //     type: "knight",
  //     location: { r: 7, c: 1 },
  //     moveTo: { r: 5, c: 2 },
  //     player: "white",
  //   });
  //   TheGameRunner.queueMove({
  //     type: "bishop",
  //     location: { r: 7, c: 2 },
  //     moveTo: { r: 2, c: 7 },
  //     player: "white",
  //   });
  //   TheGameRunner.queueMove({
  //     type: "queen",
  //     location: { r: 7, c: 3 },
  //     moveTo: { r: 3, c: 7 },
  //     player: "white",
  //   });
  //   TheGameRunner.queueMove({
  //     type: "king",
  //     location: { r: 7, c: 4 },
  //     moveTo: { r: 7, c: 5 },
  //     player: "white",
  //   });
  //   TheGameRunner.queueMove({
  //     type: "rook",
  //     location: { r: 7, c: 7 },
  //     moveTo: { r: 0, c: 7 },
  //     player: "white",
  //   });
};

export default debugGameState;
