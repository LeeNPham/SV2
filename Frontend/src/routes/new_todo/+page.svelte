<script>
	import { goto } from '$app/navigation';

	let title = '';
	let description = '';
	let todo = '';

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
				// Handle response

				goto('/');
			})
			.catch((error) => {
				// Handle error
			});
	}
</script>

<div>Hello, this is where you can create a new To-Do!</div>

<form on:submit={handleSubmit}>
	Title:
	<input type="text" bind:value={title} />

	Description:
	<input type="text" bind:value={description} />

	<button type="submit">Create Todo</button>
</form>

<div>
	<img
		src="https://www.premiumsvg.com/img_thumb/U-Fr1tCc9wFU7pFi8a5HbqMMepCJTuGduvF6L_ur3116m1.jpg"
		alt=""
	/>
</div>

<div>
	<a href="/">Home</a>
</div>
