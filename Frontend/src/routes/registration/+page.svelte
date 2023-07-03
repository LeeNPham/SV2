<script lang="ts">
	import { goto } from '$app/navigation'
	let username = ''
	let password = ''
	let email = ''
	let firstName = ''
	let lastName = ''
	let description = ''

	function register() {
		const newUser = {
			username: username,
			email: email,
			first_name: firstName,
			last_name: lastName,
			description: description,
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

<main class="bg-palette-gray rounded-lg max-w-md mx-auto p-4 text-center">
	<h1 class="text-white text-2xl font-bold mb-4">Register New User</h1>

	<form on:submit|preventDefault|once={register} class="flex flex-col">
		<input
			placeholder="Username"
			type="text"
			id="username"
			bind:value={username}
			required
			class="px-4 py-1 mb-4 border rounded"
		/>

		<input
			placeholder="Email"
			type="text"
			id="email"
			bind:value={email}
			required
			class="px-4 py-1 mb-4 border rounded"
		/>

		<input
			placeholder="First Name"
			type="text"
			id="firstName"
			bind:value={firstName}
			required
			class="px-4 py-1 mb-4 border rounded"
		/>

		<input
			placeholder="Last Name"
			type="text"
			id="lastName"
			bind:value={lastName}
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

		<textarea
			placeholder="Profile Description (Optional)"
			id="description"
			bind:value={description}
			class="px-4 py-2 mb-4 border rounded"
		/>

		<div class='flex flex-col gap-4' >
		<button
			type="submit"
			class="px-4 py-2 bg-palette-dark text-white rounded cursor-pointer hover:bg-palette-dark/50"
		>
			Register
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
