// import { goto } from '$app/navigation'
// import { PUBLIC_BACKEND_USERS } from '$env/static/public'

export const prerender = true
export const ssr = false

// export async function _handleLogin(username: string, password: string) {
// 	const formData = new FormData()
// 	formData.append('username', username.toLowerCase())
// 	formData.append('password', password)

// 	try {
// 		const response = await fetch(`${PUBLIC_BACKEND_USERS}/token`, {
// 			method: 'POST',
// 			body: formData
// 		})

// 		if (response.ok) {
// 			const data = await response.json()
// 			const { access_token } = data
// 			document.cookie = `access_token=${access_token}; path=/;`
// 			// goto('/home')
// 		} else {
// 			throw new Error('Could not Login/obtain token')
// 		}
// 	} catch (error) {
// 		return false
// 	}
// }
