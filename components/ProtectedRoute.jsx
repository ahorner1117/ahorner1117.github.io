"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context';

export function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [domainChecked, setDomainChecked] = useState(false);

	// Domain restriction
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const isGitHubPages = window.location.hostname === 'ahorner1117.github.io';
			if (isGitHubPages) {
				window.location.href = 'https://anthonyhorner.com/clients';
				return;
			}
			setDomainChecked(true);
		}
	}, []);

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!loading && !user && domainChecked) {
			router.push('/login');
		}
	}, [user, loading, router, domainChecked]);

	// Show loading state
	if (loading || !domainChecked) {
		return (
			<div className="flex-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading...</p>
				</div>
			</div>
		);
	}

	// Show content only if authenticated
	if (user) {
		return <>{children}</>;
	}

	// Return null while redirecting
	return null;
}
