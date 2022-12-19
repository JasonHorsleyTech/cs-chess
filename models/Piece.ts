export default class Piece {
  constructor(
    public player: "black" | "white",
    public type: PieceTypes,
    public location: BoardLocation,
    public moveTo: null | BoardLocation,
    public purchaseVerified: boolean
  ) {}
}
