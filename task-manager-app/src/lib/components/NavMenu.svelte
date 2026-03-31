<script>
	import { authHandlers } from '$lib/stores/authStore';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';
	import HouseIcon from '$lib/icons/HouseIcon.svelte';
	import ProfileIcon from '$lib/icons/ProfileIcon.svelte';
	import Categories from '$lib/icons/Categories.svelte';

	let open = $state(false);

	const logout = async () => {
		await authHandlers.logout();
		window.location.href = '/';
	};
</script>

<div class="nav-root">
	<button type="button" class="menu-trigger" onclick={() => (open = !open)} aria-label="Open menu">
		<MenuIcon Class="nav-menu-burger" />
	</button>

	{#if open}
		<div class="menu card">
			<a href="/home" class="nav-row" onclick={() => (open = false)}>
				<HouseIcon Class="nav-row-icon" />
				<span>Home</span>
			</a>
			<a href="/profile" class="nav-row" onclick={() => (open = false)}>
				<ProfileIcon Class="nav-row-icon" />
				<span>Profile</span>
			</a>
			<a href="/categories" class="nav-row" onclick={() => (open = false)}>
				<Categories Class="nav-row-icon nav-row-icon-cat" />
				<span>Categories</span>
			</a>
			<button type="button" class="nav-row nav-logout" onclick={logout}>
				<svg
					class="nav-logout-svg"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						fill="none"
						stroke="currentColor"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
				<span>Logout</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.nav-root {
		position: relative;
	}
	.menu-trigger {
		display: grid;
		place-items: center;
		padding: 0.15rem;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--palette-lightgray);
	}
	.menu-trigger:hover {
		opacity: 0.85;
	}
	:global(.nav-menu-burger) {
		width: 2rem;
		height: 2rem;
		fill: currentColor;
	}
	.menu {
		position: absolute;
		z-index: 20;
		display: grid;
		gap: 0.35rem;
		margin-top: 0.5rem;
		min-width: 200px;
		background: var(--palette-lightgray);
		border: 1px solid var(--palette-gray);
		border-radius: 0 1rem 1rem 0;
		padding: 0.5rem;
	}
	.nav-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		padding: 0.45rem 0.5rem;
		border-radius: 0.75rem;
		font-weight: 600;
		color: var(--palette-dark);
		text-decoration: none;
		border: none;
		background: transparent;
		width: 100%;
		text-align: left;
		font: inherit;
		cursor: pointer;
	}
	.nav-row:hover {
		background: var(--palette-medium);
		color: #fff;
	}
	.nav-row:hover :global(.nav-row-icon) {
		fill: #fff;
	}
	.nav-row:hover :global(.nav-row-icon-cat) {
		fill: #fff;
	}
	.nav-row:hover .nav-logout-svg {
		color: #fff;
	}
	:global(.nav-row-icon) {
		width: 1.65rem;
		height: 1.65rem;
		flex-shrink: 0;
		fill: var(--palette-dark);
	}
	:global(.nav-row-icon-cat) {
		width: 1.45rem;
		height: 1.45rem;
	}
	.nav-logout-svg {
		width: 1.45rem;
		height: 1.45rem;
		flex-shrink: 0;
		color: var(--palette-dark);
	}
</style>
