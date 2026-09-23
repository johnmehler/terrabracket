<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { bracket } from '$lib/bracket.svelte';

	const COLORS = ['#e8481f', '#2a6fe0', '#3e8e52', '#6fb7e8'];

	let paths = $state<{ d: string; color: string }[]>([]);
	let w = $state(0);
	let h = $state(0);

	function measure() {
		const board = document.getElementById('board');
		if (!board) return;
		const bb = board.getBoundingClientRect();
		w = bb.width;
		h = bb.height;
		const items = board.querySelectorAll<HTMLElement>('.center .ranked li');
		const next: typeof paths = [];
		bracket.center.forEach((src, i) => {
			const from = board.querySelector<HTMLElement>(`.region-${src} .ranked li`);
			const to = items[i];
			if (!from || !to) return;
			const fb = from.getBoundingClientRect();
			const tb = to.getBoundingClientRect();
			const left = src === 0 || src === 2;
			const x1 = (left ? fb.right : fb.left) - bb.left;
			const y1 = fb.top + fb.height / 2 - bb.top;
			const x2 = (left ? tb.left : tb.right) - bb.left;
			const y2 = tb.top + tb.height / 2 - bb.top;
			const midx = (x1 + x2) / 2;
			next.push({
				d: `M ${x1} ${y1} L ${midx} ${y1} L ${midx} ${y2} L ${x2} ${y2}`,
				color: COLORS[src]
			});
		});
		paths = next;
	}

	onMount(() => {
		measure();
		const board = document.getElementById('board');
		const ro = new ResizeObserver(measure);
		if (board) ro.observe(board);
		window.addEventListener('resize', measure);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measure);
		};
	});

	$effect(() => {
		bracket.center;
		bracket.regions[0];
		bracket.regions[1];
		bracket.regions[2];
		bracket.regions[3];
		tick().then(measure);
	});
</script>

<svg class="wires" width={w} height={h} aria-hidden="true">
	{#each paths as p}
		<path d={p.d} fill="none" stroke={p.color} stroke-width="2" />
	{/each}
</svg>
