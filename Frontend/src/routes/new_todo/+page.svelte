<script>
	import { goto } from '$app/navigation';
	let title = '';
	let description = '';

	function handleSubmit(event) {
		event.preventDefault();

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
				goto('/');
			})
			.catch((error) => {});
	}
</script>

<div>Hello, this is where you can create a new To-Do!</div>
<div>
	<form on:submit={handleSubmit}>
		Title:
		<input type="text" bind:value={title} />

		Description:
		<input type="text" bind:value={description} />

		<button type="submit">Create Todo</button>
	</form>
</div>
<div>
	<a href="/">Home</a>
</div>
