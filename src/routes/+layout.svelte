<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import '../app.css';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import 'iconify-icon';

	export let data: LayoutData;
</script>

<nav>
	<a href="/">Home</a>
	{#if !data.session}
		<button
			on:click={() => {
				signIn('github');
			}}
		>
			<iconify-icon icon="tabler:brand-github" />
			Login</button
		>
	{:else}
		<p>Hello {data.session.user?.email}</p>
		<button
			on:click={async () => {
				await signOut();
				goto('/');
			}}
		>
			Logout</button
		>
	{/if}
</nav>

<slot />

<style>
	a {
		margin: 0.7rem 1rem;
	}
	nav,
	button {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	button {
		gap: 0.5rem;
	}
</style>
