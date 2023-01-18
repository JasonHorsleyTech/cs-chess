## Unplayable until

- [x] Fix bishop movement
- [x] Fix horse movement
  - [x] Fix movement arrows, maybe use scoped slots and a Board.vue components?
- [x] Trap for losing a match
- [ ] Price the purcahse squares so it's costly to put pieces in the other guys "rows".
- [ ] Add income from capturing pieces
- [ ] Add income from winning games
- [ ] AWS it
- [ ] Pawn promotion
- [X] On "measure 3 beat 6" (the lockup period where both players sync), add a internal clock catchup/slowdown mechanism to accound for small variations between the two browser's frequencies

## Bad experience until

- [ ] Add music
- [x] UI for "number of games left"
- [ ] Handle reverting queued moves on p1 and p2's side if the other guy threw an error.
      ^^ Solve the 2 generals problem? the fuck and I doing here.

## Nice to have

- [?] Trap for "Can't start without pieces": Currently just ties it or gives it to whoever has a king.
- [-] Fix HMR so I always get a good re-setup
  ^^ Harder than it sounded
- [ ] Trap for "square swap" collision detection

## Don't know if these are good ideas yet

- [ ] Extract TheGameConnector callbacks to their own object.
- [ ] Move TheGamerRunner and TheGameConnector into state
