// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider } from 'firebase/auth'
import { FacebookAuthProvider } from 'firebase/auth'
import { OAuthProvider } from 'firebase/auth'
import { TwitterAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_PROJECTID,
	storageBucket: import.meta.env.VITE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_APIID
}

// Initialize Firebase
let firebaseApp
if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig)
} else {
	firebaseApp = getApp()
	deleteApp(firebaseApp)
	firebaseApp = initializeApp(firebaseConfig)
}

// gives us an auth parameter we can access from other files
export const auth = getAuth(firebaseApp)
// db initialization
export const db = getFirestore(firebaseApp)
// google auth provider
export const googleProvider = new GoogleAuthProvider()
// facebook auth provider
export const facebookProvider = new FacebookAuthProvider()
// oauth provider for apple
export const provider = new OAuthProvider('apple.com')
// twitter auth provider
export const twitterProvider = new TwitterAuthProvider()
