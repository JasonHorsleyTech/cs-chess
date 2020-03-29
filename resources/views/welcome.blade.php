@extends('layouts.app')

@section('content')
<div class="container">
    @if (Route::has('login'))
        @auth
            @include("welcome-authed")
        @else
            <ul>
                <li>Log in
                <li>Find a player
                <li> - Any difference in skill level is offset with starting cash. If you are more skilled, you start with less cash.
                <li>Take turns purchasing chess pieces and placing them anywhere in your first three rows
                <li>Purchases must be made with 5 seconds.
                <li> - If you end your "purchase" turn not having placed your piece, it will be randomly assigned to any of your empty spaces
                <li> - If you end your "purchase" turn not having purchased anything, that counts as your last purchase
                <li> - The "Purchase" mode finishes when both players have stopped making Purchases
                <li>Once the pieces have been purchased and set, play chess! Same rules as always, except...
                
                <h3>Capturing pieces earns money</h3>
                <li>If the piece you capture is more valuable than the piece you captured it with, you earn back money!
                <li> - Capturing a Queen ($2,000) with a Pawn ($100) earns $950
                <li> - Capturing a Queen ($2,000) with a Rook ($1000) earns $500
                <li> - Capturing a Queen ($2,000) with a Queen ($2,000) earns nothing
                <li> - Exact equation ({captured piece cost} - {capturing piece cost}) / 2

                <h3>You can loose your kings</h3>
                <li>Before you begin the game, you must purchase and place at least one king
                <li>The first king is free, but you can have as many as your wallet allows
                <li>As such, you do NOT have to move your king when placed in check
                <li>But the game is won when you no longer have any kings on the board

            <ul>
        @endauth
    @endif
</div>
@endsection
