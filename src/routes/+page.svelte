<script lang="ts">
	import { onMount } from 'svelte';
	import { bracket } from '$lib/bracket.svelte';
	import Region from '$lib/components/Region.svelte';
	import FinalFour from '$lib/components/FinalFour.svelte';
	import Connectors from '$lib/components/Connectors.svelte';

	let pin = $state('');
	let submitError = $state('');
	let busy = $state(false);

	onMount(() => bracket.load());

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

	<main class="board" id="board">
		<Connectors />
		<Region r={0} dir="right" />
		<FinalFour />
		<Region r={1} dir="left" />
		<Region r={2} dir="right" />
		<Region r={3} dir="left" />
	</main>
</div>
