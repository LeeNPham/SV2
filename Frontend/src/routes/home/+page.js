// import { userId } from '$store/stores'
import { browser } from '$app/environment'
import { PUBLIC_BACKEND_USERS, PUBLIC_BACKEND_TODOS } from '$env/static/public'

export const prerender = true
// async function getAccountDetails(accessToken) {
// 	let data = null
// 	if (typeof localStorage !== 'undefined') {
// 		const response = await fetch(`${PUBLIC_BACKEND-USERS}/accounts/profile`, {
// 			headers: {
// 				Authorization: `Bearer ${accessToken}`
// 			}
// 		})
// 		data = await response.json()
// 		localStorage.setItem('userIdentity', JSON.stringify(data))
// 		userId.set(data._id)
// 		return data
// 	}
// }

export const load = async ({ fetch }) => {
	const getTodos = async () => {
		const response = await fetch(`${PUBLIC_BACKEND_TODOS}/api/todo`)
		const data = await response.json()
		return data
	}

	const getCategories = async () => {
		const response = await fetch(`${PUBLIC_BACKEND_TODOS}/api/category`)
		const data = await response.json()
		return data
	}

	const getAccountDetails = async () => {
		let accessToken
		if (browser) {
			accessToken = document.cookie.split('=')[1]
			console.log('accesstoken within my homes +page.js', accessToken.split('.'))
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
		todos: getTodos(),
		categories: getCategories(),
		identity: getAccountDetails()
	}
}
