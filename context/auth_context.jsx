"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from 'utils/firebase-config';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Skip Firebase initialization if auth is not available (GitHub Pages build)
		if (!auth) {
			setLoading(false);
			return;
		}

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUser(user);
				try {
					// Fetch user profile from Firestore
					const userDoc = await getDoc(doc(db, 'users', user.uid));
					if (userDoc.exists()) {
						setUserProfile(userDoc.data());
						// Update last login timestamp
						await updateDoc(doc(db, 'users', user.uid), {
							lastLogin: serverTimestamp()
						});
					}
				} catch (error) {
					console.error('[Auth Context] Error fetching user profile:', error);
				}
			} else {
				setUser(null);
				setUserProfile(null);
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const register = async (email, password, companyName, phoneNumber) => {
		if (!auth || !db) {
			throw new Error('Firebase not initialized');
		}
		try {
			// Create Firebase Auth account
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const uid = userCredential.user.uid;

			// Create user profile in Firestore
			await setDoc(doc(db, 'users', uid), {
				uid,
				email,
				companyName,
				phoneNumber,
				createdAt: serverTimestamp(),
				lastLogin: serverTimestamp(),
				isActive: true
			});

			// Send registration confirmation email (non-blocking)
			// Don't await - email failures shouldn't block registration
			fetch('/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'registration',
					to: email,
					data: { companyName }
				})
			})
				.then((res) => {
					if (res.ok) {
						console.log('[Auth Context] Registration email sent successfully');
					} else {
						console.error('[Auth Context] Failed to send registration email');
					}
				})
				.catch((err) => {
					console.error('[Auth Context] Error sending registration email:', err);
				});

			return userCredential;
		} catch (error) {
			console.error('[Auth Context] Registration error:', error);
			throw error;
		}
	};

	const login = async (email, password) => {
		if (!auth) {
			throw new Error('Firebase not initialized');
		}
		try {
			return await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.error('[Auth Context] Login error:', error);
			throw error;
		}
	};

	const logout = async () => {
		if (!auth) {
			throw new Error('Firebase not initialized');
		}
		try {
			return await signOut(auth);
		} catch (error) {
			console.error('[Auth Context] Logout error:', error);
			throw error;
		}
	};

	const value = {
		user,
		userProfile,
		loading,
		register,
		login,
		logout
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
