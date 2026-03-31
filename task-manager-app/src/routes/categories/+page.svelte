<script lang="ts">
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { userHandlers } from '$lib/stores/userStore';
	import { categoryStore, categoryHandlers } from '$lib/stores/categoryStore';
	import NavMenu from '$lib/components/NavMenu.svelte';
	import CategoriesIcon from '$lib/icons/Categories.svelte';
	import DeleteCategoryIcon from '$lib/icons/DeleteCategoryIcon.svelte';
	import { accentAtIndex } from '$lib/theme/palette.js';

	let title = $state('');
	let description = $state('');
	let editingId = $state('');
	let editingTitle = $state('');
	let editingDescription = $state('');

	const loadCategories = async () => {
		const uid = $authStore.currentUser?.uid;
		if (!uid) {
			goto('/');
			return;
		}
		const user = await userHandlers.getUser(uid);
		const categoryIds = user?.categories?.filter((id: string) => id !== 'All') ?? [];
		await categoryHandlers.getCategories(categoryIds);
	};

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			if (state.currentUser) {
				loadCategories();
			}
		});
		return unsubscribe;
	});

	const createCategory = async () => {
		if (!$authStore.currentUser?.uid || !title.trim()) return;
		await categoryHandlers.createCategory($authStore.currentUser.uid, { title, description });
		title = '';
		description = '';
		await loadCategories();
	};

	const startEdit = (category: any) => {
		editingId = category.id;
		editingTitle = category.title;
		editingDescription = category.description ?? '';
	};

	const saveEdit = async () => {
		if (!editingId) return;
		await categoryHandlers.updateCategory(editingId, {
			title: editingTitle,
			description: editingDescription
		});
		editingId = '';
		await loadCategories();
	};
</script>

<svelte:head>
	<title>Categories — SV2</title>
</svelte:head>

<div class="page">
	<div class="menu-wrap"><NavMenu /></div>
	<div class="page-heading">
		<CategoriesIcon Class="page-heading-icon" />
		<h1 class="page-title">My Categories</h1>
	</div>
	<div class="create-row">
		<input bind:value={title} placeholder="Category name" />
		<input bind:value={description} placeholder="Description" />
		<button type="button" class="btn-create" onclick={createCategory}>+ Category</button>
	</div>

	<ul class="grid">
		{#each $categoryStore.categories as category, index}
			<li
				class="card-tile"
				style={`--accent:${accentAtIndex(index)}; --accent-soft:${accentAtIndex(index)}44`}
			>
				{#if editingId === category.id}
					<div class="edit-row">
						<input bind:value={editingTitle} />
						<input bind:value={editingDescription} />
						<button type="button" onclick={saveEdit}>Save</button>
						<button type="button" class="secondary" onclick={() => (editingId = '')}>Cancel</button>
					</div>
				{:else}
					<div class="tile-head">
						<span class="dot"></span>
						<strong>{category.title}</strong>
					</div>
					<p class="desc">{category.description}</p>
					<div class="tile-bar"></div>
					<div class="actions">
						<button type="button" class="secondary" onclick={() => startEdit(category)}>Edit</button>
						<button
							type="button"
							class="danger icon-danger"
							onclick={() => categoryHandlers.deleteCategory($authStore.currentUser.uid, category.id)}
							aria-label="Delete category"
						>
							<DeleteCategoryIcon category={category} Class="cat-delete-ic" />
						</button>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
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
	.page-heading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	:global(.page-heading-icon) {
		width: 1.75rem;
		height: 1.75rem;
		fill: var(--palette-lightgray);
	}
	.page-title {
		margin: 0;
		text-align: center;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: 0.05em;
	}
	.create-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}
	.btn-create {
		background: var(--palette-dark);
		color: #fff;
		border: 2px solid var(--palette-lightgray);
	}
	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}
	@media (max-width: 380px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
	.card-tile {
		background: var(--palette-dark);
		border-radius: 0.75rem;
		padding: 0.85rem;
		min-height: 160px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 18px var(--accent-soft);
	}
	.tile-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 1rem;
		color: #fff;
	}
	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--accent);
		box-shadow: 0 0 8px var(--accent);
	}
	.desc {
		margin: 0.35rem 0 0 0;
		font-size: 0.8rem;
		color: var(--palette-lightgray);
		flex: 1;
	}
	.tile-bar {
		height: 2px;
		border-radius: 999px;
		background: var(--accent);
		margin: 0.5rem 0;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.35rem;
		flex-wrap: wrap;
	}
	.icon-danger {
		display: grid;
		place-items: center;
		min-width: 2.25rem;
		min-height: 2.25rem;
		padding: 0.25rem 0.45rem;
	}
	:global(.cat-delete-ic) {
		width: 1.1rem;
		height: 1.1rem;
		fill: currentColor;
	}
	.edit-row {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
</style>
