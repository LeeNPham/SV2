// import { userId } from '$store/stores'
import { browser } from '$app/environment'

export const prerender = true

export const load = async ({ fetch }) => {
	const getCategories = async () => {
		const response = await fetch('https://todo-test-api.onrender.com/api/category')
		const data = await response.json()
		return data
	}

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
		categories: getCategories(),
		identity: getAccountDetails()
	}
}
