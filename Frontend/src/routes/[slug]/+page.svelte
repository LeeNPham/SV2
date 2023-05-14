<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Alert } from 'flowbite-svelte';
	export let data; // pulls information from our +page.js
	let title = data.title;
	let description = '';
	let answer;
	let toggleUpdate = false
	let err = false
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
				goto('/');
			})
			.catch((error) => {
					err = !err
			});
	}
function toggleUpdateForm() {
	toggleUpdate= !toggleUpdate
}
	function updateTodo() {
		fetch(`http://127.0.0.1:8000/api/todo/${title}?desc=${description}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				desc: description
			})
		})
			.then((response) => {
				goto('/');
			})
			.catch((error) => {
				err = !err
			});
	}


	onMount(() => {
		answer = await getTodo();
		console.log(data); // only shows the title :[
	});
</script>

<!-- Head -->
<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<!-- Alerts -->
{#if err}
	<Alert>
		<span class="font-medium">Info alert!</span> There was an issue updating your todo item
	</Alert>
{/if}

<!-- Body -->
<h1>Welcome to your slug!</h1>
<h1 class="text-white bg-blue-700 rounded-xl p-2">{title}</h1>
<div class="bg-gray-100 p-5 border-2 border-blue-700 rounded-xl">
	<h1 class="text-blue-500">Your slug choice is ....</h1>
	<h1 class="text-blue-700">{title}</h1>

	{#if answer}
		<div>{answer.description}</div>
	{/if}

	<!-- Update Todo-->
	<div>Update your To-do</div>
	<button type="button" on:click={toggleUpdateForm}>Open Form</button>
	{#if toggleUpdate}
		<form on:submit|preventDefault={updateTodo}>
			New description:
			<input type="text" bind:value={description} />

			<button type="submit">Update To-do</button>
		</form>
	{/if}
	<div>Would you like to delete this To-Do?</div>
	<button class="bg-red-600 px-3 py-1 rounded-xl border-red-800" on:click={deleteTodo}
		>Delete To-Do</button
	>

	<a
		class="text-blue-300 hover:text-blue-500 bg-white border-2 border-blue-500 p-2 rounded-xl"
		href="/">Home</a
	>
</div>
