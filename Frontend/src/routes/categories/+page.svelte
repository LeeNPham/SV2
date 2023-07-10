<script lang="ts">
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { PUBLIC_BACKEND_USERS, PUBLIC_BACKEND_TODOS } from '$env/static/public'
	import Modal from '$lib/components/Modal.svelte'
	export let data
	import NavMenu from '$lib/components/NavMenu.svelte'
	import DeleteCategoryIcon from '$lib/icons/DeleteCategoryIcon.svelte'
	import EllipsisIcon from '$lib/icons/EllipsisIcon.svelte'

	let userId = ''
	let title = ''
	let description = ''
	let myCategories: any[] = []
	let showNewCategoryModal = false
	let showUpdateCategoryModal = false
	let updateId = ''
	let updateTitle = ''
	let updateDescription = ''

	function displayCreateNewCategoryModal() {
		showNewCategoryModal = true
	}

	interface Category {
		_id: string
		title: string
		description: string
	}
	function displayUpdateCategoryModal(categoryToUpdate: Category) {
		showUpdateCategoryModal = true
		updateId = categoryToUpdate._id
		updateTitle = categoryToUpdate.title
		updateDescription = categoryToUpdate.description
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

	async function updateCategory() {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_TODOS}/api/category/${updateId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: updateTitle,
					description: updateDescription
				})
			})
			if (!response.ok) {
				throw new Error('Failed to update the category')
			}
			window.location.assign('/categories')
		} catch (error) {
			console.error('Error updating the category:', error)
			return {
				status: 301,
				error: new Error('Could not update the category')
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
				class="w-full bg-palette-dark text-white rounded-xl h-[180px] shadow-md shadow-black/50 overflow-clip p-3"
			>
				<div class="flex flex-col px-2 h-full">
					<div class="h-full">
						<div class="relative w-full font-bold text-center whitespace-nowrap">
							<div class="absolute flex justify-end w-full">
								<button
									on:click={deleteCategory}
									id={category.title != 'All' ? category._id : ''}
									class=""
									type="button"
								>
									<DeleteCategoryIcon {category} />
								</button>
							</div>
							<div>{category.title}</div>
						</div>
						<div class="text-left text-palette-lightgray indent-2 text-sm">
							{category.description}
						</div>
					</div>
					<div class="flex flex-row w-full justify-end items-end h-auto">
						<button on:click={() => displayUpdateCategoryModal(category)}> <EllipsisIcon /></button>
					</div>
				</div>
			</div>
		{/each}
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

<Modal Title="Update {updateTitle}" bind:showModal={showUpdateCategoryModal}>
	<div class="grid grid-cols-1 w-full">
		<form
			class="flex flex-col w-auto justify-self-center gap-2 bg-palette-medium p-20 rounded-3xl"
			on:submit|preventDefault={updateCategory}
		>
			<div class="text-md text-white font-bold">Category Name:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-200 text-gray-900"
				placeholder={updateTitle}
				type="text"
				bind:value={updateTitle}
				required
			/>

			<div class="text-md text-white font-bold">Description:</div>
			<textarea
				class="rounded-xl py-0 placeholder:text-gray-200 text-gray-900"
				placeholder={updateDescription}
				bind:value={updateDescription}
			/>

			<button
				class="text-white bg-palette-blueglow hover:bg-palette-medium shadow-md px-2 py-1 rounded-xl font-semibold"
				type="submit"
			>
				Update Category
			</button>
		</form>
	</div>
</Modal>
