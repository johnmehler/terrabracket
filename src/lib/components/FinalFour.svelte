<script lang="ts">
	import { bracket, REGION_NAMES } from '$lib/bracket.svelte';
	import Sortable from './Sortable.svelte';
</script>

<section class="center">
	<h2>Finals</h2>
	<p class="hint">Semifinal winners — drag to rank them</p>
	<Sortable items={bracket.center} onreorder={(from, to) => bracket.reorderCenter(from, to)}>
		{#snippet row(src: number, i: number)}
			<span class="rank">{i + 1}</span>
			<span class="name">{bracket.regions[src][0]}</span>
			<span class="src">{REGION_NAMES[src]}</span>
		{/snippet}
	</Sortable>
	<div class="champ">
		<span class="label">Champion</span>
		<strong>{bracket.champion}</strong>
	</div>
</section>
