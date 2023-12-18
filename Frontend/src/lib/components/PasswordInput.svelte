<!-- PasswordInput.svelte -->
<script>
	//@ts-nocheck
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons'

	export let value = ''
	let showPassword = false

	function togglePassword() {
		showPassword = !showPassword
	}
</script>

<div class="relative">
	{#if !showPassword}
		<input class="rounded w-full" bind:value type="password" />
	{:else}
		<input class="rounded w-full" bind:value type="text" />
	{/if}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="absolute inset-y-0 right-0 pr-3 flex items-center outline-none cursor-pointer"
		on:click={togglePassword}
		on:keydown={() => {}}
	>
		{#if showPassword}
			<EyeOutline class="w-4 text-gray-700" />
		{:else}
			<EyeSlashOutline class="w-4 text-gray-700" />
		{/if}
	</div>
</div>
