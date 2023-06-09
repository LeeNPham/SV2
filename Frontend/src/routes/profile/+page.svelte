<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { userIdentity } from '$store/stores'
	import { PUBLIC_BACKEND_USERS, PUBLIC_BACKEND_UPLOADS } from '$env/static/public'
	import Categories from '$lib/icons/Categories.svelte'
	import BooksmarksIcon from '$lib/icons/BooksmarksIcon.svelte'
	import PieChart from '$lib/icons/PieChart.svelte'
	import profileDefault from '$lib/images/profileDefault.jpg'
	import NavMenu from '$lib/components/NavMenu.svelte'
	export let data

	let firstName: string
	let lastName: string
	let userID: string
	let userName: string
	let userEmail: string
	let userDescription: string
	let userImage: string
	let fileInput: HTMLInputElement
	let profilePic: Blob | undefined

	async function getProfileImage(photo_id: string): Promise<void> {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_UPLOADS}/files/${photo_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'image/jpg'
				}
				// mode: 'no-cors'
			})
			if (!response.ok) {
				throw new Error('Failed to fetch user profile image')
			}
			const data = await response.blob()
			profilePic = data
		} catch (error) {
			console.error('Failed to get profile image:', error)
		}
	}

	async function updateUserImageId(photo_ID: string): Promise<void> {
		try {
			const putResponse = await fetch(`${PUBLIC_BACKEND_USERS}/api/user/${userID}`, {
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

			console.log("we're done loading the image, so refresh your screen!")
		} catch (error) {
			console.error('Failed to update user imageId:', error)
		}
	}

	const handleFileUpload = async (): Promise<void> => {
		try {
			const file = fileInput.files?.[0]
			if (file) {
				const formData = new FormData()
				formData.append('photo', file)
				const response = await fetch(`${PUBLIC_BACKEND_UPLOADS}/upload-photo`, {
					method: 'POST',
					body: formData
				})

				if (response.ok) {
					const data = await response.json()
					const photoId = data.file_id
					userIdentity.update((user) => {
						return { ...user, photo_id: photoId }
					})
					console.log(userIdentity)
					localStorage.setItem('userIdentity', JSON.stringify(userIdentity))
					await updateUserImageId(photoId)
					console.log('Image successfully updated!')
					window.location.assign('/profile')
				} else {
					console.error('Failed to upload photo')
				}
			}
		} catch (error) {
			console.error('Error occurred during file upload:', error)
		}
	}

	onMount(async () => {
		// console.log(data.user)
		fileInput = document.getElementById('profileImageInput') as HTMLInputElement
		firstName = data.user.first_name
		lastName = data.user.last_name
		userID = data.user._id
		userName = data.user.username
		userEmail = data.user.email
		userDescription = data.user.description
		userImage = data.user.photo_id
		getProfileImage(userImage)
	})
</script>

<div
	class="min-w-[414px] flex justify-center h-screen px-8 pt-10 pb-20 rounded-3xl bg-palette-medium"
>
	<div class="grid grid-cols-1 content-start font-semibold text-2xl text-left w-full px-4">
		<div class="flex flex-row justify-start mb-5 text-[16px]">
			<NavMenu />
		</div>
		<div class="flex flex-row w-full h-full bg-palette-dark rounded-xl p-3">
			{#if profilePic}
				<label for="profileImageInput">
					<img
						class="rounded-full aspect-square w-[90px] border-2 object-cover border-white shadow-white/50 shadow-lg"
						src={URL.createObjectURL(profilePic)}
						alt=""
					/>
				</label>
			{:else}
				<label for="profileImageInput">
					<img
						class="rounded-full aspect-square w-[90px] border-2 border-white shadow-white/50 shadow-lg"
						src={profileDefault}
						alt=""
					/>
				</label>
			{/if}
			<input
				type="file"
				class="border bg-red-600 h-12 hidden"
				id="profileImageInput"
				on:change={handleFileUpload}
			/>

			<div class="grid grid-cols-1 content-start pt-12">
				<span class="text-sm font-semibold pl-5 text-white tracking-wide">{userName}</span>
				<span class="text-sm font-semibold pl-5 text-white tracking-wide">{userEmail}</span>
			</div>
		</div>

		<div class="text-[40px] font-semibold text-white tracking-wide flex flex-col gap-4 py-10">
			<div>{firstName}</div>
			<div>{lastName}</div>
		</div>

		<div class="grid grid-cols-1 h-[450px] content-between">
			<div class="grid grid-cols-1 gap-4">
				<div class="flex flex-row gap-4 items-center">
					<BooksmarksIcon
						Class="fill-palette-dark stroke stroke-palette-dark hover:fill-palette-gray h-5 w-5 ml-0.5"
					/>
					<div
						in:slide={{ axis: 'x', duration: 500 }}
						class=" text-[17px] tracking-wider text-slate-200 font-normal"
					>
						Templates
					</div>
				</div>
				<div class="flex flex-row gap-4 items-center">
					<Categories Class="fill-palette-dark hover:fill-palette-gray h-6 w-6" />
					<div
						in:slide={{ axis: 'x', duration: 500 }}
						class=" text-[17px] tracking-wider text-slate-200 font-normal"
					>
						<a href="/categories">Categories</a>
					</div>
				</div>
				<div class="flex flex-row gap-4 items-center">
					<PieChart Class="fill-palette-dark hover:fill-palette-gray h-6 w-6" />
					<div
						in:slide={{ axis: 'x', duration: 500 }}
						class=" text-[17px] tracking-wider text-slate-200 font-normal"
					>
						Analytics
					</div>
				</div>
				<textarea
					name="userDescription"
					class="text-sm font-semibold pl-5 text-white min-h-[100px] focus:ring-0 focus:border-0 border-0 tracking-wide rounded-md bg-palette-dark"
					>{userDescription}</textarea
				>
			</div>

			<div>
				<div
					in:slide={{ axis: 'x', duration: 500 }}
					class="w-2/3 h-[120px] rounded-xl bg-gradient-to-l from-indigo-500 to-palette-dark shadow-lg shadow-black/80"
				/>
				<div class="text-[14px] font-normal text-palette-lightgray">Good</div>
				<div class="text-white text-[18px] tracking-wider">Consistency</div>
			</div>
		</div>
	</div>
</div>
