<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { slide } from 'svelte/transition'
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'
	export let data
	import MenuIcon from '$lib/icons/MenuIcon.svelte'
	import NavMenu from '$lib/components/NavMenu.svelte'

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

	const dummyData = [
		{
			create_date: '2023-06-04',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Personal',
			_id: '647c61a7f3250a39f366376c'
		},
		{
			create_date: '2023-06-05',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Work',
			_id: '8c3a4f6b24ed7b35e92b087f'
		},
		{
			create_date: '2023-06-06',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Shopping',
			_id: '152b3a7f6e98dc4a7c5f9123'
		},
		{
			create_date: '2023-06-07',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Hobbies',
			_id: '9876534c1a9fb2de0cf36479'
		},
		{
			create_date: '2023-06-08',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Travel',
			_id: 'fe7c345ae192db9c674f23a1'
		},
		{
			create_date: '2023-06-09',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Fitness',
			_id: 'bc6f293e819d54a8c762398f'
		},
		{
			create_date: '2023-06-10',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Books',
			_id: 'a754f239bf6e8d21c3672948'
		},
		{
			create_date: '2023-06-11',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Recipes',
			_id: '2d8bfa4e7c39f65421a6c73f'
		},
		{
			create_date: '2023-06-12',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Music',
			_id: '743c8bf5217e63a49fde145c'
		},
		{
			create_date: '2023-06-13',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Movies',
			_id: '49e7c345df90a84b76e126c4'
		},
		{
			create_date: '2023-06-14',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Art',
			_id: 'a2b65e18f304d79c7c981532'
		},
		{
			create_date: '2023-06-15',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Sports',
			_id: '674e3289bcf531d4672a7f35'
		},
		{
			create_date: '2023-06-16',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Photography',
			_id: '5d98bfc743f6e210a2c7594b'
		},
		{
			create_date: '2023-06-17',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Education',
			_id: 'fd476b8a325c9123c5f69d7e'
		},
		{
			create_date: '2023-06-18',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Technology',
			_id: 'a5c92f8e146739bc54321dfe'
		},
		{
			create_date: '2023-06-19',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Nature',
			_id: '93247bf56c189a4e70d1c2f8'
		},
		{
			create_date: '2023-06-20',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Gardening',
			_id: '8d3f6b4a29571c29c7e10fb5'
		},
		{
			create_date: '2023-06-21',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Finance',
			_id: 'e3a7f245d9c63124b8f60e9c'
		},
		{
			create_date: '2023-06-22',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Social Media',
			_id: '75bdc21f9e8a3547f36a9c80'
		},
		{
			create_date: '2023-06-23',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Fashion',
			_id: 'b3e7629c4710f5a8648c2f1d'
		},
		{
			create_date: '2023-06-24',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Food',
			_id: 'c45e7f239d318a6b09527c4d'
		},
		{
			create_date: '2023-06-25',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Pets',
			_id: '3e7a819d5f42c60b4c9836f7'
		},
		{
			create_date: '2023-06-26',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Home Decor',
			_id: '9824c3f1b5e6d7a0497f38a2'
		},
		{
			create_date: '2023-06-27',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'Health',
			_id: 'a7f3e68c495d10b6f72c41e9'
		},
		{
			create_date: '2023-06-28',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			title: 'DIY',
			_id: 'fa932b9a872d1e2c64c1833a'
		}
	]

	onMount(async () => {
		myCategories = filterToMyCategories(data.identity.categories, data.categories)
		console.log(myCategories)
	})
</script>

<div
	class="min-w-[414px] flex flex-col justify-center h-screen px-8 py-10 bg-palette-medium rounded-3xl"
>
	<div class="flex flex-row items-start justify-between h-1/10">
		<NavMenu />
	</div>
	<div class="flex justify-center tracking-wider text-white font-bold text-3xl">My Categories</div>
	<button class="text-white bg-palette-dark hover:bg-palette-dark/50 rounded-lg my-2 py-2"
		>+ Category</button
	>
	<div class="grid grid-cols-2 w-full gap-4 h-4/5 content-start py-8 overflow-y-scroll">
		{#each myCategories as category}
			<div
				class="w-full bg-palette-dark text-white rounded-2xl h-[130px] shadow-inner overflow-clip p-3"
			>
				<div class="flex flex-col px-2">
					<div class="w-full font-bold text-center whitespace-nowrap">{category.title}</div>
					<div class="text-left text-palette-lightgray indent-4 text-sm">
						{category.description}
					</div>
				</div>
			</div>
		{/each}

		<!-- {#each dummyData as category}
			<div
				class="w-full bg-palette-dark text-white rounded-2xl h-[130px] shadow-inner overflow-clip p-3"
			>
				<div class="flex flex-col px-2">
					<div class="w-full font-bold text-center whitespace-nowrap">{category.title}</div>
					<div class="text-left text-palette-lightgray indent-4 text-sm">
						{category.description}
					</div>
				</div>
			</div>
		{/each} -->
	</div>
</div>
