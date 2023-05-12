// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

async function getTodos() {
	console.log('trying to get all todos');
	const response = await fetch('http://127.0.0.1:8000/api/todo');
	console.log(response);
	const data = await response.json();
	console.log(data);
	return data;
}

const values = await getTodos();

console.log('hello im values', values);

export function load() {
	return {
		items: values
	};
}
