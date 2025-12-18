"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from 'context';
import Link from 'next/link';
import {
	AiOutlineLoading3Quarters,
	AiOutlineMail,
	AiOutlineLock,
	AiOutlineUser,
	AiOutlinePhone
} from 'react-icons/ai';

function RegisterPageContent() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { register, user, loading: authLoading } = useAuth();
	const router = useRouter();

	// Domain restriction check
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const isGitHubPages = window.location.hostname === 'ahorner1117.github.io';
			if (isGitHubPages) {
				window.location.href = 'https://ahorner1117-github-io.vercel.app/register';
			}
		}
	}, []);

	// Redirect if already logged in (only after auth check completes)
	useEffect(() => {
		if (!authLoading && user) {
			router.push('/clients');
		}
	}, [user, authLoading, router]);

	const getErrorMessage = (errorCode) => {
		switch (errorCode) {
			case 'auth/email-already-in-use':
				return 'Email already registered. Please login or use a different email.';
			case 'auth/weak-password':
				return 'Password should be at least 6 characters long.';
			case 'auth/invalid-email':
				return 'Invalid email format.';
			case 'auth/network-request-failed':
				return 'Network error. Please check your connection.';
			default:
				return 'An error occurred during registration. Please try again.';
		}
	};

	const validateForm = () => {
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			return 'Please enter a valid email address.';
		}

		// Password validation
		if (!password || password.length < 6) {
			return 'Password must be at least 6 characters long.';
		}

		// Password match
		if (password !== confirmPassword) {
			return 'Passwords do not match.';
		}

		// Company name validation
		if (!companyName.trim()) {
			return 'Company name is required.';
		}

		// Phone number validation
		if (!phoneNumber.trim()) {
			return 'Phone number is required.';
		}

		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Validate form
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			setLoading(false);
			return;
		}

		try {
			await register(email, password, companyName, phoneNumber);
			// Auto-login happens via onAuthStateChanged in AuthContext
			// Redirect handled by useEffect when user state changes
		} catch (err) {
			setError(getErrorMessage(err.code));
		} finally {
			setLoading(false);
		}
	};

	// Show loading state while checking auth
	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<AiOutlineLoading3Quarters className="text-4xl text-brand-purple animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-2">Create Account</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Register to access the clients portal
					</p>
				</div>

				{/* Registration Form Card */}
				<div className="bg-card-light dark:bg-card-dark rounded-lg p-8 border border-gray-200 dark:border-gray-700">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Error Message */}
						{error && (
							<div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg">
								<p className="text-sm text-red-800 dark:text-red-200">{error}</p>
							</div>
						)}

						{/* Company Name Field */}
						<div>
							<label htmlFor="companyName" className="block text-sm font-medium mb-2">
								Company Name <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<AiOutlineUser className="text-gray-400" />
								</div>
								<input
									id="companyName"
									type="text"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
									placeholder="Acme Corporation"
									disabled={loading}
									required
								/>
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium mb-2">
								Email Address <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<AiOutlineMail className="text-gray-400" />
								</div>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
									placeholder="you@example.com"
									disabled={loading}
									required
								/>
							</div>
						</div>

						{/* Phone Number Field */}
						<div>
							<label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
								Phone Number <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<AiOutlinePhone className="text-gray-400" />
								</div>
								<input
									id="phoneNumber"
									type="tel"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
									placeholder="+1 (555) 123-4567"
									disabled={loading}
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium mb-2">
								Password <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<AiOutlineLock className="text-gray-400" />
								</div>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
									placeholder="••••••••"
									disabled={loading}
									required
								/>
							</div>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
								Must be at least 6 characters
							</p>
						</div>

						{/* Confirm Password Field */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
								Confirm Password <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<AiOutlineLock className="text-gray-400" />
								</div>
								<input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
									placeholder="••••••••"
									disabled={loading}
									required
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-4 px-6 bg-brand-purple text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
						>
							{loading ? (
								<>
									<AiOutlineLoading3Quarters className="text-xl animate-spin" />
									<span>Creating Account...</span>
								</>
							) : (
								<span>Create Account</span>
							)}
						</button>
					</form>

					{/* Login Link */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Already have an account?{' '}
							<Link
								href="/login"
								className="text-brand-purple hover:text-brand-pink font-semibold transition-colors"
							>
								Sign in here
							</Link>
						</p>
					</div>
				</div>

				{/* Back to Home Link */}
				<div className="mt-6 text-center">
					<Link
						href="/"
						className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-purple transition-colors"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function RegisterPage() {
	return (
		<AuthProvider>
			<RegisterPageContent />
		</AuthProvider>
	);
}
