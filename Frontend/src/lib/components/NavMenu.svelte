<script>
	import {
		Drawer,
		CloseButton,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import MenuIcon from '$lib/icons/MenuIcon.svelte'
	import Categories from '$lib/icons/Categories.svelte'
	import { categoriesCountStore, isLoggedIn } from '$store/stores'
	import { goto } from '$app/navigation'
	import HouseIcon from '$lib/icons/HouseIcon.svelte'
	import ProfileIcon from '$lib/icons/ProfileIcon.svelte'

	let hidden2 = true

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	}

	const logout = () => {
		hidden2 = true
		$isLoggedIn = false
	}
</script>

<div class="text-center">
	<button on:click={() => (hidden2 = false)}
		><MenuIcon Class="fill-palette-lightgray hover:fill-palette-lightgray/50 h-8 w-8" /></button
	>
</div>
<Drawer
	transitionType="fly"
	{transitionParams}
	bind:hidden={hidden2}
	divClass="overflow-y-auto z-50 p-4 bg-palette-lightgray dark:bg-gray-800 rounded-r-3xl"
	id="sidebar2"
>
	<div class="flex items-center">
		<h5
			id="drawer-navigation-label-3"
			class="text-lg font-bold text-palette-dark uppercase dark:text-gray-400"
		>
			Menu
		</h5>
		<CloseButton on:click={() => (hidden2 = true)} class="mb-4 dark:text-white" />
	</div>
	<Sidebar>
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
			<SidebarGroup ulClass="flex flex-col">
				<a
					href="/home"
					on:click={() => (hidden2 = true)}
					class="flex flex-row items-center gap-4 hover:bg-palette-medium rounded-xl px-2 py-1"
				>
					<HouseIcon />
					<div class="font-semibold">Home</div>
				</a>

				<a
					href="/profile"
					on:click={() => (hidden2 = true)}
					class="flex flex-row items-center gap-4 hover:bg-palette-medium rounded-xl px-2 py-1"
				>
					<ProfileIcon />
					<div class="font-semibold">Profile</div>
				</a>

				<a
					href="/categories"
					on:click={() => (hidden2 = true)}
					class="flex flex-row items-center gap-4 hover:bg-palette-medium rounded-xl px-2 py-1"
				>
					<Categories Class="fill-palette-dark hover:fill-palette-gray h-[25px] w-[25px] ml-0.5" />
					<div class="font-semibold">Categories</div>
					<span
						class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"
						>{$categoriesCountStore}</span
					>
				</a>

				<a
					href="/"
					on:click={logout}
					class="flex flex-row items-center gap-4 hover:bg-palette-medium rounded-xl px-2 py-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="w-[25px] [25px] ml-0.5 stroke-2 stroke-palette-dark fill-none"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
						/></svg
					>
					<div class="font-semibold">Logout</div>
				</a>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>
