## Unplayable until 
- [X] Fix bishop movement
- [X] Fix horse movement
    - [X] Fix movement arrows, maybe use scoped slots and a Board.vue components?
- [ ] Fix HMR so I always get a good re-setup
- [ ] Price the purcahse squares so it's costly to put pieces in the other guys "rows".
- [ ] Add income from capturing pieces
- [ ] Add income from winning games

## Bad experience until
- [ ] On "measure 3 beat 6" (the lockup period where both players sync), add a internal clock catchup/slowdown mechanism to accound for small variations between the two browser's frequencies
- [ ] UI for "number of games left"

## Nice to have
- [ ] Trap for "square swap" collision detection

## Don't know if these are good ideas yet
- [ ] Extract TheGameConnector callbacks to their own object.
- [ ] Move TheGamerRunner and TheGameConnector into state