<script lang="ts">
	import Square from './Square.svelte';
	import Modal from './Modal.svelte';
	import { onMount } from 'svelte';
	import { TURNS } from '$lib/consts';
	import type { PageData } from './$types';
	import { resetGame, handleMovement } from '$lib/utils';
	import { page } from '$app/stores';
	import { PUBLIC_ADMIN } from '$env/static/public';

	export let data: PageData;
	// Game init
	let board = Array(9).fill('');
	let myTurn: boolean;
	let winner = false;
	let empate = false;
	let id = data.session?.user?.email;
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
		sse.onerror = (e) => {
			console.log(e);
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

<!-- {#if waiting}
	<p>Waiting for Player 2</p>
{/if} -->
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
	{#if data.session?.user?.name === PUBLIC_ADMIN}
		<button
			on:click={() => {
				resetGame(`/game/api?room=${room}`);
			}}>Reset</button
		>
	{/if}
	{#if winner || empate}
		<Modal url={`/game/api?room=${room}`} {empate} {myTeam} {turn} />
	{/if}
	<pre>{JSON.stringify(
			{
				playerId: data?.id,
				team: myTeam ?? 'Not Asigned',
				mode: !myTeam ? 'Espectador' : 'Jugador',
				waiting
			},
			null,
			' '
		)}
	</pre>
</main>
