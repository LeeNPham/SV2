// import { userId } from '$store/stores'
import { browser } from '$app/environment'
import { PUBLIC_BACKEND_USERS, PUBLIC_BACKEND_TODOS } from '$env/static/public'

export const prerender = true

export const load = async ({ fetch }) => {
	const getCategories = async () => {
		const response = await fetch(`${PUBLIC_BACKEND_TODOS}/api/category`)
		const data = await response.json()
		return data
	}

	const getAccountDetails = async () => {
		let accessToken
		if (browser) {
			accessToken = document.cookie.split('=')[1]
		}
		const response = await fetch(`${PUBLIC_BACKEND_USERS}/accounts/profile`, {
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
