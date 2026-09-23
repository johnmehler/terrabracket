<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/auth.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let notice = $state('');
	let busy = $state(false);

	onMount(async () => {
		await auth.init();
		if (auth.user || auth.guest) goto('/');
	});

	async function run(fn: () => Promise<string | null>) {
		error = '';
		notice = '';
		busy = true;
		const result = await fn();
		busy = false;
		if (result === 'confirm') {
			notice = 'Check your email to confirm your account, then sign in.';
		} else if (result) {
			error = result;
		} else {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Log in — Terra Mystica Pick'em</title>
</svelte:head>

<div class="app login-page">
	<div class="login-card">
		<img class="logo login-logo" src="/logo.png" alt="Terra Mystica Pick'em" />
		<form
			onsubmit={(e) => {
				e.preventDefault();
				run(() => auth.signIn(email, password));
			}}
		>
			<input
				type="email"
				bind:value={email}
				placeholder="Email"
				required
				autocomplete="email"
			/>
			<input
				type="password"
				bind:value={password}
				placeholder="Password"
				required
				minlength="6"
				autocomplete="current-password"
			/>
			{#if error}<p class="login-error">{error}</p>{/if}
			{#if notice}<p class="login-notice">{notice}</p>{/if}
			<button type="submit" disabled={busy}>Sign in</button>
			<button
				type="button"
				class="secondary"
				disabled={busy}
				onclick={() => run(() => auth.signUp(email, password))}>Create account</button
			>
		</form>
		<div class="divider"><span>or</span></div>
		<button
			class="guest"
			onclick={() => {
				auth.continueAsGuest();
				goto('/');
			}}>Continue as guest</button
		>
	</div>
</div>
