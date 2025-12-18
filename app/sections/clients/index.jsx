/**
 * Clients Section
 * Conditionally renders ClientLanding (not logged in) or ClientPortal (logged in)
 */

"use client";

import { ClientLanding } from './components/ClientLanding';
import { ClientPortal } from './components/ClientPortal';

export function ClientsSection({ isLoggedIn, userProfile }) {
	if (!isLoggedIn || !userProfile) {
		return <ClientLanding />;
	}

	return <ClientPortal userProfile={userProfile} />;
}
