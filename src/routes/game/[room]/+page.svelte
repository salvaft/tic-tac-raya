<script lang="ts">
	import Square from './Square.svelte';
	import Modal from './Modal.svelte';
	import { onMount } from 'svelte';
	import { TURNS } from '$lib/consts';
	import type { PageData } from './$types';
	import { resetGame, handleMovement } from '$lib/utils';
	import { page } from '$app/stores';

	export let data: PageData;

	// Game init
	let board = Array(9).fill('');
	let myTurn: boolean;
	let winner = false;
	let empate = false;
	let id = data.id;
	let myTeam: null | TURN = null;
	let turn: TURN;
	let waiting = true;

	const room = String($page.url).split('/').at(-1);

	// HTTP Streaming
	onMount(() => {
		const sse = new EventSource(`/game/api?room=${room}`);
		sse.onmessage = (message) => {
			const game = JSON.parse(message.data) as IGame;
			board = game.board;
			winner = game.winner;
			empate = game.empate;
			myTeam = game.p1 === id ? game.p1turn : game.p2 === id ? game.p2turn : null;
			myTurn = myTeam === game.turn;
			waiting = !game.full;
			turn = game.turn;
		};
		return () => {
			sse.close();
		};
	});

	async function updateGame(idx: number) {
		if (board[idx] !== '') return;
		if (!myTurn) return;
		myTurn = false;
		await handleMovement(idx, `/game/api?room=${room}`);
	}
</script>

<pre>{JSON.stringify(
		{
			playerId: data?.id?.split('-')[0],
			team: myTeam ?? 'Not Asigned',
			mode: !myTeam ? 'Espectador' : 'Jugador',
			waiting
		},
		null,
		' '
	)}
	</pre>
{#if waiting && !myTeam}
	<p>Waiting for Player 2</p>
{/if}
<main class="board">
	<h1>Tres en raya</h1>
	<section class="game">
		{#each board as cell, idx}
			<Square {idx} {updateGame}>
				{cell}
			</Square>
		{/each}
	</section>
	<section class="turn">
		<Square isSelected={turn === TURNS.X}>
			{TURNS.X}
		</Square>
		<Square isSelected={turn === TURNS.O}>
			{TURNS.O}
		</Square>
	</section>
	<button
		on:click={() => {
			resetGame(`/game/api?room=${room}`);
		}}>Reset</button
	>
	{#if winner || empate}
		<Modal url={`/game/api?room=${room}`} {empate} {myTeam} {turn} />
	{/if}
</main>
