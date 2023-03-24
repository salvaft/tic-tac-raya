<script lang="ts">
	import Square from './Square.svelte';
	import { resetGame } from '$lib/utils';

	export let myTeam;
	export let url: string;
	export let turn: TURN;
	export let empate: boolean;
	//@ts-expect-error
	import confetti from 'canvas-confetti';

	let title = 'Sigamos...';
	let IamTheWinner = false;
	if (!empate) {
		IamTheWinner = turn === myTeam;
		if (IamTheWinner) {
			confetti();
		}
		title = IamTheWinner ? 'Ganaste' : title;
	}
</script>

<section class="winner">
	<div class="text">
		<h2>{title}</h2>
		{#if !empate}
			{#if !IamTheWinner}
				<h3>Gano:</h3>
			{/if}

			<div class="win">
				<Square>{turn}</Square>
			</div>
		{/if}
		<footer>
			<button
				on:click={() => {
					resetGame(url);
				}}>Empezar de nuevo</button
			>
		</footer>
	</div>
</section>
