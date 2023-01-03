## Unplayable until

- [x] Fix bishop movement
- [x] Fix horse movement
  - [x] Fix movement arrows, maybe use scoped slots and a Board.vue components?
- [ ] Trap for "Can't start without pieces"
- [ ] Trap for losing a match
- [ ] Price the purcahse squares so it's costly to put pieces in the other guys "rows".
- [ ] Add income from capturing pieces
- [ ] Add income from winning games

## Bad experience until

- [ ] Add music
- [ ] On "measure 3 beat 6" (the lockup period where both players sync), add a internal clock catchup/slowdown mechanism to accound for small variations between the two browser's frequencies
- [ ] UI for "number of games left"

## Nice to have

- [-] Fix HMR so I always get a good re-setup
  ^^ Harder than it sounded
- [ ] Trap for "square swap" collision detection

## Don't know if these are good ideas yet

- [ ] Extract TheGameConnector callbacks to their own object.
- [ ] Move TheGamerRunner and TheGameConnector into state
