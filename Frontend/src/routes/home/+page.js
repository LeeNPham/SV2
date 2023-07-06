// import { userId } from '$store/stores'
import { browser } from '$app/environment'

export const prerender = true
// async function getAccountDetails(accessToken) {
// 	let data = null
// 	if (typeof localStorage !== 'undefined') {
// 		const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/', {
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
		const response = await fetch('https://todo-test-api.onrender.com/api/todo')
		const data = await response.json()
		return data
	}

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
		console.log(accessToken)
		const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
		const data = await response.json()
		return data
	}

	// async function getAccountDetails(fetch) {
	// 	let data = null
	// 	if (typeof localStorage !== 'undefined') {
	// 		const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/', {
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

	return {
		todos: getTodos(),
		categories: getCategories(),
		identity: getAccountDetails()
	}
}
