// @ts-nocheck
import { Timestamp } from 'firebase/firestore';

export const createUserProfile = (authUser) => ({
	uid: authUser.uid,
	email: authUser.email ?? '',
	displayName: authUser.displayName ?? '',
	profileImage: authUser.photoURL ?? '',
	admin: false,
	description: '',
	todos: [],
	categories: ['All'],
	createdAt: Timestamp.now(),
	updatedAt: Timestamp.now()
});

export const normalizeUser = (id, data = {}) => ({
	id,
	uid: data.uid ?? id,
	email: data.email ?? '',
	displayName: data.displayName ?? '',
	profileImage: data.profileImage ?? '',
	admin: Boolean(data.admin),
	description: data.description ?? '',
	todos: Array.isArray(data.todos) ? data.todos : [],
	categories: Array.isArray(data.categories) ? data.categories : ['All'],
	createdAt: data.createdAt ?? null,
	updatedAt: data.updatedAt ?? null
});

