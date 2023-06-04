// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
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

let todos = getTodos()
let categories = getCategories()

export function load() {
	return {
		items: todos,
		categories: categories
	}
}
