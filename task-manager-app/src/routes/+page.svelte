<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '$lib/stores/authStore';

	onMount(() => {
		const unsubscribe = isLoggedIn.subscribe((value) => {
			if (value) goto('/home');
		});
		return unsubscribe;
	});
</script>

<svelte:head>
	<title>SV2 Task Manager</title>
</svelte:head>
<div></div>
