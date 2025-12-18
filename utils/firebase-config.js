/**
 * Firebase Configuration
 * Lazy-loaded Firebase initialization for Authentication and Firestore
 * Only initializes when actually needed (client portal pages)
 * All config values use NEXT_PUBLIC_ prefix (safe for client-side use)
 */

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

// Cache for initialized Firebase instances
let app = null;
let auth = null;
let db = null;
let analytics = null;

/**
 * Lazy initialize Firebase app
 * Only loads Firebase SDK when this function is called
 */
async function initializeFirebase() {
	if (app) return app;

	if (isGitHubPages || !firebaseConfig.apiKey) {
		console.log('[Firebase Config] Skipped initialization (GitHub Pages build or no config)');
		return null;
	}

	try {
		const { initializeApp, getApps } = await import('firebase/app');
		app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
		console.log(`[Firebase Config] Initialized for project: ${firebaseConfig.projectId}`);
		return app;
	} catch (error) {
		console.error('[Firebase Config] Failed to initialize:', error);
		return null;
	}
}

/**
 * Get Firebase Auth instance (lazy loaded)
 */
export async function getAuthInstance() {
	if (auth) return auth;

	const firebaseApp = await initializeFirebase();
	if (!firebaseApp) return null;

	try {
		const { getAuth } = await import('firebase/auth');
		auth = getAuth(firebaseApp);
		return auth;
	} catch (error) {
		console.error('[Firebase Config] Failed to load auth:', error);
		return null;
	}
}

/**
 * Get Firestore instance (lazy loaded)
 */
export async function getFirestoreInstance() {
	if (db) return db;

	const firebaseApp = await initializeFirebase();
	if (!firebaseApp) return null;

	try {
		const { getFirestore } = await import('firebase/firestore');
		db = getFirestore(firebaseApp);
		return db;
	} catch (error) {
		console.error('[Firebase Config] Failed to load firestore:', error);
		return null;
	}
}

/**
 * Get Analytics instance (lazy loaded)
 */
export async function getAnalyticsInstance() {
	if (analytics) return analytics;

	if (typeof window === 'undefined') return null;

	const firebaseApp = await initializeFirebase();
	if (!firebaseApp) return null;

	try {
		const { getAnalytics, isSupported } = await import('firebase/analytics');
		const supported = await isSupported();
		if (supported) {
			analytics = getAnalytics(firebaseApp);
			return analytics;
		}
	} catch (error) {
		console.error('[Firebase Config] Failed to load analytics:', error);
	}

	return null;
}
