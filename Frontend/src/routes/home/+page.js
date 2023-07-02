// @ts-nocheck
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { token, userId } from '$lib/stores'

let accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null

// Subscribe to updates of the token store
token.subscribe((value) => {
	accessToken = value.access_token
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('accessToken', accessToken)
	}
})

export const prerender = true

async function getTodos(fetch) {
	const response = await fetch('https://todo-test-api.onrender.com/api/todo')
	const data = await response.json()
	return data
}

async function getCategories(fetch) {
	const response = await fetch('https://todo-test-api.onrender.com/api/category')
	const data = await response.json()
	return data
}

async function getAccountItems(fetch) {
	const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/items', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
	const data = await response.json()
	return data
}

async function getAccountDetails(fetch) {
	const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
	const data = await response.json()
	userId.set(data._id)
	return data
}

export async function load({ fetch }) {
	const [todos, categories, stuff, identity] = await Promise.all([
		getTodos(fetch),
		getCategories(fetch),
		getAccountItems(fetch),
		getAccountDetails(fetch)
	])

	return {
		items: todos,
		categories: categories,
		stuff: stuff,
		identity: identity
	}
}
