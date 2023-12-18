// @ts-nocheck
import { writable } from 'svelte/store'
import { db } from '$lib/firebase/firebase.client'
import { addDoc, deleteDoc, updateDoc, getDoc, getDocs, collection, doc } from 'firebase/firestore'

export const reviewStore = writable({
	isLoading: true,
	reviews: [], // Store review data as an array
	currentReview: null
})

export const reviewHandlers = {
	getReviews: async () => {
		const reviewsRef = collection(db, 'reviews')
		const snapshot = await getDocs(reviewsRef)
		const reviews = []
		snapshot.forEach((doc) => {
			reviews.push({ id: doc.id, ...doc.data() })
		})
		reviewStore.set({ isLoading: false, reviews })
	},

	getReview: async (reviewId) => {
		const reviewRef = doc(db, 'reviews', reviewId)
		const reviewDoc = await getDoc(reviewRef)
		if (reviewDoc.exists()) {
			const reviewData = reviewDoc.data()
			reviewStore.set({ isLoading: false, currentReview: { id: reviewDoc.id, ...reviewData } })
		} else {
			reviewStore.set({ isLoading: false, currentReview: null })
		}
	},
	getReviewsByTechnicianId: async (technicianId) => {
		const reviewsRef = collection(db, 'reviews')
		const snapshot = await getDocs(reviewsRef)
		const reviews = []
		snapshot.forEach((doc) => {
			if (
				doc?._document?.data?.value?.mapValue?.fields?.technicianId?.stringValue === technicianId
			) {
				reviews.push({ id: doc.id, ...doc.data() })
			}
		})
		return reviews
	},

	getReviewsBySalonId: async (salonId) => {
		const reviewsRef = collection(db, 'reviews')
		const snapshot = await getDocs(reviewsRef)
		const reviews = []
		snapshot.forEach((doc) => {
			if (doc?._document?.data?.value?.mapValue?.fields?.salonId?.stringValue === salonId) {
				reviews.push({ id: doc.id, ...doc.data() })
			}
		})
		return reviews
	},

	getReviewsByReviewerId: async (reviewerId) => {
		const reviewsRef = collection(db, 'reviews')
		const snapshot = await getDocs(reviewsRef)
		const reviews = []
		snapshot.forEach((doc) => {
			if (doc?._document?.data?.value?.mapValue?.fields?.reviewerId?.stringValue === reviewerId) {
				reviews.push({ id: doc.id, ...doc.data() })
			}
		})
		return reviews
	},

	/**
	 * How to create a review
	 *
		await reviewHandlers.createReview({
			date: '11-20-2023',
			description:
				'This is the best salon ever. I would come back and get my hair done here again!!!',
			rating: 5,
			reviewerName: 'Carlos Rodriguez',
			reviewerId: 'kxnDFRkYu5No72KXZOyekAxv0ao1',
			technicianId: 'x5wC5QUT0mQuGFyXc4iLRYHEf5A3',
			salonId: 'ZgsmBp7Rt3RIEMcazi3n'
		});
	 */

	createReview: async (reviewData) => {
		const reviewsRef = collection(db, 'reviews')
		const newReviewRef = await addDoc(reviewsRef, reviewData)
		return newReviewRef.id
	},

	updateReview: async (reviewId, reviewData) => {
		const reviewRef = doc(db, 'reviews', reviewId)
		await updateDoc(reviewRef, reviewData)
	},

	deleteReview: async (reviewId) => {
		const reviewRef = doc(db, 'reviews', reviewId)
		await deleteDoc(reviewRef)
	}
}
