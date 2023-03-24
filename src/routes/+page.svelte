<script lang="ts">
	import { page } from '$app/stores';
	import { each } from 'svelte/internal';

	const rooms = [
		{ href: '/game/1', name: 'Room 1' },
		{ href: '/game/2', name: 'Room 2' },
		{ href: '/game/3', name: 'Room 3' },
		{ href: '/game/4', name: 'Room 4' },
		{ href: '/game/5', name: 'Room 5' }
	];
</script>

<h1>Welcome to Tres en Raya</h1>
{#if !$page.data.session}
	<p>Login to play!</p>
{:else}
	<p>Select a room</p>
	<section>
		{#each rooms as room (room.name)}
			<a href={room.href}>{room.name}</a>
		{/each}
	</section>
{/if}

<style>
	h1,
	p {
		margin-inline: auto;
	}
	section {
		display: flex;
	}
</style>
