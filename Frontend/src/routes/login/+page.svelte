<script>
	let email = ''
	let password = ''

	function handleLogin() {
		// Perform login logic here
		// You can send the email and password to your server for authentication
		console.log('Logging in...')
		console.log('Email:', email)
		console.log('Password:', password)
	}
</script>

<div class="bg-palette-lightgray shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
	<h1 class="text-2xl font-bold mb-6 text-palette-dark">Login to see your Todos!</h1>

	<form on:submit|preventDefault={handleLogin}>
		<div class="mb-4">
			<label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
			<input
				type="email"
				id="email"
				bind:value={email}
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
				href="forgot-password"
				class="inline-block align-baseline font-bold text-sm text-palette-dark hover:text-palette-dark/50"
				>Forgot Password?</a
			>
		</div>
	</form>
</div>
