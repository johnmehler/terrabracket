<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/auth.svelte';
	import { bracket } from '$lib/bracket.svelte';
	import Region from '$lib/components/Region.svelte';
	import FinalFour from '$lib/components/FinalFour.svelte';
	import Connectors from '$lib/components/Connectors.svelte';

	onMount(async () => {
		await auth.init();
		if (!auth.user && !auth.guest) {
			goto('/login');
			return;
		}
		bracket.load();
	});
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
			{#if auth.user}
				<span class="who">{auth.user.email}</span>
				<button class="navbtn" onclick={() => auth.signOut()}>Sign out</button>
			{:else}
				<a href="/login">Log in</a>
			{/if}
			<a href="/submissions">Submissions</a>
		</nav>
	</header>

	{#if auth.user || auth.guest}
		<section class="submitbar">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					bracket.submit();
				}}
			>
				<input
					bind:value={bracket.username}
					oninput={() => bracket.save()}
					placeholder="BGA username"
					maxlength="30"
					aria-label="BGA username"
				/>
				<button type="submit" disabled={!bracket.username.trim()}>Submit</button>
			</form>
			{#if bracket.submittedAt}
				<p class="done">
					Submitted as <strong>{bracket.username}</strong> — {new Date(
						bracket.submittedAt
					).toLocaleString()}
				</p>
			{/if}
		</section>

		<main class="board" id="board">
			<Connectors />
			<Region r={0} dir="right" />
			<FinalFour />
			<Region r={1} dir="left" />
			<Region r={2} dir="right" />
			<Region r={3} dir="left" />
		</main>
	{/if}
</div>
