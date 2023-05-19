<script>
	// @ts-nocheck
	let category = '';
	let title = '';
	let description = '';
	let completion = false;
	let due_date;

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

<div class="bg-white h-full min-w-[414px] p-3">
	<h1 class="text-center w-full h-auto text-lg font-semibold text-palette-primary pb-2">
		Create a new Task!
	</h1>
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
</div>
