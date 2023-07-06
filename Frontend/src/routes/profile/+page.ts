import { browser } from '$app/environment'

export const load = async ({ fetch }) => {
	const getAccountDetails = async () => {
		let accessToken
		if (browser) {
			accessToken = document.cookie.split('=')[1]
		}
		const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
		const data = await response.json()
		return data
	}
	return {
		user: getAccountDetails()
	}
}

// import { user_username } from '$store/stores'
// export const prerender = true

// export async function load({ fetch }) {
// 	let userUsername = ''
// 	user_username.subscribe((value) => {
// 		userUsername = value.toLowerCase()
// 	})
// 	async function getUserDetails() {
// 		const response = await fetch(
// 			`https://accounts-79lp.onrender.com/api/user/username/${userUsername}`
// 		)
// 		const data = await response.json()
// 		return data
// 	}
// 	const user = await getUserDetails()
// 	return {
// 		user: user
// 	}
// }
