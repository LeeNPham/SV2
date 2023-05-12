<script>
	import { onMount } from 'svelte';

	export let data; // pulls information from our +page.js

	onMount(() => {
		console.log(data); // only shows the title :[
	});
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<h1>Welcome to your slug!</h1>
<h1 class="text-white bg-blue-700 rounded-xl p-2">{data.title}</h1>
<div class="bg-gray-100 p-5 border-2 border-blue-700 rounded-xl">
	<h1 class="text-blue-500">Your slug choice is ....</h1>
	<h1 class="text-blue-700">{data.title}</h1>
	<!-- {#each data.items as todo} -->
	<div>thingy</div>
	<!-- {/each} -->
	<a
		class="text-blue-300 hover:text-blue-500 bg-white border-2 border-blue-500 p-2 rounded-xl"
		href="/">Back to home!</a
	>
</div>
