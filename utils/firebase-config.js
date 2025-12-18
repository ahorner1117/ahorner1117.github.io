/**
 * Firebase Configuration
 * Client-side Firebase initialization for Authentication and Firestore
 * All config values use NEXT_PUBLIC_ prefix (safe for client-side use)
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Check if we're building for GitHub Pages (Firebase disabled)
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// Firebase configuration from environment variables
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if not building for GitHub Pages and config is available
let app = null;
if (!isGitHubPages && firebaseConfig.apiKey) {
	app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

// Export auth and firestore instances (null if GitHub Pages build)
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Initialize Analytics (only in browser, if supported, and Firebase is initialized)
// Note: Analytics initialization is deferred to avoid blocking page load
export let analytics = null;
if (typeof window !== 'undefined' && app) {
	// Defer analytics initialization to not block initial render
	setTimeout(() => {
		isSupported().then((supported) => {
			if (supported) {
				analytics = getAnalytics(app);
			}
		}).catch((err) => {
			console.error('[Firebase Config] Analytics initialization failed:', err);
		});
	}, 0);
}

// Log initialization status (helpful for debugging)
if (typeof window !== 'undefined') {
	if (app) {
		console.log(`[Firebase Config] Initialized for project: ${firebaseConfig.projectId}`);
	} else if (isGitHubPages) {
		console.log('[Firebase Config] Skipped initialization (GitHub Pages build)');
	}
}
