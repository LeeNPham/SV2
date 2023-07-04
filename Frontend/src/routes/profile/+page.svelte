<script>
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { user_username} from '$store/stores'
	import Categories from '$lib/icons/Categories.svelte'
	import BooksmarksIcon from '$lib/icons/BooksmarksIcon.svelte'
	import PieChart from '$lib/icons/PieChart.svelte'
	import ChevronWithLeftCircle from '$lib/icons/ChevronWithLeftCircle.svelte'
	import profileDefault from '$lib/images/profileDefault.jpg'
	// export let data

	const goHome = () => {
		goto('/home')
	}

	const logout = () => {
		goto('/')
		localStorage.clear()

	}
	let firstName
	let lastName
	let userID
	let userName
	let userEmail
	let userDescription
	let userImage
	let fileInput


async function getProfileImage(photo_id) {
	const response = await fetch(`https://backend-uploads.onrender.com/files/${photo_id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'image/jpg'
		}
	})
	if (!response.ok) {
		throw new Error('Failed to fetch user todo list')
	}
	const data = await response.blob()
	console.log('data,', data)
	return data
}



async function updateUserImageId(photo_ID) {
	const putResponse = await fetch(`https://accounts-79lp.onrender.com/api/user/${userID}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					photo_id: photo_ID
				})
			})
			if (!putResponse.ok) {
				throw new Error('Failed to update user imageId')
			}
}

const handleFileUpload = async () => {
	const file = fileInput.files[0]
	if (file) {
		const formData = new FormData()
		formData.append('photo', file)
		const response = await fetch('https://backend-uploads.onrender.com/upload-photo', {
				method: 'POST',
				body: formData
			})
		if (response.ok) {
			const data = await response.json()
			const photoId = data.file_id
			await updateUserImageId(photoId)
		} else {
			console.error('Failed to upload photo')
		}
	}
}


	onMount(async () => {
		fileInput = document.getElementById('profileImageInput')
		const userIdentity = JSON.parse(localStorage.getItem('userIdentity'));
		console.log(userIdentity)
		firstName = userIdentity.first_name
		lastName = userIdentity.last_name
		userID = userIdentity._id
		userName = userIdentity.username
		userEmail = userIdentity.email
		userDescription = userIdentity.description
		userImage = userIdentity.photo_id
	})
</script>

<div class="min-w-[414px] flex justify-center h-full px-8 py-20">
	<div class="grid grid-cols-1 content-start font-semibold text-2xl text-left w-full px-4">
		<div class="flex flex-row">
			{#await getProfileImage(userImage)}
				<img
					class="rounded-full aspect-square w-[90px] border-2 border-white shadow-white/50 shadow-lg"
					src={profileDefault}
					alt=""
				/>
			{:then profilePic}
				<img
					class="rounded-full aspect-square w-[90px] border-2 border-white shadow-white/50 shadow-lg"
					src={URL.createObjectURL(profilePic)}
					alt=""
				/>
			{/await}

			<div class="grid grid-cols-1 content-start pt-12">
				<span class="text-sm font-semibold pl-5 text-white tracking-wide">{userName}</span>
				<span class="text-sm font-semibold pl-5 text-white tracking-wide">{userEmail}</span>
			</div>
		</div>






		<div class="text-[40px] font-semibold text-white tracking-wide flex flex-col gap-4 py-14">
			<div>{firstName}</div>
			<div>{lastName}</div>
		</div>

		<input type="file" class='border bg-red-600 h-12' id="profileImageInput" on:change={handleFileUpload} />


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
