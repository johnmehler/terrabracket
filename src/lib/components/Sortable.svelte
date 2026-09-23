<script lang="ts" generics="T">
	import Sortable from 'sortablejs';
	import type { Snippet } from 'svelte';

	let {
		items,
		onreorder,
		row
	}: {
		items: T[];
		onreorder: (from: number, to: number) => void;
		row: Snippet<[item: T, index: number]>;
	} = $props();

	let list: HTMLElement;

	$effect(() => {
		const s = Sortable.create(list, {
			animation: 150,
			ghostClass: 'sort-ghost',
			onEnd: (evt) => {
				const { oldIndex, newIndex, item, from } = evt;
				if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
				// Undo Sortable's DOM move; Svelte re-renders the row order from state.
				const ref = from.children[oldIndex < newIndex ? oldIndex : oldIndex + 1] ?? null;
				from.insertBefore(item, ref);
				onreorder(oldIndex, newIndex);
			}
		});
		return () => s.destroy();
	});
</script>

<ol bind:this={list} class="ranked">
	{#each items as item, i (item)}
		<li>{@render row(item, i)}</li>
	{/each}
</ol>
