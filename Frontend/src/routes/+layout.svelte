<script>
	//@ts-nocheck
	import '../app.postcss'
	import { onMount } from 'svelte'
	import { auth, db } from '$lib/firebase/firebase.client'
	// import { authStore, isLoggedIn } from '$lib/stores/authStore';
	import { authStore } from '$lib/stores/authStore'
	import { todoHandlers } from '$lib/stores/todoStore'
	import { getDoc, setDoc, doc } from 'firebase/firestore'

	import Auth from '$lib/components/Auth.svelte'
	import { goto } from '$app/navigation'

	let register = false
	let displayLoginValidator = false
	let forgotPassword = false

	const nonAuthRoutes = ['/', '/aboutUs', '/registration', '/termsOfUse', '/forgot-password']

	let user

	authStore.subscribe((curr) => {
		user = curr?.currentUser
		// console.log('user', user)
	})

	onMount(async () => {
		await todoHandlers.getTodos()

		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname

			if (!user && !nonAuthRoutes.includes(currentPath)) {
				window.location.href = '/'
				return
			}

			if (!user) {
				return
			}

			if (user) {
				let dataToSetToStore
				const docRef = doc(db, 'users', user.uid)
				const docSnap = await getDoc(docRef)

				if (!docSnap.exists()) {
					console.log('Creating/initializing first time User')
					const userRef = doc(db, 'users', user.uid)
					dataToSetToStore = {
						email: user.email,
						profileImage:
							'https://media.istockphoto.com/id/522855255/vector/male-profile-flat-blue-simple-icon-with-long-shadow.jpg', //?
						displayName: user.displayName,
						uid: user.uid,
						phoneNumber: '',
						todos: [],
						admin: false,
						categories: [],
						address: { streetAddress: '', unitNumber: '', state: '', city: '', zipCode: '' }
					}
					await setDoc(userRef, dataToSetToStore, {
						merge: true
					})
				} else {
					const userData = docSnap.data()
					dataToSetToStore = userData
				}

				authStore.update((curr) => {
					return { ...curr, currentUser: user, data: dataToSetToStore, isLoading: false }
				})
				goto('/home')
			}
		})
		return unsubscribe
	})
</script>

<svelte:head>
	<title>SV2 Task Manager</title>
	<meta name="description" content="SV2 Task Manager Home Page" />
</svelte:head>

<div class="app grid grid-cols-1 w-full min-h-screen content-center bg-palette-dark">
	<main class="w-full h-full flex justify-center">
		<div class="max-w-[414px] max-h-[896px] flex flex-col justify-center">
			{#if !user}
				<Auth bind:register bind:displayLoginValidator bind:forgotPassword />
			{:else}
				<slot />
			{/if}
		</div>
	</main>
</div>
