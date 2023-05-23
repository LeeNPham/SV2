<script>
	import { goto } from '$app/navigation'
	import Categories from '$lib/icons/Categories.svelte'
	import BooksmarksIcon from '$lib/icons/BooksmarksIcon.svelte'
	import PieChart from '$lib/icons/PieChart.svelte'
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'

	let firstName = 'Lee'
	let lastName = 'Pham'
	let userName = 'Bladeburner01'
	let userEmail = 'Bladeburner01@gmail.com'
	let name = firstName + ' ' + lastName
	let userPassword = 'Password123!'
	let userDescription =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

	function goHome() {
		goto('/')
	}
</script>

<div class="min-w-[414px] flex justify-center h-full px-8 py-20">
	<div class="grid grid-cols-1 content-start font-semibold text-2xl text-left w-full px-4">
		<div class="flex flex-row">
			<img
				class="rounded-full aspect-square w-[90px] border-2 border-white shadow-white/50 shadow-lg"
				src="https://media.licdn.com/dms/image/D5603AQG-mY_44Scwyg/profile-displayphoto-shrink_200_200/0/1666621097857?e=1690416000&v=beta&t=7UrcE6PLt9svm02pLYv-YivCe3Ly5UhBcq0q4t-WNbs"
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
					<div class=" text-[17px] tracking-wider text-slate-200 font-normal">Templates</div>
				</div>
				<div class="flex flex-row gap-4 items-center">
					<Categories Class="fill-palette-gray hover:fill-palette-gray h-6 w-6" />
					<div class=" text-[17px] tracking-wider text-slate-200 font-normal">Categories</div>
				</div>
				<div class="flex flex-row gap-4 items-center">
					<PieChart Class="fill-palette-gray hover:fill-palette-gray h-6 w-6" />
					<div class=" text-[17px] tracking-wider text-slate-200 font-normal">Analytics</div>
				</div>
			</div>

			<div>
				<div class="w-2/3 h-[120px] border border-white" />
				<div class="text-[14px] font-normal text-palette-gray">Good</div>
				<div class="text-white text-[18px] tracking-wider">Consistency</div>
			</div>
		</div>
	</div>
</div>

<button class="absolute right-10 top-20" type="button" on:click={goHome}>
	<ChevronWithLeftCircle Class="fill-palette-gray/80 h-14 w-14" />
</button>
