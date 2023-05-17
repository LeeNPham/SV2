<script>
	import { onMount } from 'svelte';
	import CircleIcon from '$lib/icons/CircleIcon.svelte';
	// @ts-ignore
	import CheckCircle from '$lib/icons/CheckCircle.svelte';
	import CirclePlus from '$lib/icons/CirclePlus.svelte';
	import BellIcon from '$lib/icons/BellIcon.svelte';
	import MagnifyingGlassIcon from '$lib/icons/MagnifyingGlassIcon.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';

	export let data; //grabs information from our +page.js
	let Todos = data;

	function showNewTodoModal() {
		// @ts-ignore
		window.location = '/new_todo';
	}

	onMount(() => {
		console.log('hello, im onmount');
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
						<div
							class="bg-palette-dark h-[60px] w-full rounded-3xl flex flex-row justify-between items-center px-4"
						>
							<!-- In the backend, make it allow for either complete or incomplete within the todo item data, if its complete, change svg to completed -->
							<!-- If business, then pink circle if personal, then blue circle if side-hustle, then green circle -->
							<CircleIcon Class="h-6 w-6 fill-palette-pinkglow" />

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

<style>
</style>
