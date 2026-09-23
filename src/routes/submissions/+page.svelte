<script lang="ts">
	import { onMount } from 'svelte';
	import { bracket, REGION_NAMES, type Submission } from '$lib/bracket.svelte';
	import { supabase } from '$lib/supabase';

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
		return s.regions[s.center[0]]?.[0]?.name ?? '?';
	}

	function finalist(s: Submission, i: number): string {
		return s.regions[s.center[i]]?.[0]?.name ?? '?';
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
						<details>
							<summary>Full bracket</summary>
							<div class="detail">
								<p class="detail-label">Finals ranking</p>
								<ol>
									{#each [0, 1, 2, 3] as i}
										<li>{finalist(s, i)} <span class="src">({REGION_NAMES[s.center[i]]})</span></li>
									{/each}
								</ol>
								<p class="detail-label">Semifinals</p>
								<ul>
									{#each s.regions as r, i}
										<li>
											<span class="src">{REGION_NAMES[i]}:</span>
											{r.map((p) => p.name).join(', ')}
										</li>
									{/each}
								</ul>
							</div>
						</details>
					</article>
				{/each}
			</div>
		{/if}
	</main>
</div>
