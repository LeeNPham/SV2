<script>
	import { goto } from '$app/navigation'
	import {
		Drawer,
		Button,
		CloseButton,
		Sidebar,
		SidebarBrand,
		SidebarCta,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'
	import MenuIcon from '$lib/icons/MenuIcon.svelte'
	import Categories from '$lib/icons/Categories.svelte'

	let hidden2 = true
	let spanClass = 'flex-1 ml-3 whitespace-nowrap'
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	}

	function goProfile() {
		window.location.assign('/profile')
	}

	function goHome() {
		window.location.assign('/home')
	}

	function goCategories() {
		window.location.assign('/categories')
	}
	const logout = () => {
		window.location.assign('/')
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
				<button on:click={goHome}>
					<SidebarItem label="Home">
						<svelte:fragment slot="icon">
							<svg
								viewBox="0 0 24 24"
								focusable="false"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								class="fill-palette-dark hover:fill-palette-gray h-7 w-7"
								><path
									d="m12.223 11.641-.223.22-.224-.22a2.224 2.224 0 0 0-3.125 0 2.13 2.13 0 0 0 0 3.07L12 18l3.349-3.289a2.13 2.13 0 0 0 0-3.07 2.225 2.225 0 0 0-3.126 0z"
								/><path
									d="m21.707 11.293-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707zM18.001 20H6v-9.585l6-6 6 6V15l.001 5z"
								/></svg
							>
						</svelte:fragment>
					</SidebarItem>
				</button>
				<button on:click={goProfile}>
					<SidebarItem label="Profile">
						<svelte:fragment slot="icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/></svg
							>
						</svelte:fragment>
					</SidebarItem>
				</button>
				<button on:click={goCategories}>
					<SidebarItem label="Categories">
						<svelte:fragment slot="icon">
							<Categories Class="fill-palette-dark hover:fill-palette-gray h-6 w-6" />
						</svelte:fragment>
						<svelte:fragment slot="subtext">
							<span
								class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"
								>3</span
							>
						</svelte:fragment>
					</SidebarItem>
				</button>
				<button on:click={logout}>
					<SidebarItem label="Log out">
						<svelte:fragment slot="icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/></svg
							>
						</svelte:fragment>
					</SidebarItem>
				</button>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>
