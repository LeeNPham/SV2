<script lang="ts">
	// @ts-nocheck
	import NavMenu from '$lib/components/NavMenu.svelte';
	import PieChart from '$lib/icons/PieChart.svelte';
	import CheckCircle from '$lib/icons/CheckCircle.svelte';
	import CircleIcon from '$lib/icons/CircleIcon.svelte';
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte';
	import { todoStore } from '$lib/stores/todoStore';

	const stats = $derived({
		total: $todoStore.todos.length,
		done: $todoStore.todos.filter((t) => t.completion).length,
		open: $todoStore.todos.filter((t) => !t.completion).length
	});
</script>

<svelte:head>
	<title>Analytics — SV2</title>
</svelte:head>

<div class="page">
	<div class="menu-wrap"><NavMenu /></div>
	<div class="hero">
		<PieChart Class="page-icon" />
		<h1 class="page-title">Analytics</h1>
	</div>
	<p class="lead">
		Full charts and trends are not wired up yet. Here is a quick snapshot from your current tasks.
	</p>
	<ul class="stats">
		<li>
			<span class="label stat-with-ic"><CircleIcon Class="stat-dot-ic" /> Total</span>
			<span class="val">{stats.total}</span>
		</li>
		<li>
			<span class="label stat-with-ic"><CircleIcon Class="stat-open-ic" /> Open</span>
			<span class="val">{stats.open}</span>
		</li>
		<li>
			<span class="label stat-with-ic"><CheckCircle Class="stat-check-ic" /> Completed</span>
			<span class="val">{stats.done}</span>
		</li>
	</ul>
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
	.stats {
		list-style: none;
		padding: 0.75rem 1rem;
		margin: 0;
		display: grid;
		gap: 0.5rem;
		background: var(--palette-dark);
		border-radius: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}
	.stats li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.95rem;
		color: #e2e8f0;
	}
	.label {
		color: var(--palette-lightgray);
	}
	.stat-with-ic {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	:global(.stat-dot-ic) {
		width: 0.85rem;
		height: 0.85rem;
		fill: var(--palette-lightgray);
		opacity: 0.85;
	}
	:global(.stat-open-ic) {
		width: 0.85rem;
		height: 0.85rem;
		fill: #93c5fd;
		opacity: 0.95;
	}
	:global(.stat-check-ic) {
		width: 0.95rem;
		height: 0.95rem;
		fill: #86efac;
	}
	.val {
		font-weight: 800;
		color: #fff;
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
