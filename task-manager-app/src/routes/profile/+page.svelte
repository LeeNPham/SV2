<script lang="ts">
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import NavMenu from '$lib/components/NavMenu.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { userHandlers, userStore } from '$lib/stores/userStore';
	import profileDefault from '$lib/images/profileDefault.jpg';
	import Categories from '$lib/icons/Categories.svelte';
	import BookmarksIcon from '$lib/icons/BooksmarksIcon.svelte';
	import PieChart from '$lib/icons/PieChart.svelte';

	let uploading = $state(false);
	let uploadError = $state('');
	let profileName = $state('');
	let profileDescription = $state('');
	let isSavingProfile = $state(false);
	let profileError = $state('');
	let showEditProfileModal = $state(false);

	const me = $derived($userStore.currentUser);

	function syncProfileForm(profile: { displayName?: string; description?: string } | null | undefined) {
		profileName = profile?.displayName ?? '';
		profileDescription = profile?.description ?? '';
	}

	onMount(() => {
		const unsub = authStore.subscribe(async (state) => {
			if (!state.currentUser) {
				goto('/');
				return;
			}
			const profile = await userHandlers.getUser(state.currentUser.uid);
			syncProfileForm(profile);
		});
		return unsub;
	});

	async function onPhotoSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		const uid = $authStore.currentUser?.uid;
		if (!file || !uid) return;
		uploadError = '';
		uploading = true;
		try {
			await userHandlers.uploadProfileImage(uid, file);
			const profile = await userHandlers.getUser(uid);
			syncProfileForm(profile);
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Upload failed';
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	function openEditProfileModal() {
		syncProfileForm(me);
		profileError = '';
		showEditProfileModal = true;
	}

	function closeEditProfileModal() {
		showEditProfileModal = false;
	}

	async function saveProfile() {
		const uid = $authStore.currentUser?.uid;
		if (!uid) return;
		profileError = '';
		isSavingProfile = true;
		try {
			await userHandlers.updateUser(uid, {
				displayName: profileName.trim(),
				description: profileDescription.trim()
			});
			const profile = await userHandlers.getUser(uid);
			syncProfileForm(profile);
			showEditProfileModal = false;
		} catch (err) {
			profileError = err instanceof Error ? err.message : 'Unable to save profile';
		} finally {
			isSavingProfile = false;
		}
	}
</script>

<svelte:head>
	<title>Profile — SV2</title>
</svelte:head>

<div class="profile-root">
	<div class="menu-wrap"><NavMenu /></div>

	<div class="header-strip">
		<label class="avatar-label" for="profileImageInput" title="Change profile photo">
			{#if me?.profileImage}
				<img class="avatar" src={me.profileImage} alt="" referrerpolicy="no-referrer" />
			{:else}
				<img class="avatar" src={profileDefault} alt="" />
			{/if}
			{#if uploading}
				<span class="upload-badge">…</span>
			{/if}
		</label>
		<input
			type="file"
			accept="image/*"
			class="visually-hidden"
			id="profileImageInput"
			onchange={onPhotoSelected}
		/>
		<div class="header-text">
			<span class="name">{me?.displayName || 'User'}</span>
			<span class="email">{me?.email || ''}</span>
		</div>
	</div>

	{#if uploadError}
		<p class="err">{uploadError}</p>
	{/if}

	<div class="name-block">
		<div>{me?.displayName?.split(' ')?.[0] || ''}</div>
		<div>{me?.displayName?.split(' ')?.[1] || ''}</div>
	</div>

	<div class="grid-links">
		<a class="row link-row" href="/templates">
			<BookmarksIcon Class="row-icon row-icon-bookmark" />
			<span class="label">Templates</span>
		</a>
		<a class="row link-row" href="/categories">
			<Categories Class="row-icon row-icon-cat" />
			<span class="label">Categories</span>
		</a>
		<a class="row link-row" href="/analytics">
			<PieChart Class="row-icon row-icon-chart" />
			<span class="label">Analytics</span>
		</a>

		<button type="button" class="edit-profile-btn" onclick={openEditProfileModal}>Edit profile</button>

		{#if me?.description}
			<p class="bio-readonly">{me.description}</p>
		{:else}
			<p class="bio-placeholder">No description yet. Use Edit profile to add one.</p>
		{/if}
	</div>

	<div class="consistency-card">
		<div class="gradient-bar"></div>
		<div class="sub">Good</div>
		<div class="title">Consistency</div>
	</div>
</div>

{#if showEditProfileModal}
	<div
		class="modal-overlay"
		role="presentation"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeEditProfileModal();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') closeEditProfileModal();
		}}
	>
		<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" tabindex="-1">
			<div class="modal-title" id="edit-profile-title">Edit profile</div>
			<form
				class="modal-form"
				onsubmit={(e) => {
					e.preventDefault();
					saveProfile();
				}}
			>
				<label class="field">
					<span class="field-label">Display Name</span>
					<input bind:value={profileName} type="text" placeholder="Display name" maxlength="80" />
				</label>

				<label class="field">
					<span class="field-label">Profile Description</span>
					<textarea
						class="desc"
						rows="4"
						bind:value={profileDescription}
						placeholder="Write a short profile description"
						maxlength="400"
					></textarea>
				</label>

				<div class="profile-actions">
					<button type="submit" class="btn-save" disabled={isSavingProfile}>
						{isSavingProfile ? 'Saving...' : 'Save'}
					</button>
					<button type="button" class="btn-cancel" onclick={closeEditProfileModal}>Cancel</button>
				</div>
				{#if profileError}
					<p class="status error">{profileError}</p>
				{/if}
			</form>
		</div>
	</div>
{/if}

<style>
	.profile-root {
		min-width: 320px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 2rem;
	}
	.menu-wrap {
		position: relative;
		margin-bottom: 0.25rem;
	}
	.header-strip {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		background: var(--palette-dark);
		border-radius: 0.75rem;
		padding: 0.75rem;
	}
	.avatar-label {
		cursor: pointer;
		position: relative;
	}
	.avatar {
		width: 90px;
		height: 90px;
		border-radius: 999px;
		object-fit: cover;
		border: 2px solid #fff;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
	}
	.upload-badge {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: rgba(0, 0, 0, 0.45);
		border-radius: 999px;
		color: #fff;
		font-size: 1.25rem;
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
	.header-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-top: 0.5rem;
	}
	.name {
		font-size: 0.95rem;
		font-weight: 600;
		color: #fff;
	}
	.email {
		font-size: 0.95rem;
		font-weight: 600;
		color: #fff;
	}
	.err {
		color: #fecaca;
		font-size: 0.85rem;
		margin: 0;
	}
	.name-block {
		font-size: 2.2rem;
		font-weight: 600;
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem 0;
	}
	.grid-links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 120px;
	}
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}
	.link-row {
		text-decoration: none;
		color: inherit;
		border-radius: 0.5rem;
		padding: 0.15rem 0;
	}
	.link-row:hover .label {
		color: #fff;
	}
	.link-row:hover :global(.row-icon) {
		fill: #cbd5e1;
	}
	:global(.row-icon) {
		flex-shrink: 0;
	}
	:global(.row-icon-bookmark) {
		width: 1.35rem;
		height: 1.35rem;
		fill: var(--palette-dark);
	}
	:global(.row-icon-cat) {
		width: 1.5rem;
		height: 1.5rem;
		fill: var(--palette-dark);
	}
	:global(.row-icon-chart) {
		width: 1.5rem;
		height: 1.5rem;
		fill: var(--palette-dark);
	}
	.label {
		font-size: 1.05rem;
		letter-spacing: 0.05em;
		color: #e2e8f0;
		font-weight: 400;
	}
	.edit-profile-btn {
		align-self: flex-start;
		margin-top: 0.25rem;
		padding: 0.5rem 0.9rem;
		border-radius: 0.65rem;
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		border: 1px solid rgba(151, 180, 255, 0.45);
		background: rgba(151, 180, 255, 0.12);
		color: var(--palette-lightgray);
	}
	.edit-profile-btn:hover {
		background: rgba(151, 180, 255, 0.22);
		color: #fff;
	}
	.bio-readonly,
	.bio-placeholder {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.45;
		color: #e2e8f0;
		padding: 0.5rem 0 0;
	}
	.bio-placeholder {
		opacity: 0.75;
		font-style: italic;
	}
	.consistency-card {
		margin-top: 0.5rem;
	}
	.gradient-bar {
		width: 66%;
		height: 120px;
		border-radius: 0.75rem;
		background: linear-gradient(to left, var(--palette-pinkglow), var(--palette-dark));
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}
	.sub {
		font-size: 0.875rem;
		color: var(--palette-lightgray);
		margin-top: 0.5rem;
	}
	.title {
		font-size: 1.125rem;
		color: #fff;
		letter-spacing: 0.05em;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		display: grid;
		place-items: center;
		z-index: 50;
		padding: 1rem;
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
		font-size: 1.15rem;
		font-weight: 800;
		margin-bottom: 0.75rem;
		text-align: center;
	}
	.modal-form {
		display: grid;
		gap: 0.75rem;
	}
	.field {
		display: grid;
		gap: 0.3rem;
	}
	.field-label {
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		color: var(--palette-lightgray);
	}
	.field input {
		background: rgba(255, 255, 255, 0.95);
		color: var(--text-on-light);
		border: 1px solid rgba(151, 180, 255, 0.4);
		border-radius: 0.5rem;
		padding: 0.55rem 0.65rem;
	}
	.desc {
		width: 100%;
		min-height: 100px;
		background: var(--palette-dark);
		color: #fff;
		border: 1px solid rgba(151, 180, 255, 0.25);
		border-radius: 0.5rem;
		padding: 0.75rem;
	}
	.profile-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}
	.btn-save {
		padding: 0.5rem 1rem;
		border-radius: 0.65rem;
		font-weight: 700;
		border: 2px solid var(--palette-blueglow);
		background: var(--palette-dark);
		color: #fff;
		cursor: pointer;
	}
	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.btn-cancel {
		padding: 0.5rem 1rem;
		border-radius: 0.65rem;
		font-weight: 600;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: var(--palette-lightgray);
		cursor: pointer;
	}
	.status {
		font-size: 0.85rem;
		margin: 0;
	}
	.status.error {
		color: #fecaca;
	}
</style>
