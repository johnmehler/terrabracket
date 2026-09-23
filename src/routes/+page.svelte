<script lang="ts">
	import { onMount } from 'svelte';
	import { bracket } from '$lib/bracket.svelte';
	import Region from '$lib/components/Region.svelte';
	import FinalFour from '$lib/components/FinalFour.svelte';
	import Connectors from '$lib/components/Connectors.svelte';

	const MOBILE_LABELS = ['North', 'East', 'South', 'West', 'Finals'];

	let pin = $state('');
	let submitError = $state('');
	let busy = $state(false);
	let mobile = $state(false);
	let active = $state(0);

	onMount(() => {
		bracket.load();
		const mq = matchMedia('(max-width: 900px)');
		mobile = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (mobile = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	async function submit() {
		submitError = '';
		busy = true;
		const result = await bracket.submit(pin);
		busy = false;
		if (result) submitError = result;
	}
</script>

<svelte:head>
	<title>Terra Mystica Pick'em</title>
</svelte:head>

<div class="app">
	<header>
		<img class="logo" src="/logo.png" alt="Terra Mystica Pick'em" />
		<h1 class="sr-only">Terra Mystica Pick'em</h1>
		<p class="sub">Drag to sort each bracket — #1 in every semifinal advances to the Finals.</p>
		<nav>
			<a href="/submissions">Submissions</a>
		</nav>
	</header>

	<section class="submitbar">
		<form
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<input
				bind:value={bracket.username}
				oninput={() => bracket.save()}
				placeholder="BGA username"
				maxlength="30"
				aria-label="BGA username"
			/>
			<input
				class="pin"
				bind:value={pin}
				placeholder="PIN"
				inputmode="numeric"
				maxlength="6"
				aria-label="PIN, 4 to 6 digits"
				title="4–6 digit PIN — set it on your first submit, required to update"
			/>
			<button type="submit" disabled={busy || !bracket.username.trim() || pin.length < 4}>
				Submit
			</button>
		</form>
		{#if submitError}
			<p class="err">{submitError}</p>
		{:else if bracket.submittedAt}
			<p class="done">
				Submitted as <strong>{bracket.username}</strong> — {new Date(
					bracket.submittedAt
				).toLocaleString()}
			</p>
		{/if}
		<p class="pin-hint">New username? Pick a 4–6 digit PIN. Returning? Same PIN updates your bracket.</p>
	</section>

	<div class="mobile-nav">
		<button onclick={() => (active = (active + 4) % 5)} aria-label="Previous bracket">←</button>
		<span class="mobile-label">{MOBILE_LABELS[active]}</span>
		<button onclick={() => (active = (active + 1) % 5)} aria-label="Next bracket">→</button>
	</div>

	<main class="board" id="board">
		<Connectors />
		<Region r={0} dir="right" hide={mobile && active !== 0} />
		<FinalFour hide={mobile && active !== 4} />
		<Region r={1} dir="left" hide={mobile && active !== 1} />
		<Region r={2} dir="right" hide={mobile && active !== 2} />
		<Region r={3} dir="left" hide={mobile && active !== 3} />
	</main>

	<nav class="mobile-submissions">
		<a href="/submissions">Submissions</a>
	</nav>
</div>
