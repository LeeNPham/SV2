<script>
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { user_username } from '$store/stores'
	import Categories from '$lib/icons/Categories.svelte'
	import BooksmarksIcon from '$lib/icons/BooksmarksIcon.svelte'
	import PieChart from '$lib/icons/PieChart.svelte'
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'
	import profileDefault from '$lib/images/profileDefault.jpg'
	export let data

	let firstName = data.user.first_name
	let lastName = data.user.last_name
	let userID = data.user._id
	let userName = $user_username
	let userEmail = data.user.email
	let userDescription = data.user.description

	const goHome = () => {
		goto('/home')
	}

	const logout = () => {
		goto('/')
		localStorage.setItem('', '')
	}

	onMount(async () => {
		// console.log($user_username)
		console.log(userID)
		console.log(data)
	})
</script>

<div class="min-w-[414px] flex justify-center h-full px-8 py-20">
	<div class="grid grid-cols-1 content-start font-semibold text-2xl text-left w-full px-4">
		<div class="flex flex-row">
			<img
				class="rounded-full aspect-square w-[90px] border-2 border-white shadow-white/50 shadow-lg"
				src={profileDefault}
				alt=""
			/>
			<div class="grid grid-cols-1 content-start pt-12">
				<span class="text-sm font-semibold pl-5 text-white tracking-wide">{userName}</span>
				<span class="text-sm font-semibold pl-5 text-white tracking-wide">{userEmail}</span>
			</div>
		</div>

		<div class="text-[40px] font-semibold text-white tracking-wide flex flex-col gap-4 py-14">
			<div>{firstName}</div>
			<div>{lastName}</div>
		</div>
		<div class="grid grid-cols-1 h-[450px] content-between">
			<div class="grid grid-cols-1 gap-4">
				<div class="flex flex-row gap-4 items-center">
					<BooksmarksIcon Class="fill-palette-gray hover:fill-palette-gray h-5 w-5 ml-0.5" />
					<div
						in:slide={{ axis: 'x', duration: 500 }}
						class=" text-[17px] tracking-wider text-slate-200 font-normal"
					>
						Templates
					</div>
				</div>
				<div class="flex flex-row gap-4 items-center">
					<Categories Class="fill-palette-gray hover:fill-palette-gray h-6 w-6" />
					<div
						in:slide={{ axis: 'x', duration: 500 }}
						class=" text-[17px] tracking-wider text-slate-200 font-normal"
					>
						<a href="/categories">Categories</a>
					</div>
				</div>
				<div class="flex flex-row gap-4 items-center">
					<PieChart Class="fill-palette-gray hover:fill-palette-gray h-6 w-6" />
					<div
						in:slide={{ axis: 'x', duration: 500 }}
						class=" text-[17px] tracking-wider text-slate-200 font-normal"
					>
						Analytics
					</div>
				</div>
				<textarea
					name="userDescription"
					class="text-sm font-semibold pl-5 text-white focus:ring-0 focus:border-0 border-0 tracking-wide rounded-md bg-palette-medium"
					>{userDescription}</textarea
				>
			</div>

			<div>
				<div
					in:slide={{ axis: 'x', duration: 500 }}
					class="w-2/3 h-[120px] border border-white bg-white/10"
				/>
				<div class="text-[14px] font-normal text-palette-gray">Good</div>
				<div class="text-white text-[18px] tracking-wider">Consistency</div>
			</div>
			<div>
				<button
					on:click={logout}
					type="button"
					class="px-2 py-1 text-white bg-palette-lightgray rounded-md">Logout</button
				>
			</div>
		</div>
	</div>
</div>

<button class="absolute right-10 top-20" type="button" on:click={goHome}>
	<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
</button>
