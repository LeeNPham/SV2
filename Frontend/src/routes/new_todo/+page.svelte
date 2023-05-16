<script>
	let title = '';
	let description = '';

	function handleSubmit() {
		const newTodo = {
			title,
			description
		};
		fetch('http://127.0.0.1:8000/api/todo/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTodo)
		})
			.then((response) => {
				// goto('/');
				window.location = '/';
			})
			.catch((error) => {
				return {
					status: 301,
					error: new Error('Could not create a new todo')
				};
			});
	}
</script>

<h1 class="w-full h-auto bg-gray-500">Hello, this is where you can create a new To-Do!</h1>
<div class="grid grid-cols-1 w-full">
	<form
		class="flex flex-col w-auto justify-self-center gap-2 bg-white p-10 rounded-xl"
		on:submit|preventDefault={handleSubmit}
	>
		<div class="text-md font-bold">Title:</div>
		<input
			class="rounded-xl py-0 placeholder:text-gray-400"
			placeholder="New Title"
			type="text"
			bind:value={title}
		/>

		<div class="text-md font-bold">Description:</div>
		<input
			class="rounded-xl py-0 placeholder:text-gray-400"
			placeholder="New Description"
			type="text"
			bind:value={description}
		/>
		<div>
			<button class="text-white py-1 px-2 bg-blue-500 hover:bg-blue-300 rounded-xl" type="submit"
				>Create Todo</button
			>
		</div>
	</form>
</div>

<!-- Home Button -->
<div>
	<a class="text-white bg-gray-700 hover:bg-gray-500 px-2 py-1 rounded-xl" href="/">Home</a>
</div>
