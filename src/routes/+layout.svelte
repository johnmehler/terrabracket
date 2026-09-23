<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/auth.svelte';

	let { children } = $props();

	onMount(() => auth.init());
</script>

<svelte:head>
	<link rel="icon" href="/logo.png" />
</svelte:head>

{@render children()}
