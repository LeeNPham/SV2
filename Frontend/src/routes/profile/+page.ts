import { user_username } from '$store/stores'

export const prerender = true

export function load() {
	let userUsername = ''

	user_username.subscribe((value) => {
		userUsername = value.toLowerCase()
	})

	async function getUserDetails() {
		const response = await fetch(
			`https://accounts-79lp.onrender.com/api/user/username/${userUsername}`
		)
		const data = await response.json()
		return data
	}

	const user = getUserDetails()

	return {
		user: user
	}
}
