# CS chess

A project I've failed at for like 5 years running. But this time...

# Development roadmap

## Elevator pitch
Chess sucks because
* Statis starting positions
  -- You always start from the same position, so the first half of the game is just "Who memorized openers the best?" 
* No way to be clever about it.
  -- There's no backup skill, the winner is just the best chess player.
  -- There's no clever new idea that hasn't already been tried.

Add new rules to the chess base game to allow for 
* More creativity
* A worse chess player to potentially win from a "soft skill" advantage.

## Stage 0 (mvp) -- Capitalistic
Chess, except
* Pieces are individually purchased with in-game currency at the start of each match
* Purchased pieces can be placed (for a fee) anywhere on the board for a custom setup
* Money is earned from capturing pieces and winning the match
* Money is perserved between matches.
* First to win 3 matches wins the game.

### Scope cutters
* Multiplayer only

### Requirements for future stages
* The game is only won when you *capture* the opponent's king(s)

## Stage 1 -- Syncronous

* The game is played to the 4/4 beat of a basic ~48bpm midi track
* Rhythm is as follows

|1200ms  |1200ms  |1200ms  |1200ms  |
|MOVE    |MOVE    |MOVESYNC|OBSERVE |

* The first 2.5 move blocks allow both players to place/move pieces on the board
* The "sync" half block allows both client machines to catchup with what the other did
* The "observe" block plays back both p1 and p2's moves *at the same time*
  - Pieces traveling longer distances move faster, using duple/triplet rythem within the avaible bar.
    - Queen from A1 to A2: 1sq/1200ms
    - Queen from A1 to A3: 1sq/600ms
    - Queen from A1 to A4: 1sq/400ms
    - Queen from A1 to A5: 1sq/300ms
    - Queen from A1 to A6: First 3 at 1sq/200ms, last 2 at 1sq/300ms
    - Queen from A1 to A7: 1sq/200ms
    - Queen from A1 to A8: 1sq/200ms, but piece snaps to A2 the very first ms of the observe cycle (cheat to get 1 extra movement square without messing up rythem) 
  - If two moving pieces end up on the same square at the same time, they "collide" (play a metalic 'twing' sfx) and stay at their respective square 1 submove prior to the collision.

## Stage 2 -- Singleplayer and tutorial

* Add a single player AI opponent. (Maybe swap with stage 1 for playability?)
* Add tutorial, explaining the "capitalism" and "sycronous" features one at a time.

## Stage 3 (final) -- Multimove

* For an exponentially increasing price, you can move multiple distinct pieces within the same turn.




