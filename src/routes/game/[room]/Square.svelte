<script lang="ts">
	export let idx: number = 0;
	export let updateGame: (idx: number) => void = (number) => {};
	export let isSelected: boolean = false;
</script>

<div
	on:click={async () => {
		updateGame(idx);
	}}
	class:is-selected={isSelected}
	class="square"
>
	<slot />
</div>
