<script lang="ts">
	import { onMount } from 'svelte';
	import { Alert } from 'flowbite-svelte';
	export let data; // pulls information from our +page.js

	let answer: any;
	let toggleUpdate = false;
	let err = false;
	let category = '';
	let title = data.title;
	let description = '';
	let completion = false;
	let due_date: any;
	let create_date;


	async function getTodo() {
		const response = await fetch(`http://127.0.0.1:8000/api/todo/${title}`);
		const data = await response.json();
		return data;
	}

	async function deleteTodo() {
		const response = await fetch(`http://127.0.0.1:8000/api/todo/${title}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				window.location = '/';
			})
			.catch((error) => {
				err = !err;
			});
	}
	function toggleUpdateForm() {
		toggleUpdate = !toggleUpdate;
	}
	function updateTodo() {
		fetch(`http://127.0.0.1:8000/api/todo/${title}?desc=${description}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				category,
			title,
			description,
			completion,
			create_date,
			due_date: due_date ? new Date(due_date).toISOString().split('T')[0].toString() : 'null'

			})
		})
			.then((response) => {
				goto('/');
			})
			.catch((error) => {
				err = !err;
			});
	}

	onMount(async () => {
		answer = await getTodo();
		console.log(answer)
	});
</script>

<!-- Head -->
<svelte:head>
	<title>{title}</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<!-- Alerts -->
{#if err}
	<Alert>
		<span class="font-medium">Info alert!</span> There was an issue updating your todo item
	</Alert>
{/if}

<!-- Body -->
{#if answer}
<h1 class="text-white text-ellipsis truncate text-3xl font-bold text-center bg-palette-medium rounded-xl p-2">Update {answer.title}</h1>
<div class="bg-gray-100 p-5 border-2 border-blue-700 rounded-xl">
	<ol class='text-gray-500'>
		<li> <b>ID:</b> {answer._id}</li>
		<li> <b>Category:</b> {answer.category}</li>
		<li><b>Title:</b> {answer.title}</li>
		<li><b>Details:</b> {answer.description}</li>
		<li><b>Creation Date:</b> {answer.create_date}</li>
		<label>
			<li><b>Completion:</b> <input type=checkbox bind:checked={answer.completion}></li>
		</label>
		{#if answer.due_date != 'null'}
			<li><b>Due Date:</b> {answer.due_date}</li>
		{/if}
	</ol>

	<!-- Update Todo-->
	<button class='py-1 px-2 text-white bg-palette-medium hover:bg-palette-medium/50 rounded-md font-semibold' type="button" on:click={toggleUpdateForm}>Update</button>
	{#if toggleUpdate}
	<div class="grid grid-cols-1 w-full">
		<form
			class="flex flex-col w-auto justify-self-center gap-2 bg-palette-medium p-20 rounded-3xl"
			on:submit|preventDefault={updateTodo}
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

	</div>
	{/if}
	<button class="bg-red-600 hover:bg-red-600/50 text-white px-2 py-1 rounded-md font-semibold" on:click={deleteTodo}
		>Delete</button
	>
	<div class="pt-2 flex flex-col w-auto justify-self-center">
		<a
			class="text-white bg-palette-blueglow hover:bg-palette-medium shadow-gray-600 shadow-sm px-2 py-1 rounded-md font-semibold"
			href="/">Home</a
		>
	</div>

</div>
{/if}
