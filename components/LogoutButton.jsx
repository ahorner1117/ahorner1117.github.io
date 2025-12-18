"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from 'context';
import { BiLogOut } from 'react-icons/bi';

export function LogoutButton({ className = "" }) {
	const { logout } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<button
			onClick={handleLogout}
			className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${className}`}
			title="Sign out"
		>
			<BiLogOut className="text-lg" />
			<span>Logout</span>
		</button>
	);
}
