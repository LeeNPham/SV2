<script lang="ts">
	import { Alert } from 'flowbite-svelte'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	export let data // pulls information from our +page.js

	let answer: any
	let toggleUpdate = false
	let title = ''
	let err = false
	let category = ''
	let id = data.id
	let description = ''
	let due_date: number

	async function getTodo() {
		const response = await fetch(`https://todo-test-api.onrender.com/api/todo/${id}`)
		const data = await response.json()
		return data
	}

	async function deleteTodo() {
		await fetch(`https://todo-test-api.onrender.com/api/todo/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(() => {
				;(window as Window).location = '/home'
			})
			.catch(() => {
				err = !err
			})
	}

	function toggleUpdateForm() {
		toggleUpdate = !toggleUpdate
	}

	function updateTodo() {
		fetch(`https://todo-test-api.onrender.com/api/todo/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				category,
				title,
				description,
				due_date: due_date ? new Date(due_date).toISOString().split('T')[0].toString() : 'null'
			})
		})
			.then((_res) => {
				window.location = '/home'
			})
			.catch((_err) => {
				err = !err
			})
	}

	onMount(async () => {
		answer = await getTodo()
		console.log(answer)
	})
</script>

<!-- Head -->
<svelte:head>
	<title>{id}</title>
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
	<h1
		class="text-white text-ellipsis truncate text-3xl font-bold text-center bg-palette-medium rounded-xl p-2"
	>
		Update {answer.title}
	</h1>

	<div class="bg-gray-100 p-5 border-2 border-blue-700 rounded-xl">
		<ol class="text-gray-500">
			<li><b>Category:</b> {answer.category}</li>
			<li><b>Title:</b> {answer.title}</li>
			<li><b>Details:</b> {answer.description}</li>
			<li><b>Creation Date:</b> {answer.create_date}</li>
			<li>
				<b>Completion:</b>
				{#if answer.completion == true}
					<div class="text-green-600">YOU FINISHED, YAY!</div>
				{:else}
					<div class="text-red-600">HURRY UP AND FINISH IT, BITCH</div>
				{/if}
			</li>
			<li><b>Creation Date:</b> {answer.create_date}</li>
			{#if answer.due_date != 'null'}
				<li><b>Due Date:</b> {answer.due_date}</li>
			{/if}
		</ol>

		<!-- Update Todo-->
		<button
			class="py-1 px-2 text-white bg-palette-medium hover:bg-palette-medium/50 rounded-md font-semibold"
			type="button"
			on:click={toggleUpdateForm}>Update</button
		>
		{#if toggleUpdate}
			<div class="grid grid-cols-1 w-full">
				<form
					class="flex flex-col w-auto justify-self-center gap-2 bg-palette-medium p-10 rounded-3xl"
					on:submit|preventDefault={updateTodo}
				>
					<div class="grid self-center text-2xl text-white font-semibold">Update</div>
					<div class="text-white">Originally created on: {answer.create_date}</div>
					<div class="text-md text-white font-bold">Category:</div>
					<input
						class="rounded-xl py-0 placeholder:text-gray-400"
						placeholder={answer.category}
						type="text"
						bind:value={category}
					/>

					<div class="text-md text-white font-bold">Title:</div>
					<input
						class="rounded-xl py-0 placeholder:text-gray-400"
						placeholder={answer.title}
						type="text"
						bind:value={title}
					/>

					<div class="text-md text-white font-bold">Description:</div>
					<input
						class="rounded-xl py-0 placeholder:text-gray-400"
						placeholder={answer.description}
						type="text"
						bind:value={description}
					/>

					<div class="text-md text-white font-bold">Due Date:</div>
					<input
						class="rounded-xl py-0 placeholder:text-gray-400"
						placeholder={answer.due_date}
						type="date"
						bind:value={due_date}
					/>
				</form>

				<button
					class="bg-red-600 hover:bg-red-600/50 text-white px-2 py-1 rounded-md font-semibold"
					on:click={deleteTodo}>Delete</button
				>
			</div>
		{/if}

		<!-- Home Button -->
		<div class="pt-2 flex flex-col w-auto justify-self-center">
			<a
				class="text-white bg-palette-blueglow hover:bg-palette-medium shadow-gray-600 shadow-sm px-2 py-1 rounded-md font-semibold"
				href="/">Home</a
			>
		</div>
	</div>
{/if}
