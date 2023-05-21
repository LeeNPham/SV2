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

// let todos = getTodos();
// let categories = getCategories();

// export function load() {
// 	return {
// 		items: todos,
// 		categories: categories
// 	};
// }

export function load() {
	return {
		"items": [
			{
				"_id": "6469316cae1bb5277a4d6cee",
				"category": "Business",
				"title": "Business todo1",
				"description": "This is my business todo-1",
				"completion": true,
				"create_date": "2023-05-20",
				"due_date": "2023-05-19"
			},
			{
				"_id": "646931b6ae1bb5277a4d6cf0",
				"category": "Business",
				"title": "Business todo2",
				"description": "new todo",
				"completion": true,
				"create_date": "2023-05-20",
				"due_date": "2023-05-21"
			},
			{
				"_id": "646931c6ae1bb5277a4d6cf1",
				"category": "Business",
				"title": "Business todo3",
				"description": "new todo",
				"completion": false,
				"create_date": "2023-05-20",
				"due_date": "2023-05-20"
			},
			{
				"_id": "646931dfae1bb5277a4d6cf2",
				"category": "Personal",
				"title": "Personal todo1",
				"description": "new todo",
				"completion": false,
				"create_date": "2023-05-20",
				"due_date": "2023-05-26"
			},
			{
				"_id": "646931f6ae1bb5277a4d6cf3",
				"category": "Personal",
				"title": "Personal todo2",
				"description": "new todo",
				"completion": true,
				"create_date": "2023-05-20",
				"due_date": "2023-05-25"
			},
			{
				"_id": "64693213ae1bb5277a4d6cf4",
				"category": "Personal",
				"title": "Personal todo3",
				"description": "new todo",
				"completion": false,
				"create_date": "2023-05-20",
				"due_date": "2023-06-01"
			},
			{
				"_id": "6469555c43c72e044bae13cb",
				"category": "",
				"title": "General Todo1",
				"description": "todo description",
				"completion": false,
				"create_date": "2023-05-20",
				"due_date": "2023-05-18"
			},
			{
				"_id": "646a790d4cf092b219922606",
				"category": "Cosplay",
				"title": "Cosplay todo",
				"description": "dfs",
				"completion": false,
				"create_date": "2023-05-21",
				"due_date": "2023-05-22"
			}
		],
		"categories": [
			{
				"_id": "646925caae1bb5277a4d6cec",
				"title": "Business",
				"description": "This is a business category",
				"create_date": "2023-05-20"
			},
			{
				"_id": "6469b5eb4cf092b219922604",
				"title": "Personal",
				"description": "123",
				"create_date": "2023-05-21"
			},
			{
				"_id": "6469b6104cf092b219922605",
				"title": "Cosplay",
				"description": "213",
				"create_date": "2023-05-21"
			},
			{
				"_id": "646a79574cf092b219922607",
				"title": "clothing",
				"description": "",
				"create_date": "2023-05-21"
			}
		]
	}
}
