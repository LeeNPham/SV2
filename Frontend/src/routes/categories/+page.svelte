<script lang="ts">
	import { goto } from '$app/navigation'

	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'
	import { slide } from 'svelte/transition'
	import profileDefault from '$lib/images/profileDefault.jpg'

	let userName = 'Bladeburner01'
	let userEmail = 'Bladeburner01@gmail.com'

	function goProfile() {
		goto('/profile')
	}

	function goHome() {
		goto('/')
	}
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
	</div>
</div>

<button class="absolute right-10 top-20" type="button" on:click={goProfile}>
	<div class="text-white">Profile</div>
	<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
</button>

<button class="absolute right-10 top-40" type="button" on:click={goHome}>
	<div class="text-white">Home</div>
	<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
</button>
