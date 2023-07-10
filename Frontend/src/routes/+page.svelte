<script lang="ts">
	import { goto } from '$app/navigation'
	import { _handleLogin } from './+page'

	let username = ''
	let password = ''
	let showWrongAccountDetails = false

	async function login() {
		const res = await _handleLogin(username, password)
		if (res == false) {
			showWrongAccountDetails = true
		} else {
			goto('/home')
		}
	}
</script>

<div class="bg-palette-lightgray shadow-md rounded-xl px-8 pt-6 pb-8">
	<h1 class="text-2xl font-bold mb-6 text-palette-dark">Login to see your Todos!</h1>

	{#if showWrongAccountDetails}
		<div class="flex flex-row w-[270px] text-red-700">Wrong username/password combination"</div>
	{/if}

	<form on:submit|preventDefault={login}>
		<div class="mb-4">
			<label for="email" class="block text-gray-700 text-sm font-bold mb-2">Username:</label>
			<input
				type="text"
				id="username"
				bind:value={username}
				required
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</div>

		<div class="mb-4">
			<label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</div>

		<div class="flex items-center justify-between">
			<button
				type="submit"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				Login
			</button>
			<a
				href="/registration"
				class="inline-block align-baseline font-bold text-sm text-palette-dark hover:text-palette-dark/50"
				>Register</a
			>
			<a
				href="/forgot-password"
				class="inline-block align-baseline font-bold text-sm text-palette-dark hover:text-palette-dark/50"
				>Forgot Password?</a
			>
		</div>
	</form>
</div>
