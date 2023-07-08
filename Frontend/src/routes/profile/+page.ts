import { browser } from '$app/environment'
import { PUBLIC_BACKEND_USERS } from '$env/static/public'

export const load = async ({ fetch }) => {
	const getAccountDetails = async () => {
		let accessToken
		if (browser) {
			accessToken = document.cookie.split('=')[1]
		}
		const response = await fetch(`${PUBLIC_BACKEND_USERS}/accounts/profile/`, {
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
