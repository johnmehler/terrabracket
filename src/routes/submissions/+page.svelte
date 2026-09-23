<script lang="ts">
	import { onMount } from 'svelte';
	import { bracket, type Submission } from '$lib/bracket.svelte';
	import { supabase } from '$lib/supabase';
	import MiniBracket from '$lib/components/MiniBracket.svelte';

	let subs = $state<Submission[]>([]);

	onMount(async () => {
		try {
			const { data, error } = await supabase
				.from('brackets')
				.select('username, data, created_at')
				.order('created_at', { ascending: false });
			if (!error && data) {
				subs = data.map((row) => {
					const parsed = JSON.parse(row.data);
					return {
						username: row.username,
						regions: parsed.regions,
						center: parsed.center,
						ts: new Date(row.created_at).getTime()
					};
				});
				return;
			}
		} catch {
			// fall through to local submissions
		}
		subs = Object.values(bracket.submissions()).sort((a, b) => b.ts - a.ts);
	});

	function champion(s: Submission): string {
		const p = s.regions[s.center[0]]?.[0];
		return p ? (typeof p === 'string' ? p : p.name) : '?';
	}
</script>

<svelte:head>
	<title>Submissions — Terra Mystica Pick'em</title>
</svelte:head>

<div class="app">
	<header>
		<img class="logo" src="/logo.png" alt="Terra Mystica Pick'em" />
		<h1 class="sr-only">Submissions</h1>
		<p class="sub"></p>
		<nav>
			<a href="/">← Back to bracket</a>
		</nav>
	</header>

	<main class="subs">
		<h2 class="subs-title">Submitted brackets</h2>
		{#if subs.length === 0}
			<p class="empty">No submissions yet.</p>
		{:else}
			<div class="sub-list">
				{#each subs as s (s.username)}
					<article class="sub-card">
						<div class="sub-head">
							<strong>{s.username}</strong>
							<span class="ts">{new Date(s.ts).toLocaleString()}</span>
						</div>
						<p class="champ-pick">Champion: <strong>{champion(s)}</strong></p>
						<MiniBracket regions={s.regions} center={s.center} />
					</article>
				{/each}
			</div>
		{/if}
	</main>
</div>
