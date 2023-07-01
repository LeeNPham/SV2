// @ts-nocheck
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { token } from '$lib/stores'

let accessToken

// Subscribe to updates of the token store
token.subscribe((value) => {
	accessToken = value.access_token
})

export const prerender = true

async function getTodos() {
	const response = await fetch('https://todo-test-api.onrender.com/api/todo')
	const data = await response.json()
	return data
}

async function getCategories() {
	const response = await fetch('https://todo-test-api.onrender.com/api/category')
	const data = await response.json()
	return data
}

async function getAccountItems() {
	const response = await fetch('https://accounts-79lp.onrender.com/accounts/profile/items', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
	const data = await response.json()
	return data
}

export async function load() {
	const [todos, categories, stuff] = await Promise.all([
		getTodos(),
		getCategories(),
		getAccountItems()
	])

	return {
		items: todos,
		categories: categories,
		stuff: stuff
	}
}
