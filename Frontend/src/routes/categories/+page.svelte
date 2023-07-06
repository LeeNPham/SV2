<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { slide } from 'svelte/transition'
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'
	export let data
	import MenuIcon from '$lib/icons/MenuIcon.svelte'

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

	let list1 = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 30
	]

	onMount(async () => {
		myCategories = filterToMyCategories(data.identity.categories, data.categories)
		console.log(myCategories)
	})
</script>

<div
	class="min-w-[414px] flex flex-col justify-center h-screen px-8 py-10 bg-slate-400 rounded-3xl"
>
	<div class="flex flex-row items-start justify-between bg-gray-700 h-1/10">
		<MenuIcon Class="fill-palette-lightgray hover:fill-palette-lightgray/50 h-8 w-8" />
		<a href="/profile" class="text-white">Profile</a>

		<a href="/home" class="text-white">Home</a>
	</div>
	<div class="flex justify-center text-white font-bold text-3xl">My Categories</div>
	<button class="text-white bg-palette-dark rounded-lg my-2 py-2">+ Category</button>
	<div
		class="grid grid-cols-2 w-full gap-5 bg-palette-lightgray h-4/5 content-start py-10 overflow-y-scroll"
	>
		<!-- {#each myCategories as category}
			<div class="w-full bg-red-600 border-2 rounded-xl h-20">{category.title}</div>
		{/each} -->

		{#each list1 as category}
			<div class="w-full bg-palette-dark text-white rounded-2xl h-32 shadow-inner">{category}</div>
		{/each}
	</div>
</div>
