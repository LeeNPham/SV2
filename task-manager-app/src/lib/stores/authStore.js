// @ts-nocheck
import { derived, writable } from 'svelte/store';
import { auth, db, googleProvider, isFirebaseConfigured } from '$lib/firebase/firebase.client';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithPopup,
	signInWithEmailAndPassword,
	signOut,
	updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { userHandlers } from '$lib/stores/userStore';
import { createAuthState, createUserProfile, normalizeUser } from '$models';

export const authStore = writable(createAuthState());

let hasAuthListener = false;
let unsubscribe = null;

const ensureUserProfile = async (user) => {
	const userRef = doc(db, 'users', user.uid);
	const snapshot = await getDoc(userRef);
	if (snapshot.exists()) {
		return normalizeUser(snapshot.id, snapshot.data());
	}
	const initial = createUserProfile(user);
	await setDoc(userRef, initial, { merge: true });
	return normalizeUser(user.uid, initial);
};

export const authHandlers = {
	initAuthListener: () => {
		if (!isFirebaseConfigured || !auth || !db) {
			authStore.set({ ...createAuthState(), isLoading: false });
			return () => {};
		}

		if (hasAuthListener && unsubscribe) return unsubscribe;

		hasAuthListener = true;
		unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				authStore.set({ ...createAuthState(), isLoading: false });
				userHandlers.clear();
				return;
			}
			const profile = await ensureUserProfile(user);
			authStore.set({ isLoading: false, currentUser: user, data: profile });
			await userHandlers.getUser(user.uid);
		});

		return unsubscribe;
	},

	signup: async (email, password, displayName) => {
		if (!isFirebaseConfigured || !auth) {
			throw new Error('Firebase is not configured. Add PUBLIC_FIREBASE_* env vars.');
		}
		const credential = await createUserWithEmailAndPassword(auth, email, password);
		if (displayName) {
			await updateProfile(credential.user, { displayName });
		}
		return credential.user;
	},

	login: async (email, password) => {
		if (!isFirebaseConfigured || !auth) {
			throw new Error('Firebase is not configured. Add PUBLIC_FIREBASE_* env vars.');
		}
		await signInWithEmailAndPassword(auth, email, password);
	},
	loginWithGoogle: async () => {
		if (!isFirebaseConfigured || !auth) {
			throw new Error('Firebase is not configured. Add PUBLIC_FIREBASE_* env vars.');
		}
		await signInWithPopup(auth, googleProvider);
	},

	logout: async () => {
		if (!auth) return;
		await signOut(auth);
	},

	resetPassword: async (email) => {
		if (!isFirebaseConfigured || !auth) {
			throw new Error('Firebase is not configured. Add PUBLIC_FIREBASE_* env vars.');
		}
		await sendPasswordResetEmail(auth, email);
	}
};

export const isLoggedIn = derived(authStore, ($auth) => Boolean($auth.currentUser));

