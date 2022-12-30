import GameRunner from "~~/models/GameRunner";
import Piece from "~~/models/Piece";

const fixedStateSingleQueen = [
  [
    new Piece("white", "queen", { r: 0, c: 0 }, { r: 0, c: 7 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];

const fixedStateMultiQueen = [
  [
    new Piece("white", "queen", { r: 0, c: 0 }, null),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 1, c: 0 }, { r: 1, c: 1 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 2, c: 0 }, { r: 2, c: 2 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 3, c: 0 }, { r: 3, c: 3 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 4, c: 0 }, { r: 4, c: 4 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 5, c: 0 }, { r: 5, c: 5 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 6, c: 0 }, { r: 6, c: 6 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    new Piece("white", "queen", { r: 7, c: 0 }, { r: 7, c: 7 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
];

const fixedStateQueenColission = [
  [
    new Piece("white", "queen", { r: 0, c: 0 }, { r: 0, c: 7 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    new Piece("black", "queen", { r: 7, c: 7 }, { r: 0, c: 7 }),
  ],
];

const fixedStateAudTest = [
  [
    new Piece("white", "queen", { r: 0, c: 0 }, { r: 0, c: 7 }),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    new Piece("black", "queen", { r: 7, c: 7 }, { r: 0, c: 7 }),
  ],
];

const testState = () => {
  return [
    [
      new Piece("black", "rook", { r: 0, c: 0 }, null),
      new Piece("black", "knight", { r: 0, c: 1 }, null),
      new Piece("black", "bishop", { r: 0, c: 2 }, null),
      new Piece("black", "queen", { r: 0, c: 3 }, null),
      new Piece("black", "king", { r: 0, c: 4 }, null),
      new Piece("black", "bishop", { r: 0, c: 5 }, null),
      new Piece("black", "knight", { r: 0, c: 6 }, null),
      new Piece("black", "rook", { r: 0, c: 7 }, null),
    ],
    [
      new Piece("black", "pawn", { r: 1, c: 0 }, null),
      new Piece("black", "pawn", { r: 1, c: 1 }, null),
      new Piece("black", "pawn", { r: 1, c: 2 }, null),
      new Piece("black", "pawn", { r: 1, c: 3 }, null),
      new Piece("black", "pawn", { r: 1, c: 4 }, null),
      new Piece("black", "pawn", { r: 1, c: 5 }, null),
      new Piece("black", "pawn", { r: 1, c: 6 }, null),
      new Piece("black", "pawn", { r: 1, c: 7 }, null),
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      new Piece("white", "pawn", { r: 6, c: 0 }, null),
      new Piece("white", "pawn", { r: 6, c: 1 }, null),
      new Piece("white", "pawn", { r: 6, c: 2 }, null),
      new Piece("white", "pawn", { r: 6, c: 3 }, null),
      new Piece("white", "pawn", { r: 6, c: 4 }, null),
      new Piece("white", "pawn", { r: 6, c: 5 }, null),
      new Piece("white", "pawn", { r: 6, c: 6 }, null),
      new Piece("white", "pawn", { r: 6, c: 7 }, null),
    ],
    [
      new Piece("white", "rook", { r: 7, c: 0 }, null),
      new Piece("white", "knight", { r: 7, c: 1 }, null),
      new Piece("white", "bishop", { r: 7, c: 2 }, null),
      new Piece("white", "queen", { r: 7, c: 3 }, null),
      new Piece("white", "king", { r: 7, c: 4 }, null),
      new Piece("white", "bishop", { r: 7, c: 5 }, null),
      new Piece("white", "knight", { r: 7, c: 6 }, null),
      new Piece("white", "rook", { r: 7, c: 7 }, null),
    ],
  ];
};

// Manually tinker up a game based on some particular state I'm trying to debug
const debugGameState = (TheGameRunner: GameRunner) => {
  TheGameRunner.gameBoard = testState();
  TheGameRunner.gameMode = "move";
};
export default debugGameState;
