<script>
	import { goto } from '$app/navigation'
	let username = ''
	let password = ''

	// function register() {
	// 	// Perform registration logic here
	// 	console.log('Registering user:', username)
	// 	console.log('Password:', password)

	// 	// Clear form fields after registration
	// 	username = ''
	// 	password = ''
	// }

	function register() {
		const newUser = {
			username: username,
			hashed_password: password
		}

		fetch('https://accounts-79lp.onrender.com/api/user/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newUser)
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
	}
</script>

<main class="max-w-md mx-auto p-4 text-center">
	<h1 class="text-2xl font-bold mb-4">Register New User</h1>

	<form on:submit|preventDefault={register} class="flex flex-col">
		<label for="username" class="font-bold mb-2">Username:</label>
		<input
			type="text"
			id="username"
			bind:value={username}
			required
			class="px-4 py-2 mb-4 border rounded"
		/>

		<label for="password" class="font-bold mb-2">Password:</label>
		<input
			type="password"
			id="password"
			bind:value={password}
			required
			class="px-4 py-2 mb-4 border rounded"
		/>

		<button
			type="submit"
			class="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
		>
			Register
		</button>
	</form>
</main>
