// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

async function getTodos() {
	const response = await fetch('http://127.0.0.1:8000/api/todo');
	const data = await response.json();
	return data;
}

async function getCategories() {
	const response = await fetch('http://127.0.0.1:8000/api/category');
	const data = await response.json();
	return data;
}

let todos = getTodos();
let categories = getCategories();

export function load() {
	return {
		items: todos,
		categories: categories
	};
}
