<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { authHandlers, authStore } from '$lib/stores/authStore';
	import Auth from '$lib/components/Auth.svelte';

	let { children } = $props();
	let cleanup: undefined | (() => void);

	onMount(() => {
		cleanup = authHandlers.initAuthListener();
		return () => cleanup?.();
	});
</script>

<div class="app">
	<main class="main-wrap">
		<div class="frame">
			{#if !$authStore.currentUser}
				<Auth />
			{:else}
				{@render children()}
			{/if}
		</div>
	</main>
</div>

<style>
	.app {
		display: grid;
		min-height: 100vh;
		background: var(--palette-dark);
	}
	.main-wrap {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 1rem;
		min-height: 100vh;
	}
	/* Matches original: max phone width, inner surface = palette-medium */
	.frame {
		width: 100%;
		max-width: 414px;
		min-height: min(896px, 100vh);
		background: var(--palette-medium);
		border-radius: 1.5rem;
		padding: 1.5rem 1.25rem 2rem;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
	}
</style>
