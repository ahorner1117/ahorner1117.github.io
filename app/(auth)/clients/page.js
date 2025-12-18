/**
 * Clients Page
 * Shows ClientLanding for non-authenticated users
 * Shows ClientPortal for authenticated users
 * AuthProvider is wrapped here to avoid loading Firebase on other pages
 */

"use client";

import { useEffect } from 'react';
import { ClientsSection } from 'app/sections';
import { AuthProvider, useAuth } from 'context';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function ClientsPageContent() {
	const { user, userProfile, loading } = useAuth();

	// Domain restriction - redirect from GitHub Pages to Vercel
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const isGitHubPages = window.location.hostname === 'ahorner1117.github.io';
			if (isGitHubPages) {
				window.location.href = 'https://anthonyhorner.com/clients';
			}
		}
	}, []);

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="container-md">
				<div className="min-h-screen flex items-center justify-center">
					<AiOutlineLoading3Quarters className="text-5xl text-brand-purple animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<div className="container-md">
			<ClientsSection isLoggedIn={!!user} userProfile={userProfile} />
		</div>
	);
}

export default function ClientsPage() {
	return (
		<AuthProvider>
			<ClientsPageContent />
		</AuthProvider>
	);
}
