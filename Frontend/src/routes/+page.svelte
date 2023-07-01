<script lang="ts">
	import { goto } from '$app/navigation'
	import { token, user_username } from '$lib/stores'

	let username = ''
	let password = ''

	async function handleLogin() {
		const formData = new FormData()
		formData.append('username', username)
		formData.append('password', password)
		await fetch('https://accounts-79lp.onrender.com/token', {
			method: 'POST',
			body: formData
		})
			.then((res) => {
				if (res.ok) {
					return res.json()
				} else {
					throw new Error('Could not Login/obtain token')
				}
			})
			.then((data) => {
				const { access_token } = data
				user_username.set(username)
				token.set({ access_token })
				localStorage.setItem('accessToken', access_token)
				document.cookie = `access_token=${access_token}; path=/;`
				goto('/home')
			})
			.catch((error) => {
				console.error(error)
			})
	}
</script>

<div class="bg-palette-lightgray shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
	<h1 class="text-2xl font-bold mb-6 text-palette-dark">Login to see your Todos!</h1>

	<form on:submit|preventDefault={handleLogin}>
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
