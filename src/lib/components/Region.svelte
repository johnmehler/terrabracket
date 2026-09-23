<script lang="ts">
	import { bracket, REGION_NAMES } from '$lib/bracket.svelte';
	import Sortable from './Sortable.svelte';

	let { r, dir }: { r: number; dir: 'left' | 'right' } = $props();
	const arrow = $derived(dir === 'left' ? '←' : '→');
</script>

<section class="region region-{r}">
	<h2>{REGION_NAMES[r]}</h2>
	<Sortable
		items={bracket.regions[r]}
		onreorder={(from, to) => bracket.reorderRegion(r, from, to)}
	>
		{#snippet row(team: string, i: number)}
			<span class="rank">{i + 1}</span>
			<span class="name">{team}</span>
			{#if i === 0}<span class="adv">{arrow} Finals</span>{/if}
		{/snippet}
	</Sortable>
</section>
