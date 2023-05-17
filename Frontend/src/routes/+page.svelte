<script>
	import CircleIcon from '$lib/icons/CircleIcon.svelte';
	// @ts-ignore
	import CheckCircle from '$lib/icons/CheckCircle.svelte';
	import CirclePlus from '$lib/icons/CirclePlus.svelte';
	import { onMount } from 'svelte';

	export let data; //grabs information from our +page.js

	function showNewTodoModal() {
		// @ts-ignore
		window.location = '/new_todo';
	}

	let Todos = data;

	onMount(() => {
		console.log('hello, im onmount');
	});
</script>

<svelte:head>
	<title>Lee's Todo App</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div
	class="bg-palette-medium p-10 h-full w-full rounded-3xl grid grid-cols-1 content-between overflow-scroll"
>
	<div>
		<!-- Top Menu -->
		<div class="h-[90px] w-full flex flex-row justify-between">
			<div>menu</div>
			<div class="flex flex-row gap-5">
				<div>search</div>
				<div>bell</div>
			</div>
		</div>
		<!-- Introduction -->
		<h1 class="text-4xl font-semibold text-white pb-5">What's up, Lee!</h1>
		<!-- Collections -->
		<div class="grid grid-cols-1 justify-start pb-10">
			<div class="text-palette-lightgray text-xs tracking-widest pb-5">CATEGORIES</div>
			<div class="grid grid-cols-1 w-full overflow-scroll">
				<div class="flex flex-row gap-4 pb-10">
					<div
						class="min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg"
					>
						<div class="text-palette-lightgray text-sm">40 tasks</div>
						<div class="text-white text-lg font-bold">Business</div>
						<hr />
					</div>
					<div
						class="min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg"
					>
						<div class="text-palette-lightgray text-sm">40 tasks</div>
						<div class="text-white text-lg font-bold">Personal</div>
						<hr />
					</div>
					<div
						class="min-w-[200px] bg-palette-dark h-[120px] rounded-3xl shadow-black/50 shadow-lg"
					>
						<div class="text-palette-lightgray text-sm">40 tasks</div>
						<div class="text-white text-lg font-bold">Side Hussle</div>
						<hr />
					</div>
				</div>
			</div>
		</div>

		<!-- Today's Tasks -->
		<div class="grid grid-cols-1 justify-start pb-10">
			<div class="text-palette-lightgray text-xs tracking-widest pb-5">TODAY'S TASKS</div>
			<div class="grid grid-cols-1 w-full gap-4 overflow-scroll">
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

	<div class="flex flex-row justify-end">
		<label for="addNewTodo">
			<button id="addNewTodo" class="hidden" type="button" on:click={showNewTodoModal} />
			<CirclePlus Class="fill-palette-pinkglow h-14 w-14 bg-white rounded-full cursor-pointer" />
		</label>
	</div>
</div>

<!-- Modals -->

<style>
</style>
