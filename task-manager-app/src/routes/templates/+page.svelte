<script lang="ts">
	// @ts-nocheck
	import NavMenu from '$lib/components/NavMenu.svelte';
	import BookmarksIcon from '$lib/icons/BooksmarksIcon.svelte';
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte';
</script>

<svelte:head>
	<title>Templates — SV2</title>
</svelte:head>

<div class="page">
	<div class="menu-wrap"><NavMenu /></div>
	<div class="hero">
		<BookmarksIcon Class="page-icon" />
		<h1 class="page-title">Templates</h1>
	</div>
	<p class="lead">
		Task templates are not available yet. This screen mirrors the original app’s profile link so we can add
		saved layouts and quick-add presets later.
	</p>
	<a class="back-home" href="/home">
		<ChevronWithLeftCircle Class="back-ic" />
		<span>Back to home</span>
	</a>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 100%;
	}
	.menu-wrap {
		position: relative;
	}
	.hero {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.page-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: 0.05em;
	}
	:global(.page-icon) {
		width: 2rem;
		height: 2rem;
		fill: var(--palette-lightgray);
	}
	.lead {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--palette-lightgray);
		text-align: center;
	}
	.back-home {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		justify-content: center;
		margin: 0 auto;
		text-decoration: none;
		color: var(--palette-lightgray);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.back-home:hover {
		color: #fff;
	}
	.back-home:hover :global(.back-ic) {
		fill: #fff;
	}
	:global(.back-ic) {
		width: 1.35rem;
		height: 1.35rem;
		fill: var(--palette-lightgray);
	}
</style>
