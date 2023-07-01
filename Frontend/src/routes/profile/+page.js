// import { goto } from '$app/navigation'
import { user_username } from '$lib/stores'

export const prerender = true

let userUsername = ''

user_username.subscribe((value) => {
	userUsername = value
})

async function getUserDetails() {
	userUsername = userUsername.toLowerCase()
	const response = await fetch(`http://127.0.0.1:8000/api/user/username/${userUsername}`)
	const data = await response.json()
	return data
}

let user = getUserDetails()

export function load() {
	return {
		user: user
	}
}
