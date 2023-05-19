<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import CircleIcon from '$lib/icons/CircleIcon.svelte';
	// @ts-ignore
	import CheckCircle from '$lib/icons/CheckCircle.svelte';
	import CirclePlus from '$lib/icons/CirclePlus.svelte';
	import BellIcon from '$lib/icons/BellIcon.svelte';
	import MagnifyingGlassIcon from '$lib/icons/MagnifyingGlassIcon.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';
	export let data; //grabs information from our +page.js
	let Todos = data;
	let showModal = false;

	function showNewTodoModal() {
		showModal = true;
		// @ts-ignore
		// window.location = '/new_todo';
	}

	let category = '';
	let title = '';
	let description = '';
	let completion = false;
	let due_date: any;

	function handleSubmit() {
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
	onMount(() => {
		console.log('hello, im onmount');
		console.log(Todos);
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
				<MenuIcon Class="fill-palette-lightgray h-8 w-8" />
			</div>
			<div class="flex flex-row gap-5">
				<div>
					<MagnifyingGlassIcon Class="fill-palette-lightgray h-7 w-7" />
				</div>
				<div>
					<BellIcon Class="fill-palette-lightgray h-7 w-7" />
				</div>
			</div>
		</div>
		<!-- Introduction -->
		<h1 class="text-4xl font-semibold text-white pb-5">What's up, Lee!</h1>
		<!-- Categories -->
		<div class="grid grid-cols-1 justify-start">
			<div class="text-palette-lightgray text-xs tracking-widest pb-5">CATEGORIES</div>
			<div class="grid grid-cols-1 w-full">
				<div class="flex overflow-scroll">
					<div class="flex pb-10 gap-4">
						<!-- Category -->
						<div
							class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg p-5"
						>
							<div class="grid grid-cols-1 gap-1">
								<div class="text-palette-lightgray text-sm">40 tasks</div>
								<div class="text-white text-2xl font-bold">Business</div>
							</div>
							<hr />
						</div>

						<div
							class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg p-5"
						>
							<div class="grid grid-cols-1 gap-1">
								<div class="text-palette-lightgray text-sm">40 tasks</div>
								<div class="text-white text-2xl font-bold">Personal</div>
							</div>
							<hr />
						</div>

						<div
							class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg p-5"
						>
							<div class="grid grid-cols-1 gap-1">
								<div class="text-palette-lightgray text-sm">40 tasks</div>
								<div class="text-white text-2xl font-bold">Side-Hustle</div>
							</div>
							<hr />
						</div>

						<div
							class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg p-5"
						>
							<div class="grid grid-cols-1 gap-1">
								<div class="text-palette-lightgray text-sm">40 tasks</div>
								<div class="text-white text-2xl font-bold">Reading List</div>
							</div>
							<hr />
						</div>

						<div
							class="grid grid-cols-1 content-between min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg p-5"
						>
							<div class="grid grid-cols-1 gap-1">
								<div class="text-palette-lightgray text-sm">40 tasks</div>
								<div class="text-white text-2xl font-bold">SpankBank</div>
							</div>
							<hr />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Today's Tasks -->
		<div class="grid grid-cols-1 justify-start">
			<div class="text-palette-lightgray text-xs tracking-widest pb-5">TODAY'S TASKS</div>
			<div class="overflow-y-auto h-[450px]">
				<div class="grid grid-cols-1 w-full gap-4">
					{#each Todos.items as todo}
						<pre>{todo.completion}</pre>
						<div
							class="bg-palette-dark h-[60px] w-full rounded-3xl flex flex-row justify-between items-center px-4"
						>
							<!-- In the backend, make it allow for either complete or incomplete within the todo item data, if its complete, change svg to completed -->
							<!-- If business, then pink circle if personal, then blue circle if side-hustle, then green circle -->
							{#if todo.completion == true}
								<button type="button"><CheckCircle Class="h-6 w-6 fill-palette-pinkglow" /></button>
							{:else}
								<button type="button"><CircleIcon Class="h-6 w-6 fill-palette-pinkglow" /></button>
							{/if}
							<div class="w-full px-2 text-white text-ellipsis truncate">
								{todo.title}
							</div>
							<a class="text-white" href={`/${todo.title}`}>Edit</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<label class="absolute right-10 bottom-12" for="addNewTodo">
		<button id="addNewTodo" class="hidden" type="button" on:click={showNewTodoModal} />
		<CirclePlus Class="fill-palette-pinkglow h-16 w-16 bg-white rounded-full cursor-pointer" />
	</label>
</div>

<!-- Modals -->
<Modal Title="Create a New Todo" bind:showModal>
	<div class="grid grid-cols-1 w-full">
		<form
			class="flex flex-col w-auto justify-self-center gap-2 bg-palette-medium p-20 rounded-3xl"
			on:submit|preventDefault={handleSubmit}
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
		<!-- Home Button -->
		<div class="pt-2 flex flex-col w-auto justify-self-center">
			<a
				class="text-white bg-palette-blueglow hover:bg-palette-medium shadow-gray-600 shadow-sm px-2 py-1 rounded-xl font-semibold"
				href="/">Home</a
			>
		</div>
	</div>
</Modal>

<style>
</style>
