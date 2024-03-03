// @ts-nocheck
import { writable } from 'svelte/store'
import { db } from '$lib/firebase/firebase.client'
import { addDoc, deleteDoc, updateDoc, getDoc, getDocs, collection, doc } from 'firebase/firestore'

export const todoStore = writable({
	isLoading: true,
	todos: [], // Store todo data as an array
	currentTodo: null
})

export const todoHandlers = {
	createTodo: async (todoData) => {
		const todosRef = collection(db, 'todos')
		const newTodoRef = await addDoc(todosRef, todoData)
		return newTodoRef.id
	},

	getTodos: async () => {
		const todosRef = collection(db, 'todos')
		const snapshot = await getDocs(todosRef)
		const todos = []
		snapshot.forEach((doc) => {
			todos.push({ id: doc.id, ...doc.data() })
		})
		todoStore.set({ isLoading: false, todos })
	},

	getTodo: async (todoId) => {
		const todoRef = doc(db, 'todos', todoId)
		const todoDoc = await getDoc(todoRef)
		if (todoDoc.exists()) {
			const todoData = todoDoc.data()
			todoStore.set({ isLoading: false, currentTodo: { id: todoDoc.id, ...todoData } })
		} else {
			todoStore.set({ isLoading: false, currentTodo: null })
		}
	},

	updateTodo: async (todoId, todoData) => {
		const todoRef = doc(db, 'todos', todoId)
		await updateDoc(todoRef, todoData)
	},

	updateTodoCompletion: async (todoId, completion) => {
		const todoRef = doc(db, 'todos', todoId)
		let todoDoc = await getDoc(todoRef)
		todoDoc.completion = completion
		await updateDoc(todoRef, todoDoc)
	},

	deleteTodo: async (todoId) => {
		const todoRef = doc(db, 'todos', todoId)
		await deleteDoc(todoRef)
	}

	// getTodosByTechnicianId: async (technicianId) => {
	// 	const todosRef = collection(db, 'todos')
	// 	const snapshot = await getDocs(todosRef)
	// 	const todos = []
	// 	snapshot.forEach((doc) => {
	// 		if (
	// 			doc?._document?.data?.value?.mapValue?.fields?.technicianId?.stringValue === technicianId
	// 		) {
	// 			todos.push({ id: doc.id, ...doc.data() })
	// 		}
	// 	})
	// 	return todos
	// },

	/**
	 * How to create a todo
	 *
		await todoHandlers.createTodo({
			date: '11-20-2023',
			description:
				'This is the best salon ever. I would come back and get my hair done here again!!!',
			rating: 5,
			todoerName: 'Carlos Rodriguez',
			todoerId: 'kxnDFRkYu5No72KXZOyekAxv0ao1',
			technicianId: 'x5wC5QUT0mQuGFyXc4iLRYHEf5A3',
			salonId: 'ZgsmBp7Rt3RIEMcazi3n'
		});
	 */
}
