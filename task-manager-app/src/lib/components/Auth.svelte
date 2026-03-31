<script>
	import { authHandlers } from '$lib/stores/authStore';
	import googleLogo from '$lib/images/google.svg';

	let register = $state(false);
	let displayLoginValidator = $state(false);
	let forgotPassword = $state(false);
	let registerStep = $state(1);

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let loginValidatorMessage = $state('');
	let isSubmittingForgotPassword = $state(false);

	async function handleSubmit() {
		displayLoginValidator = false;
		if (!email || !password || (register && (!firstName || !lastName || !confirmPassword))) {
			loginValidatorMessage = 'Enter all the required details';
			displayLoginValidator = true;
			return;
		}
		try {
			if (register) {
				if (password !== confirmPassword) {
					loginValidatorMessage = 'Passwords do not match';
					displayLoginValidator = true;
					return;
				}
				await authHandlers.signup(email, password, `${firstName} ${lastName}`.trim());
			} else {
				await authHandlers.login(email, password);
			}
			window.location.href = '/home';
		} catch (err) {
			loginValidatorMessage = err instanceof Error ? err.message : 'Authentication failed';
			displayLoginValidator = true;
		}
	}

	async function handleGoogleLogin() {
		try {
			await authHandlers.loginWithGoogle();
			window.location.href = '/home';
		} catch (err) {
			loginValidatorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
			displayLoginValidator = true;
		}
	}

	async function handleForgotPassword() {
		try {
			await authHandlers.resetPassword(email);
			displayLoginValidator = true;
			isSubmittingForgotPassword = true;
			loginValidatorMessage = 'Password reset email sent, please check your email';
		} catch (err) {
			loginValidatorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
			displayLoginValidator = true;
		}
	}
</script>

<div class="auth-card">
	<h1 class="title">Task Manager SV2</h1>
	{#if register}
		<div class="subtitle">Create a user account</div>
	{:else if forgotPassword}
		<div class="subtitle">Forgot Password</div>
	{:else}
		<div class="subtitle">Sign in to customer account</div>
	{/if}

	{#if displayLoginValidator && !isSubmittingForgotPassword}
		<p class="error">{loginValidatorMessage}</p>
	{:else if isSubmittingForgotPassword}
		<p class="success">{loginValidatorMessage}</p>
	{:else}
		<p class="hint">Enter all the required details</p>
	{/if}

	{#if forgotPassword}
		<form onsubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
			<input placeholder="Email Address" bind:value={email} type="email" />
			<button type="submit">Proceed</button>
		</form>
	{:else if register}
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<input placeholder="Email Address" bind:value={email} type="email" />
			<input placeholder="Password" bind:value={password} type="password" />
			<input placeholder="Confirm Password" bind:value={confirmPassword} type="password" />
			<input placeholder="First Name" bind:value={firstName} type="text" />
			<input placeholder="Last Name" bind:value={lastName} type="text" />
			<button type="submit">Create Account</button>
		</form>
	{:else}
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			<input placeholder="Email Address" bind:value={email} type="email" />
			<input placeholder="Password" bind:value={password} type="password" />
			<button type="submit">Sign In</button>
		</form>
	{/if}

	{#if !forgotPassword}
		<div class="or">OR</div>
		<button class="google" onclick={handleGoogleLogin}>
			<img src={googleLogo} alt="google" />
			<span>{register ? 'Register with Google' : 'Sign in with Google'}</span>
		</button>
	{/if}

	<div class="toggle">
		{#if forgotPassword}
			<button class="secondary" onclick={() => { forgotPassword = false; register = false; }}>Log In</button>
		{:else if register}
			<button class="secondary" onclick={() => (register = false)}>Already have an account? Log In</button>
		{:else}
			<button class="secondary" onclick={() => (register = true)}>Don't have an account? Register</button>
			<button class="secondary" onclick={() => (forgotPassword = true)}>Forgot Password?</button>
		{/if}
	</div>
</div>

<style>
	.auth-card {
		background: var(--palette-lightgray);
		border-radius: 0.75rem;
		padding: 1.5rem 2rem 1.75rem;
		width: 100%;
		max-width: 350px;
		display: grid;
		gap: 0.8rem;
		color: var(--palette-dark);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
	}
	.title { margin: 0; text-align: center; font-size: 1.35rem; font-weight: 800; }
	.subtitle { text-align: center; font-weight: 600; font-size: 1.15rem; }
	.hint { font-size: 0.85rem; text-align: center; color: var(--palette-gray); margin: 0; }
	.error { font-size: 0.85rem; text-align: center; color: #b91c1c; margin: 0; }
	.success { font-size: 0.85rem; text-align: center; color: #15803d; margin: 0; }
	form { display: grid; gap: 0.55rem; }
	input {
		background: #fff;
		color: var(--text-on-light);
		border: 1px solid var(--palette-gray);
		border-radius: 0.35rem;
	}
	button { width: 100%; border-radius: 0.75rem; }
	.or { text-align: center; font-size: 0.8rem; font-weight: 700; color: #64748b; }
	.google {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		background: #fff;
		color: #0f172a;
		border: 1px solid #94a3b8;
	}
	.google img { width: 22px; height: 22px; }
	.toggle { display: grid; gap: 0.45rem; }
</style>
