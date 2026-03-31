// @ts-nocheck
import { writable } from 'svelte/store';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '$lib/firebase/firebase.client';
import { createCategoryPayload, normalizeCategory, normalizeCategoryWithMigration } from '$models';

export const categoryStore = writable({
	isLoading: true,
	categories: [],
	currentCategory: null
});

const categoriesRef = collection(db, 'categories');

export const categoryHandlers = {
	getCategories: async (categoryIds = []) => {
		if (!isFirebaseConfigured || !db) return [];
		categoryStore.update((curr) => ({ ...curr, isLoading: true }));
		if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
			categoryStore.set({ isLoading: false, categories: [], currentCategory: null });
			return [];
		}
		const snapshot = await getDocs(categoriesRef);
		const all = await Promise.all(
			snapshot.docs.map(async (d) => {
				const { category, migrationPatch } = normalizeCategoryWithMigration(d.id, d.data());
				if (migrationPatch) {
					await updateDoc(doc(db, 'categories', d.id), migrationPatch);
				}
				return category;
			})
		);
		const mine = all.filter((c) => categoryIds.includes(c.id) && c.title !== 'All');
		categoryStore.set({ isLoading: false, categories: mine, currentCategory: null });
		return mine;
	},

	createCategory: async (uid, categoryData) => {
		if (!isFirebaseConfigured || !db) return null;
		const categoryRef = doc(categoriesRef);
		await setDoc(categoryRef, createCategoryPayload(uid, categoryData));
		await setDoc(doc(db, 'users', uid), { categories: arrayUnion(categoryRef.id) }, { merge: true });
		return categoryRef.id;
	},

	updateCategory: async (categoryId, updates) => {
		if (!isFirebaseConfigured || !db || !categoryId) return;
		await setDoc(doc(db, 'categories', categoryId), updates, { merge: true });
		const snapshot = await getDoc(doc(db, 'categories', categoryId));
		if (snapshot.exists()) {
			categoryStore.update((curr) => ({
				...curr,
				categories: curr.categories.map((c) =>
					c.id === categoryId ? normalizeCategory(categoryId, snapshot.data()) : c
				)
			}));
		}
	},

	deleteCategory: async (uid, categoryId) => {
		if (!isFirebaseConfigured || !db || !categoryId) return;
		await deleteDoc(doc(db, 'categories', categoryId));
		await setDoc(doc(db, 'users', uid), { categories: arrayRemove(categoryId) }, { merge: true });
		categoryStore.update((curr) => ({
			...curr,
			categories: curr.categories.filter((c) => c.id !== categoryId)
		}));
	}
};

