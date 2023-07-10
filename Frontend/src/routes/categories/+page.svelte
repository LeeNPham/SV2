<script lang="ts">
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { PUBLIC_BACKEND_USERS, PUBLIC_BACKEND_TODOS } from '$env/static/public'
	import Modal from '$lib/components/Modal.svelte'
	export let data
	import NavMenu from '$lib/components/NavMenu.svelte'

	let userId = ''
	let title = ''
	let description = ''
	let myCategories: any[] = []
	let showNewCategoryModal = false
	function displayCreateNewCategoryModal() {
		showNewCategoryModal = true
	}

	async function createCategory() {
		try {
			const currentTime = new Date()
			const create_date = currentTime.toISOString().split('T')[0].toString()
			const newCategory = {
				title,
				description,
				create_date
			}
			const res = await fetch(`${PUBLIC_BACKEND_TODOS}/api/category/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newCategory)
			})
			if (!res.ok) {
				throw new Error('Failed to create a new category')
			}
			const data = await res.json()
			const categoryId = data._id
			const userResponse = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (!userResponse.ok) {
				throw new Error('Failed to fetch user data')
			}
			const userData = await userResponse.json()
			const currentCategories = userData.categories || []
			const updatedCategories = [...currentCategories, categoryId]
			const putResponse = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					categories: updatedCategories
				})
			})
			if (!putResponse.ok) {
				throw new Error('Failed to update user category list')
			}
			showNewCategoryModal = false
			window.location.assign('/categories')
		} catch (error) {
			return {
				status: 301,
				error: new Error('Could not create a new category')
			}
		}
	}

	async function deleteCategory(e: any) {
		try {
			const category_id = e.target.parentElement.id

			await fetch(`${PUBLIC_BACKEND_TODOS}/api/category/${category_id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const response = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw new Error('Failed to fetch user data')
			}

			const userData = await response.json()
			const currentCategories = userData.categories || []
			const updatedCategories = currentCategories.filter(
				(categoryId: string) => categoryId !== category_id
			)

			const putResponse = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					categories: updatedCategories
				})
			})

			if (!putResponse.ok) {
				throw new Error('Failed to update user category list')
			}

			window.location.assign('/categories')
		} catch (error) {
			console.error('Error deleting category:', error)
			return {
				status: 301,
				error: new Error('Could not update user category list')
			}
		}
	}

	function filterToMyCategories(myCategories: any[], categories: any[]) {
		let newCategories: any[] = []
		if (!Array.isArray(myCategories)) {
			return newCategories
		}
		for (let i of myCategories) {
			const category = categories.find((category) => category._id === i)
			if (category) {
				newCategories.push(category)
			}
		}
		return newCategories
	}

	onMount(async () => {
		userId = data.identity._id
		myCategories = filterToMyCategories(data.identity.categories, data.categories)
		console.log(myCategories)
	})
</script>

<div
	class="min-w-[414px] flex flex-col justify-center h-screen px-8 py-10 bg-palette-medium rounded-3xl"
>
	<div class="flex flex-row items-start justify-between h-1/10">
		<NavMenu />
	</div>
	<div class="flex justify-center tracking-wider text-white font-bold text-3xl">My Categories</div>
	<button
		on:click={displayCreateNewCategoryModal}
		class="text-white bg-palette-dark hover:bg-palette-dark/50 rounded-lg my-2 py-2"
		>+ Category</button
	>
	<div class="grid grid-cols-2 w-full gap-4 h-4/5 content-start py-8 overflow-y-scroll">
		{#each myCategories as category}
			<div
				class="w-full bg-palette-dark text-white rounded-2xl h-[130px] shadow-inner overflow-clip p-3"
			>
				<button
					on:click={deleteCategory}
					id={category.title != 'All' ? category._id : ''}
					class=""
					type="button"
				>
					<svg
						viewBox="0 0 576 512"
						role="img"
						id={category.title != 'All' ? category._id : ''}
						class="h-5 w-f fill-red-600 hover:fill-red-600/50"
						><title>Delete</title><path
							d="M576 384c0 35.3-28.7 64-64 64H205.3c-17 0-33.3-6.7-45.3-18.7L9.372 278.6C3.371 272.6 0 264.5 0 256c0-8.5 3.372-16.6 9.372-22.6L160 82.75C172 70.74 188.3 64 205.3 64H512c35.3 0 64 28.65 64 64v256zM271 208.1l47.1 47.9-47.1 47c-9.3 9.4-9.3 24.6 0 33.1 9.4 10.2 24.6 10.2 33.1 0l47.9-46.2 47 46.2c9.4 10.2 24.6 10.2 33.1 0 10.2-8.5 10.2-23.7 0-33.1l-46.2-47 46.2-47.9c10.2-8.5 10.2-23.7 0-33.1-8.5-9.3-23.7-9.3-33.1 0l-47 47.1-47.9-47.1c-8.5-9.3-23.7-9.3-33.1 0-9.3 9.4-9.3 24.6 0 33.1z"
						/></svg
					>
				</button>
				<div class="flex flex-col px-2">
					<div class="w-full font-bold text-center whitespace-nowrap">{category.title}</div>
					<div class="text-left text-palette-lightgray indent-4 text-sm">
						{category.description}
					</div>
				</div>
			</div>
		{/each}

		<!-- {#each dummyData as category}
			<div
				class="w-full bg-palette-dark text-white rounded-2xl h-[130px] shadow-inner overflow-clip p-3"
			>
				<div class="flex flex-col px-2">
					<div class="w-full font-bold text-center whitespace-nowrap">{category.title}</div>
					<div class="text-left text-palette-lightgray indent-4 text-sm">
						{category.description}
					</div>
				</div>
			</div>
		{/each} -->
	</div>
</div>

<Modal Title="Create a New Category" bind:showModal={showNewCategoryModal}>
	<div class="grid grid-cols-1 w-full">
		<form
			class="flex flex-col w-auto justify-self-center gap-2 bg-palette-medium p-20 rounded-3xl"
			on:submit|preventDefault={createCategory}
		>
			<div class="text-md text-white font-bold">Category Name:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="Category Name"
				type="text"
				bind:value={title}
				required
			/>

			<div class="text-md text-white font-bold">Description:</div>
			<textarea
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="Description Details"
				bind:value={description}
			/>

			<button
				class="text-white bg-palette-blueglow hover:bg-palette-medium shadow-md px-2 py-1 rounded-xl font-semibold"
				type="submit"
			>
				Create Category
			</button>
		</form>
	</div>
</Modal>
