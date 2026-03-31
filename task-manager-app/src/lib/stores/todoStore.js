// @ts-nocheck
import { writable } from 'svelte/store';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '$lib/firebase/firebase.client';
import { dateInputStringToTimestamp, isFirestoreTimestamp } from '$lib/firebase/timestampFields.js';
import { createTodoPayload, normalizeTodoWithMigration } from '$models';

export const todoStore = writable({
	isLoading: true,
	todos: [],
	currentTodo: null
});

const todosRef = collection(db, 'todos');

/** Coerce UI / legacy string dates into Firestore Timestamp (or null) before writing. */
function sanitizeTodoUpdates(updates) {
	if (!updates || typeof updates !== 'object') return updates;
	const out = { ...updates };
	if ('due_date' in out) {
		const v = out.due_date;
		if (v === null || v === undefined || v === 'null' || v === '') {
			out.due_date = null;
		} else if (typeof v === 'string') {
			out.due_date = dateInputStringToTimestamp(v);
		} else if (!isFirestoreTimestamp(v)) {
			out.due_date = null;
		}
	}
	if ('create_date' in out) {
		const v = out.create_date;
		if (v === null || v === undefined) {
			delete out.create_date;
		} else if (typeof v === 'string') {
			out.create_date = dateInputStringToTimestamp(v) ?? Timestamp.now();
		} else if (!isFirestoreTimestamp(v)) {
			delete out.create_date;
		}
	}
	return out;
}

export const todoHandlers = {
	/**
	 * Load todos for the signed-in user. Prefer matching `userId` on each todo document so tasks
	 * still appear if they were created outside the app or `users/{uid}.todos` was never updated.
	 * Also includes any todo id listed on the user doc (legacy). Optionally backfills missing ids onto the user doc.
	 * @param {string} uid
	 * @param {string[]} [todoIdsFromUserDoc=[]]
	 */
	getTodos: async (uid, todoIdsFromUserDoc = []) => {
		if (!isFirebaseConfigured || !db) return [];
		if (!uid) {
			todoStore.set({ isLoading: false, todos: [], currentTodo: null });
			return [];
		}
		todoStore.update((curr) => ({ ...curr, isLoading: true }));
		const snapshot = await getDocs(todosRef);
		const all = await Promise.all(
			snapshot.docs.map(async (d) => {
				const { todo, migrationPatch } = normalizeTodoWithMigration(d.id, d.data());
				if (migrationPatch) {
					await updateDoc(doc(db, 'todos', d.id), migrationPatch);
				}
				return todo;
			})
		);
		const idsFromUser = Array.isArray(todoIdsFromUserDoc) ? todoIdsFromUserDoc : [];
		const mine = all.filter((t) => {
			if (t.userId === uid) return true;
			return idsFromUser.includes(t.id);
		});
		const idsOnUser = new Set(idsFromUser);
		const missingFromUser = mine.filter((t) => !idsOnUser.has(t.id)).map((t) => t.id);
		if (missingFromUser.length) {
			await setDoc(doc(db, 'users', uid), { todos: arrayUnion(...missingFromUser) }, { merge: true });
		}
		todoStore.set({ isLoading: false, todos: mine, currentTodo: null });
		return mine;
	},

	createTodo: async (uid, todoData) => {
		if (!isFirebaseConfigured || !db) return null;
		const todoRef = doc(todosRef);
		await setDoc(todoRef, createTodoPayload(uid, todoData));
		await setDoc(doc(db, 'users', uid), { todos: arrayUnion(todoRef.id) }, { merge: true });
		return todoRef.id;
	},

	updateTodo: async (todoId, updates) => {
		if (!isFirebaseConfigured || !db || !todoId) return;
		const payload = sanitizeTodoUpdates(updates);
		await updateDoc(doc(db, 'todos', todoId), payload);
		const snapshot = await getDoc(doc(db, 'todos', todoId));
		if (snapshot.exists()) {
			todoStore.update((curr) => ({
				...curr,
				todos: curr.todos.map((t) =>
					t.id === todoId ? normalizeTodoWithMigration(todoId, snapshot.data()).todo : t
				)
			}));
		}
	},

	updateTodoCompletion: async (todoId, completion) => {
		await todoHandlers.updateTodo(todoId, { completion });
	},

	deleteTodo: async (uid, todoId) => {
		if (!isFirebaseConfigured || !db || !todoId) return;
		await deleteDoc(doc(db, 'todos', todoId));
		await setDoc(doc(db, 'users', uid), { todos: arrayRemove(todoId) }, { merge: true });
		todoStore.update((curr) => ({
			...curr,
			todos: curr.todos.filter((t) => t.id !== todoId)
		}));
	}
};
