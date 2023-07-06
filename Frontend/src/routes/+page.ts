import { goto } from '$app/navigation'

export async function _handleLogin(username: string, password: string) {
	const formData = new FormData()
	formData.append('username', username)
	formData.append('password', password)

	try {
		const response = await fetch('https://accounts-79lp.onrender.com/token', {
			method: 'POST',
			body: formData
		})

		if (response.ok) {
			const data = await response.json()
			const { access_token } = data
			document.cookie = `access_token=${access_token}; path=/;`
			goto('/home')
		} else {
			throw new Error('Could not Login/obtain token')
		}
	} catch (error) {
		console.error(error)
	}
}
