<script lang="ts">
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { userStore, userHandlers } from '$lib/stores/userStore';
	import { todoStore, todoHandlers } from '$lib/stores/todoStore';
	import { categoryStore, categoryHandlers } from '$lib/stores/categoryStore';
	import NavMenu from '$lib/components/NavMenu.svelte';
	import {
		dateInputStringToTimestamp,
		dueValueToLocalDayStart,
		formatTimestampDate,
		timestampToDateInputValue
	} from '$lib/firebase/timestampFields.js';
	import { accentAtIndex, PALETTE } from '$lib/theme/palette.js';
	import MagnifyingGlassIcon from '$lib/icons/MagnifyingGlassIcon.svelte';
	import BellIcon from '$lib/icons/BellIcon.svelte';
	import BellNoticeIcon from '$lib/icons/BellNoticeIcon.svelte';
	import AlarmIcon from '$lib/icons/AlarmIcon.svelte';
	import CirclePlus from '$lib/icons/CirclePlus.svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import EllipsisIcon from '$lib/icons/EllipsisIcon.svelte';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';

	let selectedCategory = $state('All');
	let title = $state('');
	let description = $state('');
	let due_date = $state('');
	let category = $state('All');
	let showSearch = $state(false);
	let showNotifications = $state(false);
	let searchQuery = $state('');
	/** Default to "all" so the list matches category counts; narrow with Today / Week / Month. */
	let selectedTimeScope = $state('all');

	let showNewTodoModal = $state(false);
	let showUpdateTodoModal = $state(false);
	let editId = $state('');
	let editCategory = $state('All');
	let editTitle = $state('');
	let editDescription = $state('');
	let editDueDate = $state('');

	let loadingData = $state(true);

	const loadPage = async () => {
		const uid = $authStore.currentUser?.uid;
		if (!uid) {
			goto('/');
			return;
		}
		loadingData = true;
		const user = (await userHandlers.getUser(uid)) ?? $userStore.currentUser;
		const todoIds = user?.todos ?? [];
		const categoryIds = user?.categories?.filter((id: string) => id !== 'All') ?? [];
		await Promise.all([todoHandlers.getTodos(uid, todoIds), categoryHandlers.getCategories(categoryIds)]);
		loadingData = false;
	};

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			if (state.currentUser) {
				loadPage();
			}
		});
		return unsubscribe;
	});

	const createTodo = async () => {
		const uid = $authStore.currentUser?.uid;
		if (!uid || !title.trim()) return;
		const id = await todoHandlers.createTodo(uid, { title, description, due_date, category });
		if (id) {
			await loadPage();
			title = '';
			description = '';
			due_date = '';
			category = 'All';
			showNewTodoModal = false;
		}
	};

	function openNewTodoModal() {
		showNewTodoModal = true;
		showSearch = false;
		showNotifications = false;
		title = '';
		description = '';
		due_date = '';
		category = selectedCategory === 'All' ? 'All' : selectedCategory;
	}

	function closeNewTodoModal() {
		showNewTodoModal = false;
	}

	function isInSelectedScope(todo: { due_date?: unknown }) {
		if (selectedTimeScope === 'all') return true;
		const dueStart = dueValueToLocalDayStart(todo?.due_date);
		if (!dueStart) return false;
		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		if (selectedTimeScope === 'today') {
			return dueStart.getTime() === todayStart.getTime();
		}
		if (selectedTimeScope === 'week') {
			const weekEnd = new Date(todayStart);
			weekEnd.setDate(todayStart.getDate() + 7);
			return dueStart >= todayStart && dueStart < weekEnd;
		}
		if (selectedTimeScope === 'month') {
			return dueStart.getFullYear() === now.getFullYear() && dueStart.getMonth() === now.getMonth();
		}
		return true;
	}

	// Must use $derived.by for a block/callback — $derived(() => {}) compiles to a derived whose value is a function, not the array.
	const filteredTodos = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		const byCategory =
			selectedCategory === 'All' ? $todoStore.todos : $todoStore.todos.filter((todo) => todo.category === selectedCategory);
		const byScope = byCategory.filter((t) => isInSelectedScope(t));
		if (!q) return byScope;
		return byScope.filter((t) => {
			const tTitle = (t.title ?? '').toLowerCase();
			const tDesc = (t.description ?? '').toLowerCase();
			return tTitle.includes(q) || tDesc.includes(q);
		});
	});

	const stats = $derived({
		total: $todoStore.todos.length,
		completed: $todoStore.todos.filter((t) => t.completion).length,
		open: $todoStore.todos.filter((t) => !t.completion).length
	});

	const firstName = $derived(
		$authStore.currentUser?.displayName?.split(' ')?.[0] ?? 'there'
	);

	function countTodosFor(catTitle: string) {
		if (catTitle === 'All') return $todoStore.todos.length;
		return $todoStore.todos.filter((t) => t.category === catTitle).length;
	}

	function accentForCategoryTitle(catTitle: string) {
		if (catTitle === 'All') return PALETTE.blueglow;
		const idx = $categoryStore.categories.findIndex((c) => c.title === catTitle);
		return accentAtIndex(idx >= 0 ? idx : 0);
	}

	/** Matches category chip colors; All / missing / unknown → same as the All chip (blueglow). */
	function accentForTodo(todo: { category?: string }) {
		const raw = (todo.category ?? '').trim();
		if (!raw || raw === 'All') return PALETTE.blueglow;
		const idx = $categoryStore.categories.findIndex((c) => c.title === raw);
		if (idx >= 0) return accentAtIndex(idx);
		return PALETTE.blueglow;
	}

	function checkDateStatus(dueValue: unknown) {
		const dueDay = dueValueToLocalDayStart(dueValue);
		if (!dueDay) return 'NA';
		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		if (dueDay < todayStart) return 'Past Due:';
		const tomorrowStart = new Date(todayStart);
		tomorrowStart.setDate(tomorrowStart.getDate() + 1);
		if (dueDay.getTime() === todayStart.getTime() || dueDay.getTime() === tomorrowStart.getTime()) {
			return 'Upcoming:';
		}
		return 'NA';
	}

	const notifications = $derived.by(() => {
		return $todoStore.todos
			.filter((t) => t.due_date != null && t.due_date !== 'null' && !t.completion)
			.map((t) => ({ ...t, condition: checkDateStatus(t.due_date) }))
			.filter((t) => t.condition !== 'NA' && t.condition !== undefined);
	});

	function openUpdateTodoModal(todo: any) {
		showNewTodoModal = false;
		showUpdateTodoModal = true;
		showSearch = false;
		showNotifications = false;
		editId = todo?.id ?? '';
		editCategory = todo?.category ?? 'All';
		editTitle = todo?.title ?? '';
		editDescription = todo?.description ?? '';
		editDueDate = timestampToDateInputValue(todo?.due_date);
	}

	async function saveTodoEdits() {
		if (!editId) return;
		const nextDue = editDueDate ? dateInputStringToTimestamp(editDueDate) : null;
		await todoHandlers.updateTodo(editId, {
			title: editTitle,
			description: editDescription,
			category: editCategory,
			due_date: nextDue
		});
		showUpdateTodoModal = false;
		await loadPage();
	}

	function closeUpdateModal() {
		showUpdateTodoModal = false;
	}

	function clearSearch() {
		searchQuery = '';
		showSearch = false;
	}
</script>

<svelte:head>
	<title>Lee's Todo App</title>
</svelte:head>

{#if !$authStore.currentUser}
	<div class="card">You need to sign in first.</div>
{:else}
	<div class="home-shell">
		<div class="top-row" role="region" onmouseleave={() => { showSearch = false; showNotifications = false; }}>
			<NavMenu />

			<div class="top-actions">
				<button
					type="button"
					class="icon-btn"
					onclick={() => {
						showSearch = !showSearch;
						showNotifications = false;
					}}
					aria-label="Search todos"
				>
					<MagnifyingGlassIcon Class="home-action-icon" />
				</button>

				<button
					type="button"
					class="icon-btn"
					onclick={() => {
						showNotifications = !showNotifications;
						showSearch = false;
					}}
					aria-label="Notifications"
				>
					{#if notifications.length > 0}
						<BellNoticeIcon Class="home-action-icon home-bell-notice" />
					{:else}
						<BellIcon Class="home-action-icon" />
					{/if}
				</button>

				{#if showSearch || searchQuery.trim()}
					<div class="dropdown search-dropdown" role="dialog" aria-label="Search">
						<div class="search-row">
							<input
								class="search-input"
								bind:value={searchQuery}
								placeholder="Search title or description..."
								type="text"
								autocomplete="off"
							/>
							{#if searchQuery.trim()}
								<button
									type="button"
									class="search-clear"
									onclick={clearSearch}
									aria-label="Clear search"
								>
									<CloseIcon Class="search-clear-icon" />
								</button>
							{/if}
						</div>
						<div class="search-meta">
							{filteredTodos.length} result{filteredTodos.length === 1 ? '' : 's'}
						</div>
					</div>
				{/if}

				{#if showNotifications}
					<div class="dropdown notif-dropdown" role="dialog" aria-label="Notifications">
						<div class="dropdown-title">Notifications</div>
						<hr class="divider" />
						{#if notifications.length === 0}
							<div class="dropdown-muted">No upcoming or past-due tasks.</div>
						{:else}
							<div class="notif-list">
								{#each notifications as n (n.id)}
									<div class="notif-item">
										<span
											class="notif-dot"
											class:past={n.condition === 'Past Due:'}
											class:upcoming={n.condition === 'Upcoming:'}
										></span>
										<div class="notif-text">
											<div class="notif-condition">{n.condition}</div>
											<div class="notif-title">{n.title}</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<h1 class="greeting">What&apos;s up, {firstName}!</h1>

		<p class="section-label">CATEGORIES</p>
		<div class="category-scroll">
			<div class="category-scroll-inner">
				<button
					type="button"
					class="cat-card"
					class:selected={selectedCategory === 'All'}
					onclick={() => (selectedCategory = 'All')}
					style={`--accent:${PALETTE.blueglow}; --accent-glow:${PALETTE.blueglow}55`}
				>
					<div class="cat-meta">{countTodosFor('All')} tasks</div>
					<div class="cat-title">All</div>
					<div class="cat-bar"></div>
				</button>
				{#each $categoryStore.categories as c, index}
					<button
						type="button"
						class="cat-card"
						class:selected={selectedCategory === c.title}
						onclick={() => (selectedCategory = c.title)}
						style={`--accent:${accentAtIndex(index)}; --accent-glow:${accentAtIndex(index)}55`}
					>
						<div class="cat-meta">{countTodosFor(c.title)} tasks</div>
						<div class="cat-title">{c.title}</div>
						<div class="cat-bar"></div>
					</button>
				{/each}
			</div>
		</div>

		<p class="section-label">TASKS</p>
		<div class="scope-tabs" role="tablist" aria-label="Task time filters">
			<button
				type="button"
				class="scope-tab"
				class:active={selectedTimeScope === 'all'}
				onclick={() => (selectedTimeScope = 'all')}
			>
				All
			</button>
			<button
				type="button"
				class="scope-tab"
				class:active={selectedTimeScope === 'today'}
				onclick={() => (selectedTimeScope = 'today')}
			>
				Today&apos;s
			</button>
			<button
				type="button"
				class="scope-tab"
				class:active={selectedTimeScope === 'week'}
				onclick={() => (selectedTimeScope = 'week')}
			>
				This Week
			</button>
			<button
				type="button"
				class="scope-tab"
				class:active={selectedTimeScope === 'month'}
				onclick={() => (selectedTimeScope = 'month')}
			>
				This Month
			</button>
		</div>
		{#if selectedTimeScope !== 'all'}
			<p class="scope-hint">
				Showing tasks with a due date in this range. Tasks with no due date only appear when
				<strong>All</strong> is selected above.
			</p>
		{/if}
		{#if loadingData}
			<p class="muted">Loading...</p>
		{:else if filteredTodos.length === 0}
			<p class="muted">
				{#if $todoStore.todos.length > 0}
					No tasks match this category, time range, or search. Tasks without a due date only show when
					time is set to <strong>All</strong>.
				{:else}
					No tasks yet — tap the + button in the corner to add one.
				{/if}
			</p>
		{:else}
			<ul class="task-list">
				{#each filteredTodos as todo}
					<li
						class="task-row"
						style={`--accent:${accentForTodo(todo)}; --accent-shadow:${accentForTodo(todo)}44`}
					>
						<label class="task-main">
							<input
								type="checkbox"
								checked={todo.completion}
								onchange={(e) =>
									todoHandlers.updateTodoCompletion(
										todo.id,
										(e.currentTarget as HTMLInputElement).checked
									)}
							/>
							<span class="task-title" class:done={todo.completion}>{todo.title}</span>
						</label>
						{#if todo.due_date}
							<div class="due">
								<AlarmIcon Class="due-alarm-icon" />
								<span>Due: {formatTimestampDate(todo.due_date)}</span>
							</div>
						{/if}
						<button type="button" class="btn-edit" onclick={() => openUpdateTodoModal(todo)} aria-label="Edit todo">
							<EllipsisIcon Class="task-ellipsis-icon" />
						</button>
						<button
							type="button"
							class="btn-delete"
							onclick={() => todoHandlers.deleteTodo($authStore.currentUser.uid, todo.id)}
							aria-label="Delete todo"
						>
							<DeleteIcon Class="task-delete-icon" />
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="fab-wrap">
			<button type="button" class="fab" onclick={openNewTodoModal} aria-label="Add new task">
				<CirclePlus Class="fab-circle-plus" />
			</button>
		</div>

		{#if showNewTodoModal}
			<div
				class="modal-overlay"
				role="presentation"
				tabindex="-1"
				onclick={(e) => {
					if (e.target === e.currentTarget) closeNewTodoModal();
				}}
				onkeydown={(e) => {
					if ((e as KeyboardEvent).key === 'Escape') closeNewTodoModal();
				}}
			>
				<div
					class="modal-card"
					role="dialog"
					aria-modal="true"
					aria-labelledby="new-todo-title"
					tabindex="-1"
				>
					<div class="modal-title" id="new-todo-title">New task</div>
					<form
						class="modal-form"
						onsubmit={(e) => {
							e.preventDefault();
							createTodo();
						}}
					>
						<div class="field">
							<div class="field-label">Category</div>
							<select bind:value={category}>
								<option value="All">All</option>
								{#each $categoryStore.categories as c}
									<option value={c.title}>{c.title}</option>
								{/each}
							</select>
						</div>
						<div class="field">
							<div class="field-label">Title</div>
							<input type="text" bind:value={title} placeholder="Title" required />
						</div>
						<div class="field">
							<div class="field-label">Description</div>
							<textarea bind:value={description} rows="3" placeholder="Description (optional)"></textarea>
						</div>
						<div class="field">
							<div class="field-label">Due date</div>
							<input type="date" bind:value={due_date} />
						</div>
						<div class="modal-actions">
							<button
								type="submit"
								class="btn-modal-primary"
								style={`--add:${accentForCategoryTitle(selectedCategory)}`}
							>Create</button>
							<button type="button" class="secondary" onclick={closeNewTodoModal}>Cancel</button>
						</div>
					</form>
				</div>
			</div>
		{/if}

		{#if showUpdateTodoModal}
			<div
				class="modal-overlay"
				role="presentation"
				tabindex="-1"
				onclick={(e) => {
					if (e.target === e.currentTarget) closeUpdateModal();
				}}
				onkeydown={(e) => {
					if ((e as KeyboardEvent).key === 'Escape') closeUpdateModal();
				}}
			>
				<div class="modal-card" role="dialog" aria-modal="true" tabindex="-1">
					<div class="modal-title">Update your Todo</div>
					<form class="modal-form" onsubmit={(e) => { e.preventDefault(); saveTodoEdits(); }}>
						<div class="field">
							<div class="field-label">Category</div>
							<select bind:value={editCategory}>
								<option value="All">All</option>
								{#each $categoryStore.categories as c}
									<option value={c.title}>{c.title}</option>
								{/each}
							</select>
						</div>

						<div class="field">
							<div class="field-label">Title</div>
							<input type="text" bind:value={editTitle} placeholder="Title" required />
						</div>

						<div class="field">
							<div class="field-label">Description</div>
							<textarea bind:value={editDescription} rows="3" placeholder="Description (optional)"></textarea>
						</div>

						<div class="field">
							<div class="field-label">Due Date</div>
							<input type="date" bind:value={editDueDate} />
						</div>

						<div class="modal-actions">
							<button type="submit">Update</button>
							<button type="button" class="secondary" onclick={closeUpdateModal}>Cancel</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.home-shell {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-height: 100%;
		padding-bottom: 4.5rem;
	}
	.top-row {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
	}
	.top-actions {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}
	.icon-btn {
		width: 2.15rem;
		height: 2.15rem;
		display: grid;
		place-items: center;
		border-radius: 0.75rem;
		border: 1px solid rgba(151, 180, 255, 0.45);
		background: rgba(151, 180, 255, 0.08);
		color: var(--palette-lightgray);
		cursor: pointer;
		padding: 0;
	}
	.icon-btn:hover {
		background: rgba(151, 180, 255, 0.18);
	}
	.icon-btn :global(.home-action-icon) {
		width: 1.25rem;
		height: 1.25rem;
		fill: currentColor;
	}
	.icon-btn :global(.home-bell-notice) {
		fill: #fbbf24;
	}

	.greeting {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 600;
		color: #fff;
	}
	.section-label {
		margin: 0.5rem 0 0 0;
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		color: var(--palette-lightgray);
		opacity: 0.9;
	}
	.category-scroll {
		overflow-x: auto;
		padding-bottom: 0.5rem;
		margin: 0 -0.25rem;
	}
	.category-scroll-inner {
		display: flex;
		gap: 0.75rem;
		padding: 0.25rem;
	}
	.scope-tabs {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
		margin: -0.1rem 0 0.35rem;
	}
	.scope-tab {
		border-radius: 999px;
		padding: 0.33rem 0.65rem;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--palette-lightgray);
		background: rgba(151, 180, 255, 0.12);
		border: 1px solid rgba(151, 180, 255, 0.2);
	}
	.scope-tab:hover {
		background: rgba(151, 180, 255, 0.22);
		transform: none;
	}
	.scope-tab.active {
		color: #fff;
		background: var(--palette-dark);
		border-color: var(--palette-blueglow);
		box-shadow: 0 0 16px rgba(29, 104, 223, 0.4);
	}
	.scope-hint {
		margin: 0 0 0.35rem;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--palette-lightgray);
		opacity: 0.92;
	}
	.scope-hint strong {
		font-weight: 800;
	}
	.fab-wrap {
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 15;
		pointer-events: none;
	}
	.fab {
		pointer-events: auto;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 999px;
		border: none;
		background: var(--palette-pinkglow);
		cursor: pointer;
		padding: 0;
		display: grid;
		place-items: center;
		box-shadow:
			0 4px 18px rgba(235, 6, 255, 0.55),
			0 8px 36px rgba(235, 6, 255, 0.4),
			0 2px 8px rgba(0, 0, 0, 0.35);
		transition:
			transform 0.15s ease,
			filter 0.15s ease,
			box-shadow 0.15s ease;
	}
	.fab:hover {
		transform: scale(1.06);
		filter: brightness(1.08);
		box-shadow:
			0 6px 22px rgba(235, 6, 255, 0.65),
			0 12px 40px rgba(235, 6, 255, 0.5),
			0 2px 10px rgba(0, 0, 0, 0.4);
	}
	.fab :global(.fab-circle-plus) {
		width: 2.25rem;
		height: 2.25rem;
		fill: #fff;
	}
	.btn-modal-primary {
		background: var(--palette-dark);
		color: #fff;
		border: 2px solid var(--add);
		box-shadow: 0 0 20px var(--add);
	}
	.btn-modal-primary:hover {
		background: var(--add);
		color: var(--palette-dark);
	}
	.cat-card {
		flex: 0 0 auto;
		min-width: 200px;
		min-height: 120px;
		transform: none;
		text-align: left;
		padding: 1rem 1.25rem;
		border-radius: 1.25rem;
		background: var(--palette-dark);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
		cursor: pointer;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.cat-card:hover {
		transform: none;
		filter: brightness(1.06);
	}
	.cat-card.selected {
		box-shadow: 0 0 0 2px var(--accent), 0 0 24px var(--accent-glow);
	}
	.cat-meta {
		font-size: 0.8rem;
		color: var(--palette-lightgray);
	}
	.cat-title {
		font-size: 1.35rem;
		font-weight: 700;
	}
	.cat-bar {
		height: 3px;
		border-radius: 999px;
		background: var(--accent);
		box-shadow: 0 0 12px var(--accent);
		margin-top: 0.5rem;
	}
	.muted {
		color: var(--palette-lightgray);
		font-size: 0.85rem;
	}
	.task-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 360px;
		overflow-y: auto;
	}
	.task-row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-template-rows: auto auto;
		align-items: center;
		gap: 0.25rem 0.5rem;
		background: var(--palette-dark);
		border-radius: 1.25rem;
		padding: 0.65rem 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
		border-left: 4px solid var(--accent);
		box-shadow:
			0 4px 14px rgba(0, 0, 0, 0.4),
			0 0 20px var(--accent-shadow);
	}
	.task-main {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		grid-column: 1 / 2;
		grid-row: 1 / 2;
	}
	/* Circular checkbox: empty ring (category accent); checked = light blue + white tick (UI spec) */
	.task-main input[type='checkbox'] {
		appearance: none;
		-webkit-appearance: none;
		margin: 0;
		padding: 0;
		width: 1.28rem;
		height: 1.28rem;
		min-width: 1.28rem;
		min-height: 1.28rem;
		border-radius: 50%;
		border: 2px solid var(--accent);
		background: transparent;
		color: inherit;
		flex-shrink: 0;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}
	.task-main input[type='checkbox']:hover:not(:disabled) {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
	}
	.task-main input[type='checkbox']:checked {
		background-color: var(--adamas-blue);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' d='M3.8 8.2l2.9 2.9 5.5-6.4'/%3E%3C/svg%3E");
		background-size: 72%;
		background-repeat: no-repeat;
		background-position: center;
		border-color: var(--adamas-blue);
		box-shadow: 0 0 12px rgba(188, 206, 255, 0.55);
	}
	.task-main input[type='checkbox']:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.task-title {
		color: #fff;
		font-weight: 500;
	}
	.task-title.done {
		text-decoration: line-through;
		opacity: 0.55;
	}
	.due {
		grid-column: 1 / 2;
		grid-row: 2 / 3;
		font-size: 0.75rem;
		color: var(--palette-lightgray);
		opacity: 0.85;
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.due :global(.due-alarm-icon) {
		width: 0.95rem;
		height: 0.95rem;
		flex-shrink: 0;
		fill: #fb923c;
	}
	.btn-edit {
		grid-column: 2 / 3;
		grid-row: 1 / 3;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
		padding: 0;
		display: grid;
		place-items: center;
	}
	.btn-edit :global(.task-ellipsis-icon) {
		width: 1.05rem;
		height: 1.05rem;
		fill: currentColor;
	}
	.btn-edit:hover {
		background: rgba(255, 255, 255, 0.11);
	}
	.btn-delete {
		grid-column: 3 / 4;
		grid-row: 1 / 3;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border-radius: 999px;
		background: transparent;
		color: #f87171;
		display: grid;
		place-items: center;
	}
	.btn-delete :global(.task-delete-icon) {
		width: 0.95rem;
		height: 0.95rem;
		fill: #f87171;
	}
	.btn-delete:hover {
		background: rgba(248, 113, 113, 0.15);
		transform: none;
	}

	.dropdown {
		position: absolute;
		top: 2.5rem;
		right: 0;
		background: var(--palette-lightgray);
		border: 1px solid var(--palette-gray);
		border-radius: 0.75rem;
		color: var(--palette-dark);
		padding: 0.65rem;
		min-width: 255px;
		z-index: 30;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
	}
	.search-dropdown {
		top: 2.5rem;
	}
	.search-row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.search-row .search-input {
		flex: 1;
		min-width: 0;
	}
	.search-clear {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: none;
		border-radius: 0.5rem;
		background: rgba(70, 89, 140, 0.15);
		color: var(--palette-dark);
		cursor: pointer;
	}
	.search-clear:hover {
		background: rgba(70, 89, 140, 0.28);
	}
	.search-clear :global(.search-clear-icon) {
		width: 1.1rem;
		height: 1.1rem;
		fill: currentColor;
	}
	.dropdown-title {
		font-weight: 800;
		text-align: center;
		margin-bottom: 0.4rem;
	}
	.divider {
		border: 0;
		border-top: 1px solid rgba(70, 89, 140, 0.5);
		margin: 0.4rem 0 0.6rem;
	}
	.search-input {
		width: 100%;
		border: 1px solid rgba(70, 89, 140, 0.35);
		background: rgba(255, 255, 255, 0.9);
		border-radius: 0.6rem;
		padding: 0.5rem 0.65rem;
	}
	.search-meta {
		margin-top: 0.35rem;
		font-size: 0.78rem;
		text-align: center;
		opacity: 0.9;
	}
	.dropdown-muted {
		color: rgba(70, 89, 140, 0.9);
		font-size: 0.85rem;
	}
	.notif-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.notif-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.4rem;
		border-radius: 0.6rem;
		background: rgba(255, 255, 255, 0.2);
	}
	.notif-dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		background: var(--palette-checked);
		flex: 0 0 auto;
	}
	.notif-dot.past {
		background: #ef4444;
		box-shadow: 0 0 14px rgba(239, 68, 68, 0.5);
	}
	.notif-dot.upcoming {
		background: #f59e0b;
		box-shadow: 0 0 14px rgba(245, 158, 11, 0.45);
	}
	.notif-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.notif-condition {
		font-weight: 800;
		font-size: 0.72rem;
		line-height: 1.2;
	}
	.notif-title {
		font-size: 0.9rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 170px;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		display: grid;
		place-items: center;
		z-index: 50;
	}
	.modal-card {
		width: 100%;
		max-width: 380px;
		background: var(--palette-medium);
		color: #fff;
		border-radius: 1.1rem;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 22px 50px rgba(0, 0, 0, 0.5);
	}
	.modal-title {
		font-weight: 900;
		font-size: 1.05rem;
		margin-bottom: 0.75rem;
	}
	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.field-label {
		font-weight: 800;
		font-size: 0.85rem;
		opacity: 0.95;
	}
	select,
	input,
	textarea {
		background: rgba(255, 255, 255, 0.95);
		color: var(--text-on-light);
		border: 1px solid rgba(70, 89, 140, 0.35);
		border-radius: 0.6rem;
		padding: 0.55rem 0.65rem;
	}
	textarea {
		resize: vertical;
	}
	.modal-actions {
		display: flex;
		gap: 0.6rem;
		margin-top: 0.35rem;
	}
</style>
