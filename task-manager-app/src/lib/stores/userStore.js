// @ts-nocheck
import { writable } from 'svelte/store';
import { FirebaseError } from 'firebase/app';
import { PUBLIC_FIREBASE_STORAGE_BUCKET } from '$env/static/public';
import { db, isFirebaseConfigured, storage } from '$lib/firebase/firebase.client';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { normalizeUser } from '$models';

/** User-facing message for Storage upload failures (rules, auth, bucket). */
function storageUploadMessage(err) {
	if (err instanceof FirebaseError) {
		switch (err.code) {
			case 'storage/unauthorized':
			case 'storage/permission-denied':
				return 'Storage blocked the upload. In Firebase Console → Storage → Rules, allow signed-in users to write profile_images/{uid}/...';
			case 'storage/unauthenticated':
				return 'You must be signed in to upload a profile photo.';
			case 'storage/canceled':
				return 'Upload was canceled.';
			case 'storage/invalid-checksum':
			case 'storage/retry-limit-exceeded':
				return 'Upload failed. Check your connection and try again.';
			case 'storage/object-not-found':
				return 'File was not found after upload. Verify PUBLIC_FIREBASE_STORAGE_BUCKET matches your Firebase project.';
			default:
				break;
		}
	}
	return err instanceof Error ? err.message : 'Upload failed';
}

export const userStore = writable({
	isLoading: true,
	currentUser: null
});

const getUserRef = (uid) => doc(db, 'users', uid);

export const userHandlers = {
	clear: () => userStore.set({ isLoading: false, currentUser: null }),

	getUser: async (uid) => {
		if (!isFirebaseConfigured || !db || !uid) return null;
		userStore.update((curr) => ({ ...curr, isLoading: true }));
		const userDoc = await getDoc(getUserRef(uid));
		if (!userDoc.exists()) {
			userStore.set({ isLoading: false, currentUser: null });
			return null;
		}
		const profile = normalizeUser(userDoc.id, userDoc.data());
		userStore.set({ isLoading: false, currentUser: profile });
		return profile;
	},

	updateUser: async (uid, updates) => {
		if (!isFirebaseConfigured || !db || !uid) return null;
		const next = { ...updates, updatedAt: Timestamp.now() };
		await updateDoc(getUserRef(uid), next);
		userStore.update((curr) => ({
			...curr,
			currentUser:
				curr.currentUser?.uid === uid ? { ...curr.currentUser, ...next } : curr.currentUser
		}));
		return next;
	},

	/**
	 * Upload a profile image to Firebase Storage and save URL on the user document.
	 * Path: profile_images/{uid}/{timestamp}_{filename}
	 */
	uploadProfileImage: async (uid, file) => {
		if (!isFirebaseConfigured || !db || !uid || !file) {
			throw new Error('Upload is not available (Firebase or file missing).');
		}
		if (!PUBLIC_FIREBASE_STORAGE_BUCKET) {
			throw new Error(
				'Set PUBLIC_FIREBASE_STORAGE_BUCKET in .env (Firebase Console → Project settings → Your apps → Storage bucket). Restart the dev server after changing .env.'
			);
		}
		if (!storage) {
			throw new Error('Firebase Storage failed to initialize. Check PUBLIC_FIREBASE_* env vars and restart.');
		}
		const safeName = file.name.replace(/[^\w.\-]/g, '_');
		const storageRef = ref(storage, `profile_images/${uid}/${Date.now()}_${safeName}`);
		try {
			await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
			const profileImage = await getDownloadURL(storageRef);
			await userHandlers.updateUser(uid, { profileImage });
			return profileImage;
		} catch (err) {
			throw new Error(storageUploadMessage(err));
		}
	}
};

