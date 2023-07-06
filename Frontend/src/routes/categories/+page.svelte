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

<button class="flex items-center" type="button" on:click={goProfile}>
	<div class="text-white">Profile</div>
	<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
</button>

<button class="flex items-center" type="button" on:click={goHome}>
	<div class="text-white">Home</div>
	<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
</button>

<div class="min-w-[414px] flex justify-center h-full px-8 py-20">
	<div class="grid grid-cols-1 w-full px-4 gap-10 bg-blue-400">
		{#each myCategories as category}
			<div class="w-full bg-red-600 border-2 rounded-xl">{category.title}</div>
		{/each}
	</div>
</div>
