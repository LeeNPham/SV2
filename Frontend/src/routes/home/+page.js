// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { goto } from '$app/navigation'

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
	const cookie = getAccessToken()
	console.log('coooooookie')

	const response = await fetch('http://127.0.0.1:8000/accounts/profile/items', {
		headers: {
			Authorization: `Bearer ${cookie}`
		}
	})
	const data = await response.json()
	return data
}

function getAccessToken() {
	const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('access_token='))
	if (cookieValue) {
		return cookieValue.split('=')[1]
	}
	goto('/login')
}
let stuff = getAccountItems()
let todos = getTodos()
let categories = getCategories()

export function load() {
	return {
		items: todos,
		categories: categories,
		stuff: stuff
	}
}
