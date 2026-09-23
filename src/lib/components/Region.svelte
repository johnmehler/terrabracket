<script lang="ts">
	import { bracket, REGION_NAMES, type Player } from '$lib/bracket.svelte';
	import Sortable from './Sortable.svelte';

	let { r, dir, hide = false }: { r: number; dir: 'left' | 'right'; hide?: boolean } = $props();
	const arrow = $derived(dir === 'left' ? '←' : '→');
</script>

<section class="region region-{r}" class:hide>
	<h2>{REGION_NAMES[r]}</h2>
	<Sortable
		items={bracket.regions[r]}
		onreorder={(from, to) => bracket.reorderRegion(r, from, to)}
	>
		{#snippet row(player: Player, i: number)}
			<span class="rank">{i + 1}</span>
			<span class="name">{player.name}</span>
			{#if i === 0}<span class="adv">{arrow} Finals</span>{/if}
			<span class="score">{player.score}</span>
		{/snippet}
	</Sortable>
</section>
