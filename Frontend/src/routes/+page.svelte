<script lang="ts">
	import { onDestroy, onMount, beforeUpdate, afterUpdate } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import CircleIcon from '$lib/icons/CircleIcon.svelte';
	import EllipsisIcon from '$lib/icons/EllipsisIcon.svelte';
	// @ts-ignore
	import CheckCircle from '$lib/icons/CheckCircle.svelte';
	import CirclePlus from '$lib/icons/CirclePlus.svelte';
	import BellIcon from '$lib/icons/BellIcon.svelte';
	import MagnifyingGlassIcon from '$lib/icons/MagnifyingGlassIcon.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
	export let data; //grabs information from our +page.js
	let showNewTodoModal = false;
	let showNewCategoryModal = false;

	function displayShowNewTodoModal() {
		showNewTodoModal = true;
	}
	function displayCreateNewCategoryModal() {
		showNewCategoryModal = true;
	}
	let userFirstName = 'Lee';
	let category = '';
	let category_id = '';
	let tasksCount = 0;

	let categoryColors = [
		'border-category-pink shadow shadow-category-pink',
		'border-category-blue shadow shadow-category-blue',
		'border-category-green shadow shadow-category-green',
		'border-category-yellow shadow shadow-category-yellow',
		'border-category-orange shadow shadow-category-orange',
		'border-category-purple shadow shadow-category-purple'
	];
	let colors = [
		'category-cyan',
		'category-pink',
		'category-blue',
		'category-green',
		'category-yellow',
		'category-orange',
		'category-purple'
	];

	let title = '';
	let description = '';
	let completion = false;
	let due_date: any;
	let completeCategories: any = [];
	let selectedCategory = 'All';
	function switchCategories(e: any) {
		selectedCategory = e.currentTarget.id;
	}

	function buildCategoriesWithTodos(categories: any[], tasks: any[]) {
		// console.log(categories);
		// start here later, you need the category id per category
		// inside of your complete categories object so that you can delete it you dummy,,, and update it too I guess
		// console.log(categories[0]._id);
		completeCategories['All'] = { todos: tasks }; // adding the All mapping of all tasks to the object
		// Create map of categories with category name as key, and blank lists as their values
		for (let category of categories) {
			if (!completeCategories.hasOwnProperty(category.title)) {
				let key = category.title;
				completeCategories[key] = {};
			}
		}

		// Iterate over tasks and adds task to correlating categorys list value
		for (let task of tasks) {
			let newKey = task.category;
			if (completeCategories.hasOwnProperty(newKey)) {
				if (!completeCategories[newKey].hasOwnProperty('todos')) {
					completeCategories[newKey] = { todos: [task] };
				} else {
					completeCategories[newKey].todos.push(task);
				}
			}
		}

		// Iterate over tasks and add a styling object to the categories list value to add styling ability
		let i = 0;
		for (let categoryObject in completeCategories) {
			if (!completeCategories[categoryObject].hasOwnProperty('color')) {
				completeCategories[categoryObject].color = colors[i];
				i++;
			}
		}

		for (let categoryObject in completeCategories) {
			if (
				!completeCategories[categoryObject].hasOwnProperty('count') &&
				completeCategories[categoryObject].todos != undefined
			) {
				let count = completeCategories[categoryObject].todos.length;
				completeCategories[categoryObject].count = count;
			} else {
				completeCategories[categoryObject].count = 0;
			}
		}

		let n = 0;
		for (let categoryObject in completeCategories) {
			if (!completeCategories[categoryObject].hasOwnProperty('categoryId')) {
				if (categoryObject != 'All') {
					// console.log(categoryObject);
					let idNumber = categories[n]._id;
					// console.log(idNumber);
					completeCategories[categoryObject].categoryId = idNumber;
					n++;
				}
			}
		}

		// this is what I will use to do the rest of the rendering!
		console.log(
			'complete categories with color assignment and number of todos per category!',
			completeCategories
		);
	}

	function createTodo() {
		const currentTime = new Date();
		const create_date = currentTime.toISOString().split('T')[0].toString();
		const newTodo = {
			category,
			title,
			description,
			completion,
			create_date,
			due_date: due_date ? new Date(due_date).toISOString().split('T')[0].toString() : 'null'
		};

		fetch('http://127.0.0.1:8000/api/todo/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTodo)
		})
			.then((response) => {
				// @ts-ignore
				window.location = '/';
			})
			.catch((error) => {
				return {
					status: 301,
					error: new Error('Could not create a new todo')
				};
			});
	}

	function createCategory() {
		const currentTime = new Date();
		const create_date = currentTime.toISOString().split('T')[0].toString();
		const newCategory = {
			title,
			description,
			create_date
		};

		fetch('http://127.0.0.1:8000/api/category/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newCategory)
		})
			.then((response) => {
				// @ts-ignore
				window.location = '/';
			})
			.catch((error) => {
				return {
					status: 301,
					error: new Error('Could not create a new category')
				};
			});
	}

	async function deleteCategory(e: any) {
		category_id = e.target.parentElement.id;
		const response = await fetch(`http://127.0.0.1:8000/api/category/${category_id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(() => {
				window.location = '/';
			})
			.catch(() => {
				console.log('there was an error deleting this');
			});
	}

	// beforeUpdate(() => {
	// 	console.log('thing beforeUpdate: ' + selectedCategory);
	// });

	// afterUpdate(() => {
	// 	console.log('thing afterUpdate: ' + selectedCategory);
	// });

	// onDestroy(() => {
	// 	console.log('thing destroyed: ' + Class);
	// });

	onMount(() => {
		tasksCount = data.items.length;
		buildCategoriesWithTodos(data.categories, data.items);
		// look up how to dynamically render out a variable from our map
		// add a button to update a category
		// add a button to update completion of a todo with an onchange for the radio value of a checkbox
	});
</script>

<svelte:head>
	<title>Lee's Todo App</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="bg-palette-medium p-10 h-screen w-full rounded-3xl grid grid-cols-1 content-between">
	<div class="min-w-[335px]">
		<!-- Top Menu -->
		<div class="h-[90px] w-full flex flex-row justify-between">
			<div>
				<button type="button">
					<MenuIcon
						Class="fill-palette-lightgray hover:fill-palette-lightgray/50 h-8 w-8"
					/></button
				>
			</div>
			<div class="flex flex-row gap-5">
				<div>
					<button type="button">
						<MagnifyingGlassIcon
							Class="fill-palette-lightgray hover:fill-palette-lightgray/50 h-7 w-7"
						/></button
					>
				</div>
				<div>
					<button type="button">
						<BellIcon
							Class="fill-palette-lightgray hover:fill-palette-lightgray/50 h-7 w-7"
						/></button
					>
				</div>
			</div>
		</div>
		<!-- Introduction -->
		<h1 class="text-4xl font-semibold text-white pb-5">What's up, {userFirstName}!</h1>
		<!-- Categories -->
		<div class="grid grid-cols-1 justify-start">
			<div class="text-palette-lightgray text-xs tracking-widest pb-5">CATEGORIES</div>
			<div class="grid grid-cols-1 w-full">
				<div class="flex overflow-scroll">
					<div class="flex pb-10 px-3 gap-3">
						{#each Object.keys(completeCategories) as category}
							<button
								id={category}
								on:click={switchCategories}
								class="relative text-left {completeCategories[category].count != 0
									? ''
									: 'pointer-events-none'}"
								type="button"
							>
								{#if category != 'All'}
									<button
										on:click={deleteCategory}
										id={category != 'All' ? completeCategories[category].categoryId : ''}
										class="absolute right-5 top-5"
										type="button"
									>
										<svg
											viewBox="0 0 576 512"
											role="img"
											id={category != 'All' ? completeCategories[category].categoryId : ''}
											class="h-5 w-f fill-red-600 hover:fill-red-600/50"
											><title>Delete</title><path
												d="M576 384c0 35.3-28.7 64-64 64H205.3c-17 0-33.3-6.7-45.3-18.7L9.372 278.6C3.371 272.6 0 264.5 0 256c0-8.5 3.372-16.6 9.372-22.6L160 82.75C172 70.74 188.3 64 205.3 64H512c35.3 0 64 28.65 64 64v256zM271 208.1l47.1 47.9-47.1 47c-9.3 9.4-9.3 24.6 0 33.1 9.4 10.2 24.6 10.2 33.1 0l47.9-46.2 47 46.2c9.4 10.2 24.6 10.2 33.1 0 10.2-8.5 10.2-23.7 0-33.1l-46.2-47 46.2-47.9c10.2-8.5 10.2-23.7 0-33.1-8.5-9.3-23.7-9.3-33.1 0l-47 47.1-47.9-47.1c-8.5-9.3-23.7-9.3-33.1 0-9.3 9.4-9.3 24.6 0 33.1z"
											/></svg
										>
									</button>
								{/if}
								<div
									class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-lg p-5 {selectedCategory ==
									category
										? 'shadow-category-cyan/50'
										: 'shadow-black/50'} "
								>
									<div class="grid grid-cols-1 gap-1">
										<div class="text-palette-lightgray text-sm">
											{completeCategories[category].count} tasks
										</div>
										<div class="text-white text-2xl font-bold">
											{category}
										</div>
									</div>

									<hr
										class="border-{completeCategories[category]
											.color} shadow shadow-{completeCategories[category].color}"
									/>
								</div>
							</button>
						{/each}
						<button on:click={displayCreateNewCategoryModal} class="text-left" type="button">
							<div
								class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg p-5"
							>
								<div class="grid grid-cols-1 gap-1">
									<div class="text-palette-lightgray text-sm">+ tasks</div>
									<div class="text-white text-2xl font-bold">+ Category</div>
								</div>

								<hr class="border-category-cyan shadow shadow-category-cyan" />
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Today's Tasks -->
		<div class="grid grid-cols-1 justify-start">
			<div class="text-palette-lightgray text-xs tracking-widest pb-5">TODAY'S TASKS</div>
			<div class="overflow-y-auto h-[450px]">
				<div class="grid grid-cols-1 w-full gap-2 px-3">
					{#each Object.keys(completeCategories) as category}
						<!-- {#if selectedCategory == category} -->
						{#if completeCategories[category].todos != undefined}
							{#each completeCategories[category].todos as todo}
								<hr
									class="border-{completeCategories[category]
										.color} shadow shadow-{completeCategories[category].color}"
								/>
								<div
									class="bg-palette-dark h-[60px] w-full rounded-3xl flex flex-row justify-between items-center px-4 shadow-black/50 shadow-md"
								>
									<div class="text-white text-sm pr-2">
										hello
										{completeCategories[category].color}
									</div>

									<div class="flex gap-2 items-center">
										{#if todo.completion == true}
											<button type="button" class="">
												<CheckCircle Class="h-6 w-6 fill-{completeCategories[category].color}" />
											</button>
										{:else}
											<button type="button" class="">
												<CircleIcon Class="h-6 w-6 fill-{completeCategories[category].color}" />
											</button>
										{/if}
										<div class="grid grid-cols-1 px-2">
											<div
												class="w-full text-white text-ellipsis {todo.completion
													? 'line-through'
													: ''} truncate"
											>
												{todo.title}
											</div>
											{#if todo.due_date != 'null'}
												<div class="w-full text-xs text-white/40 text-ellipsis truncate">
													Due: {todo.due_date}
												</div>
											{/if}
										</div>
									</div>
									<a class="text-white" href={`/${todo._id}`}>
										<EllipsisIcon />
									</a>
								</div>
							{/each}
						{/if}
						<!-- {/if} -->
					{/each}
				</div>
			</div>
		</div>
	</div>

	<label class="absolute right-10 bottom-12" for="addNewTodo">
		<button
			id="addNewTodo"
			class="hidden"
			type="button"
			on:click|stopPropagation={displayShowNewTodoModal}
		/>
		<CirclePlus
			Class="fill-palette-pinkglow shadow-xl shadow-palette-pinkglow/60 h-14 w-14 bg-white rounded-full cursor-pointer"
		/>
	</label>
</div>

<!-- Modals -->
<Modal Title="Create a New Todo" bind:showModal={showNewTodoModal}>
	<div class="grid grid-cols-1 w-full">
		<form
			class="flex flex-col w-auto justify-self-center gap-2 bg-palette-medium p-20 rounded-3xl"
			on:submit|preventDefault={createTodo}
		>
			<div class="text-md text-white font-bold">Category:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="New Description"
				type="text"
				bind:value={category}
			/>

			<div class="text-md text-white font-bold">Title:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="New Title"
				type="text"
				bind:value={title}
			/>

			<div class="text-md text-white font-bold">Description:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="New Description"
				type="text"
				bind:value={description}
			/>

			<div class="text-md text-white font-bold">Due Date:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="New Description"
				type="date"
				bind:value={due_date}
			/>
			<div>
				<button
					class="text-white bg-palette-blueglow hover:bg-palette-medium shadow-md px-2 py-1 rounded-xl font-semibold"
					type="submit">Create Todo</button
				>
			</div>
		</form>
	</div>
</Modal>

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
			/>

			<div class="text-md text-white font-bold">Description:</div>
			<input
				class="rounded-xl py-0 placeholder:text-gray-400"
				placeholder="Details"
				type="text"
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

<style>
</style>
