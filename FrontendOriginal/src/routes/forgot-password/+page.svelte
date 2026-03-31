<script lang="ts">
	import { PUBLIC_BACKEND_USERS } from '$env/static/public'
	import { goto } from '$app/navigation'
	let username = ''
	let password = ''

	async function reset() {
		username = username.toLowerCase()
		const accountDetails = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/username/${username}`)
		let data = await accountDetails.json()
		console.log(data._id)

		const response = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${data._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ hashed_password: password })
		})
			.then(() => {
				goto('/')
			})
			.catch(() => {
				return {
					status: 301,
					error: new Error('Could not create a new User')
				}
			})

		console.log(response)
	}
</script>

<main class="bg-palette-lightgray rounded-lg max-w-md mx-auto p-4 text-center">
	<h1 class="text-palette-dark text-2xl font-bold mb-4">
		Verify Username and provide an updated password
	</h1>

	<form on:submit|preventDefault|once={reset} class="flex flex-col">
		<input
			placeholder="Username"
			type="text"
			id="username"
			bind:value={username}
			required
			class="px-4 py-1 mb-4 border rounded"
		/>

		<input
			placeholder="Password"
			type="password"
			id="password"
			bind:value={password}
			required
			class="px-4 py-1 mb-4 border rounded"
		/>

		<div class="flex flex-col gap-4">
			<button
				type="submit"
				class="px-4 py-2 bg-palette-dark text-white rounded cursor-pointer hover:bg-palette-dark/50"
			>
				Reset Password
			</button>
			<button
				type="button"
				class="px-4 py-2 bg-palette-dark text-white rounded cursor-pointer hover:bg-palette-dark/50"
			>
				<a href="/">Return to Login</a>
			</button>
		</div>
	</form>
</main>
