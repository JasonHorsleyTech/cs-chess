export default class Piece {
  static allTypes: Array<PieceTypes> = [
    "pawn",
    "knight",
    "bishop",
    "rook",
    "queen",
    "king",
  ];

  constructor(
    public player: "black" | "white",
    public type: PieceTypes,
    public location: BoardLocation,
    public moveTo: null | BoardLocation,
    // Has the initial purchase/placement been made?
    public purchaseVerified: boolean = false,
    // Was the purchase/placement locked in (done during previous turn)?
    public purchaseLocked: boolean = false,
    // Is this the piece's first move (relevant for pawns)
    public firstMove: boolean = true,

    // The board locations the piece will occupty for each "beat" of the movement cycle
    public movementPathing: Array<{
      location: BoardLocation;
      beat: number;
    }> = [],

    // Can the piece move this round?
    public stunned: boolean = false,
  ) {}
}
