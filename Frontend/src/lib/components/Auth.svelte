<script>
	// import { goto } from '$app/navigation';
	//@ts-nocheck
	import { authHandlers, authStore } from '$lib/stores/authStore'
	import PasswordInput from './PasswordInput.svelte'
	import facebookLogo from '$lib/images/facebook.svg'
	import googleLogo from '$lib/images/google.svg'
	import appleLogo from '$lib/images/apple.svg'
	import twitterLogo from '$lib/images/twitter.svg'

	export let register = false
	export let displayLoginValidator = false
	export let forgotPassword = false
	export let registerStep = 1 // 1 for email/password, 2 for name

	let email = ''
	let password = ''
	let confirmPassword = ''
	let firstName = ''
	let lastName = ''
	let authenticating = false
	let displayName = ''
	let loginValidatorMessage = ''
	let isSubmittingForgotPassword = false

	async function handleSubmit() {
		authenticating = true
		displayLoginValidator = false
		if (
			!email ||
			!password ||
			(register && !firstName) ||
			(register && !lastName) ||
			(register && !confirmPassword)
		) {
			loginValidatorMessage = 'Enter all the required details'
			displayLoginValidator = true
			return
		}

		if (register && password === confirmPassword) {
			try {
				displayName = firstName + ' ' + lastName
				await authHandlers.signup(email, password)
				console.log('Registration successful')
				await authHandlers.updateProfile({ displayName: displayName })
				window.location.href = '/home'
			} catch (err) {
				console.log(err)
				loginValidatorMessage = err.message.split(':')[1]
				displayLoginValidator = true
			}
		} else {
			try {
				await authHandlers.login(email, password)
				window.location.href = '/home'
			} catch (err) {
				loginValidatorMessage = err.message.split(':')[1]
				displayLoginValidator = true
			}
		}
		console.log('authstore and current user in auth.svelte', $authStore.currentUser)
		if ($authStore.currentUser) {
			window.location.href = '/home'
		}
		authenticating = false
	}

	async function handleProceed() {
		if (!email || !password || !confirmPassword) {
			loginValidatorMessage = 'Enter all the required details'
			displayLoginValidator = true
			return
		} else if (password !== confirmPassword) {
			loginValidatorMessage = 'Passwords do not match'
			displayLoginValidator = true
			return
		} else {
			try {
				const { exists } = await authHandlers.checkEmailExists(email)
				if (exists) {
					loginValidatorMessage = 'An account already exists with the same email address'
					displayLoginValidator = true
					return
				} else {
					registerStep = 2
					displayLoginValidator = false
				}
			} catch (error) {
				console.log(error)
				loginValidatorMessage = error.message.split(':')[1]
				displayLoginValidator = true
			}
		}
	}

	async function handleGoogleLogin() {
		try {
			await authHandlers.loginWithGoogle()
			window.location.href = '/home'
		} catch (err) {
			console.log(err)
			loginValidatorMessage = err.message.split(':')[1]
			displayLoginValidator = true
		}
	}

	async function handleFacebookLogin() {
		try {
			await authHandlers.loginWithFacebook()
			window.location.href = '/home'
		} catch (err) {
			console.log(err)
			if (err.code === 'auth/account-exists-with-different-credential') {
				loginValidatorMessage =
					'An account already exists with the same email address, please try a different login method'
			} else {
				loginValidatorMessage = err.message.split(':')[1]
			}
			displayLoginValidator = true
		}
	}

	async function handleAppleLogin() {
		try {
			await authHandlers.loginWithApple()
			window.location.href = '/home'
		} catch (err) {
			console.log(err)
			loginValidatorMessage = err.message.split(':')[1]
			displayLoginValidator = true
		}
	}

	async function handleTwitterLogin() {
		try {
			await authHandlers.loginWithTwitter()
			window.location.href = '/home'
		} catch (err) {
			console.log(err)
			if (err.code === 'auth/account-exists-with-different-credential') {
				loginValidatorMessage =
					'An account already exists with the same email address, please try a different login method'
			} else {
				loginValidatorMessage = err.message.split(':')[1]
			}
			displayLoginValidator = true
		}
	}

	async function handleForgotPassword() {
		try {
			await authHandlers.resetPassword(email)
			displayLoginValidator = true
			isSubmittingForgotPassword = true
			loginValidatorMessage = 'Password reset email sent, please check your email'
		} catch (err) {
			console.log(err)
			loginValidatorMessage = err.message.split(':')[1]
			displayLoginValidator = true
		}
	}
</script>

<div
	class="bg-palette-lightgray shadow-md rounded-xl px-8 pt-6 pb-8 max-w-[350px] text-center flex flex-col w-full items-center justify-center"
>
	<h1 class="text-2xl font-bold mb-6 text-palette-dark">Task Manager SV2</h1>

	<!-- Register -->
	{#if register}
		<!-- Asks for email, password, confirm password, first name, last name -->
		{#if registerStep === 1}
			<div class="font-tanaegean text-2xl mb-3">Create a user account</div>

			{#if displayLoginValidator}
				<p class="text-sm text-red-700 ml-[1px] w-2/3">{loginValidatorMessage}</p>
			{:else}
				<p class="text-sm text-gray-600 ml-[1px]">Enter all the required details</p>
			{/if}

			<form class="flex flex-col gap-2 mt-8 w-full items-center justify-center" action="">
				<label for="email" class="block text-gray-700 text-sm font-bold mb-2">Username:</label>
				<input
					type="text"
					id="email"
					bind:value={email}
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>

				<label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>

				<PasswordInput bind:value={password} />
				<label class="block text-gray-700 text-sm font-bold mb-2" for="confirmPassword"
					>Confirm Password
				</label>
				<PasswordInput bind:value={confirmPassword} />

				<div class="text-xs mt-2">
					By creating an account, you agree to SV2
					<a href="/termsOfUse" class="font-bold text-adamas-blue">Terms of Use</a> and
					<a href="/privacyPolicy" class="font-bold text-adamas-blue">Privacy Policy</a>
				</div>

				<button
					class="w-full bg-adamas-blue font-bold text-sm rounded-xl py-2 mt-4 hover:scale-105 hover:bg-[#aec3fc] transition-all duration-300"
					on:click={handleProceed}
				>
					Proceed
				</button>
			</form>
		{:else}
			<div class="font-tanaegean text-2xl mb-3">Set up your user account</div>

			{#if displayLoginValidator}
				<p class="text-sm text-red-700 ml-[1px]">{loginValidatorMessage}</p>
			{:else}
				<p class="text-sm text-gray-600 ml-[1px]">Enter all the required details</p>
			{/if}

			<form class="flex flex-col gap-2 mt-8 w-5/6" action="">
				<label class="text-sm" for="firstName">First Name</label>
				<input class="rounded" bind:value={firstName} type="text" />

				<label class="text-sm" for="lastName">Last Name</label>
				<input class="rounded" bind:value={lastName} type="text" />

				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="flex justify-end mt-1 text-sm text-[#9EB9FF] font-bold hover:underline cursor-pointer"
					on:click={() => {
						registerStep = 1
						displayLoginValidator = false
					}}
					on:keydown={() => {}}
				>
					Back to email and password
				</div>

				<button
					class="w-full bg-adamas-blue font-bold text-sm rounded-xl py-2 mt-4 hover:scale-105 hover:bg-[#aec3fc] transition-all duration-300"
					on:click={handleSubmit}
				>
					Create Account
				</button>
			</form>
		{/if}
		<!-- Login -->
	{:else if !register && !forgotPassword}
		<div class="font-tanaegean text-2xl mb-3">Sign in to customer account</div>

		{#if displayLoginValidator}
			<p class="text-sm text-red-700 ml-[1px] w-2/3">{loginValidatorMessage}</p>
		{:else}
			<p class="text-sm text-gray-600 ml-[1px]">Enter all the required details</p>
		{/if}

		<form class="flex flex-col gap-2 mt-8 w-5/6" action="">
			<label class="text-sm" for="email">Email Address</label>
			<input class="rounded" bind:value={email} type="email" />

			<label class="text-sm" for="password">Password </label>
			<PasswordInput bind:value={password} />

			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="flex justify-end mt-1 text-sm text-[#9EB9FF] font-bold hover:underline cursor-pointer"
				on:click={() => {
					forgotPassword = true
					displayLoginValidator = false
				}}
				on:keydown={() => {}}
			>
				Forgot Password?
			</div>

			<button
				class="w-full bg-adamas-blue font-bold text-sm rounded-xl py-2 mt-4 hover:scale-105 hover:bg-[#aec3fc] transition-all duration-300"
				on:click={handleSubmit}
			>
				Sign In
			</button>
		</form>
		<!-- Forgot Password -->
	{:else if forgotPassword}
		<div class="font-tanaegean text-2xl mb-3">Forgot Password</div>

		{#if displayLoginValidator && !isSubmittingForgotPassword}
			<p class="text-sm text-red-700 ml-[1px] mt-1">{loginValidatorMessage}</p>
		{:else if isSubmittingForgotPassword}
			<p class="text-sm text-green-500 ml-[1px] mt-1">
				{loginValidatorMessage}
			</p>
		{:else if !displayLoginValidator}
			<p class="text-sm text-gray-600 ml-[1px] mt-1">
				Enter the email address linked to your account
			</p>
		{/if}

		<form on:submit={handleForgotPassword} class="flex flex-col gap-2 mt-8 w-5/6" action="">
			<label class="text-sm" for="email">Email Address</label>
			<input class="rounded" bind:value={email} type="email" />

			<button
				type="submit"
				class="w-full bg-adamas-blue font-bold text-sm rounded-xl py-2 mt-4 hover:scale-105 hover:bg-[#aec3fc] transition-all duration-300"
			>
				Proceed
			</button>
		</form>
	{/if}

	{#if !forgotPassword}
		<div class="w-5/6 mt-3">
			<div class="flex items-center mt-1 mb-3">
				<div class="flex-1 border-b border-gray-300" />
				<span class="px-2 font-bold text-xs">OR</span>
				<div class="flex-1 border-b border-gray-300" />
			</div>

			<div class="flex justify-center items-center mb-3">
				{#if register}
					<span class="text-center font-bold text-sm">Register with</span>
				{:else}
					<span class="text-center font-bold text-sm">Sign in with</span>
				{/if}
			</div>

			<div class="flex flex-row gap-10 items-center justify-center">
				<button
					class="flex items-center justify-center w-10 h-10 text-sm rounded-lg hover:scale-105 transition-all duration-300"
					on:click={handleGoogleLogin}
				>
					<img src={googleLogo} alt="googleLogo" class="w-10" />
				</button>

				<button
					class="flex items-center justify-center w-12 h-12 text-sm rounded-lg hover:scale-105 transition-all duration-300"
					on:click={handleFacebookLogin}
				>
					<img src={facebookLogo} alt="facebookLogo" class="w-12" />
				</button>
				<button
					class="flex items-center justify-center w-10 h-10 text-sm rounded-lg hover:scale-105 transition-all duration-300"
					on:click={handleAppleLogin}
				>
					<img src={appleLogo} alt="appleLogo" class="w-10" />
				</button>
				<button
					class="flex items-center justify-center w-12 h-12 text-sm rounded-lg hover:scale-105 transition-all duration-300"
					on:click={handleTwitterLogin}
				>
					<img src={twitterLogo} alt="twitterLogo" class="w-12" />
				</button>
			</div>
		</div>
	{/if}

	{#if register && !forgotPassword}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-row justify-center items-center gap-2 mt-10 ml-24 text-sm text-gray-600 cursor-pointer"
			on:click={() => {
				register = false
				displayLoginValidator = false
			}}
			on:keydown={() => {}}
		>
			Already have an account?
			<p
				class="cursor-pointer font-bold text-center
			text-[#9EB9FF] underline hover:text-[#aec3fc]"
			>
				Log In
			</p>
		</div>
	{:else if !register && !forgotPassword}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-row justify-center items-center gap-2 mt-10 ml-24 text-sm text-gray-600 cursor-pointer"
			on:click={() => {
				register = true
				displayLoginValidator = false
			}}
			on:keydown={() => {}}
		>
			Don't have an account?
			<p
				class="cursor-pointer font-bold text-center
			text-[#9EB9FF] underline hover:text-[#aec3fc]"
			>
				Register
			</p>
		</div>
	{:else if forgotPassword}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="w-full flex flex-row justify-center items-center mt-10 ml-[-44px] text-sm cursor-pointer"
			on:click={() => {
				register = false
				forgotPassword = false
				displayLoginValidator = false
			}}
			on:keydown={() => {}}
		>
			<p
				class="cursor-pointer font-bold text-center
			text-[#9EB9FF] underline hover:text-[#aec3fc]"
			>
				Log In
			</p>
		</div>
	{/if}
</div>

<style>
</style>
