// import { goto } from '$app/navigation'
import { user_username } from '$lib/stores'

export const prerender = true

let userUsername = ''

user_username.subscribe((value) => {
	userUsername = value
})

async function getUserDetails() {
	userUsername = userUsername.toLowerCase()
	const response = await fetch(
		`https://accounts-79lp.onrender.com/api/user/username/${userUsername}`
	)
	const data = await response.json()
	return data
}

let user = getUserDetails()

export function load() {
	return {
		user: user
	}
}
