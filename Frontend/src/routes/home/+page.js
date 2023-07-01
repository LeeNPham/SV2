// @ts-nocheck
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { token, user_description, user_username } from '$lib/stores'

let accessToken
let userDescription
let userUsername

user_username.subscribe((value) => {
	userUsername = value
})

user_description.subscribe((value) => {
	userDescription = value
})

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
	console.log('hello world')
	console.log(userDescription)
	console.log(userUsername)
	const response = await fetch('http://127.0.0.1:8000/accounts/profile/items', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
	const data = await response.json()
	return data
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
