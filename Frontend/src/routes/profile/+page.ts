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
