// @ts-nocheck
import { writable } from 'svelte/store'
import { db } from '$lib/firebase/firebase.client'
import { addDoc, deleteDoc, updateDoc, getDoc, getDocs, collection, doc } from 'firebase/firestore'

export const categoryStore = writable({
	isLoading: true,
	categories: [], // Store category data as an array
	currentCategory: null
})

export const categoryHandlers = {
	createCategory: async (categoryData) => {
		const categoriesRef = collection(db, 'categories')
		const newCategoryRef = await addDoc(categoriesRef, categoryData)
		return newCategoryRef.id
	},

	getCategories: async () => {
		const categoriesRef = collection(db, 'categories')
		const snapshot = await getDocs(categoriesRef)
		const categories = []
		snapshot.forEach((doc) => {
			categories.push({ id: doc.id, ...doc.data() })
		})
		categoryStore.set({ isLoading: false, categories })
	},

	getCategory: async (categoryId) => {
		const categoryRef = doc(db, 'categories', categoryId)
		const categoryDoc = await getDoc(categoryRef)
		if (categoryDoc.exists()) {
			const categoryData = categoryDoc.data()
			categoryStore.set({
				isLoading: false,
				currentCategory: { id: categoryDoc.id, ...categoryData }
			})
		} else {
			categoryStore.set({ isLoading: false, currentCategory: null })
		}
	},

	updateCategory: async (categoryId, categoryData) => {
		const categoryRef = doc(db, 'categories', categoryId)
		await updateDoc(categoryRef, categoryData)
	},

	deleteCategory: async (categoryId) => {
		const categoryRef = doc(db, 'categories', categoryId)
		await deleteDoc(categoryRef)
	}
}
