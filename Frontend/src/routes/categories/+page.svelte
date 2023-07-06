<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { slide } from 'svelte/transition'
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'
	export let data

	let myCategories: any[] = []

	function goProfile() {
		goto('/profile')
	}

	function goHome() {
		goto('/home')
	}

	function filterToMyCategories(myCategories: any[], categories: any[]) {
		let newCategories: any[] = []
		if (!Array.isArray(myCategories)) {
			return newCategories
		}
		for (let i of myCategories) {
			const category = categories.find((category) => category._id === i)
			if (category) {
				newCategories.push(category)
			}
		}
		return newCategories
	}

	onMount(async () => {
		myCategories = filterToMyCategories(data.identity.categories, data.categories)
		console.log(myCategories)
	})
</script>

<div class="min-w-[414px] flex flex-col justify-center h-screen px-8 py-20 bg-slate-400">
	<div class="flex flex-row justify-between bg-gray-700 h-1/5">
		<button class="flex items-center" type="button" on:click={goProfile}>
			<div class="text-white">Profile</div>
			<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
		</button>

		<button class="flex items-center" type="button" on:click={goHome}>
			<div class="text-white">Home</div>
			<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
		</button>
	</div>
	<div class="grid grid-cols-1 w-full px-4 gap-5 bg-blue-400 h-4/5 content-start py-10">
		{#each myCategories as category}
			<div class="w-full bg-red-600 border-2 rounded-xl h-20">{category.title}</div>
		{/each}
	</div>
</div>
