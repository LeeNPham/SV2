<script>
	import { onMount } from 'svelte';
	import { Alert, Modal } from 'flowbite-svelte';
	let clickedTheButton = false;
	function clickMeForAlert() {
		clickedTheButton = !clickedTheButton;
	}
	export let data; //grabs information from our +page.js
	let Todos = data;

	onMount(() => {
		console.log('hello, im onmount');
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<h1>Welcome to /! Choose a link to see a slug</h1>
<div class="bg-gray-300 p-5 border border-white rounded-xl">
	{#each Todos.items as todo}
		<a
			class="text-blue-400 hover:text-blue-700 bg-white p-2 rounded-xl border-2 border-b-0 rounded-b-none border-blue-200 hover:border-blue-500"
			href={`/${todo.title}`}
		>
			{todo.title}
		</a>
		<p class="text-gray-500 bg-white rounded-tl-none rounded-md p-4 mt-1 mb-4">
			{todo.description}
		</p>
	{/each}
</div>

<div>
	<div class="">
		<p class="">New Todo</p>
		<a class="px-2 py-1 bg-blue-500 hover:bg-blue-300 text-white rounded-xl" href="/new_todo"
			>Create a new To-Do</a
		>
	</div>
</div>

<div class="flex flex-col justify-center content-center">
	<button
		on:click={clickMeForAlert}
		type="button"
		class="bg-blue-500 hover:bg-blue-400 text-white border-2 border-white rounded-md px-2 py-1 w-1/12 flex self-center justify-self-center"
		>Click for an Alert
	</button>
	{#if clickedTheButton}
		<Modal
			color="red"
			restProps.color="red"
			open={clickedTheButton}
			title="Hey there, I'm an Alert"
			size="md"
			placement="top-center"
			class="bg-blue-400 border border-blue-600"
		>
			<Alert>
				<span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
			</Alert>
		</Modal>
	{/if}
</div>

<style>
</style>
