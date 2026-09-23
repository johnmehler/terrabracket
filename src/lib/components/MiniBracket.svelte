<script lang="ts">
	import type { Player } from '$lib/bracket.svelte';

	let { regions, center }: { regions: (Player | string)[][]; center: number[] } = $props();

	function pname(p: Player | string): string {
		return typeof p === 'string' ? p : p.name;
	}
</script>

<div class="mini-board">
	<div class="mini-col">
		<div class="mini-bracket mb-0">
			{#each regions[0] ?? [] as p, i}
				<div class="mini-row" class:top={i === 0}>{pname(p)}</div>
			{/each}
		</div>
		<div class="mini-bracket mb-2">
			{#each regions[2] ?? [] as p, i}
				<div class="mini-row" class:top={i === 0}>{pname(p)}</div>
			{/each}
		</div>
	</div>
	<div class="mini-bracket mini-center">
		{#each center as src}
			<div class="mini-row">{pname(regions[src]?.[0] ?? '?')}</div>
		{/each}
	</div>
	<div class="mini-col">
		<div class="mini-bracket mb-1">
			{#each regions[1] ?? [] as p, i}
				<div class="mini-row" class:top={i === 0}>{pname(p)}</div>
			{/each}
		</div>
		<div class="mini-bracket mb-3">
			{#each regions[3] ?? [] as p, i}
				<div class="mini-row" class:top={i === 0}>{pname(p)}</div>
			{/each}
		</div>
	</div>
</div>
