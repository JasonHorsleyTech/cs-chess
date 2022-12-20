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
    public purchaseLocked: boolean = false
  ) {}
}
