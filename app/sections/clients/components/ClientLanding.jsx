/**
 * Client Landing Component
 * Landing page shown to non-authenticated users
 * Describes the client portal features and provides login/register links
 */

"use client";

import Link from 'next/link';
import { HeadingDivider } from 'components';
import {
	BsCreditCard2Front,
	BsFileEarmarkText,
	BsShieldCheck,
	BsClockHistory
} from 'react-icons/bs';

export function ClientLanding() {
	return (
		<section className="section">
			<HeadingDivider title="Client Portal" />

			<div className="max-w-5xl mx-auto py-12">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Secure Payment & Invoice Management
					</h2>
					<p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
						Welcome to the client portal. Access your account to make payments, view
						payment history, and manage invoices securely.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					<FeatureCard
						icon={<BsCreditCard2Front className="text-4xl" />}
						title="Secure Payments"
						description="Make payments safely through Stripe's encrypted checkout system"
					/>
					<FeatureCard
						icon={<BsClockHistory className="text-4xl" />}
						title="Payment History"
						description="View all past transactions and download receipts anytime"
					/>
					<FeatureCard
						icon={<BsFileEarmarkText className="text-4xl" />}
						title="Invoice Management"
						description="Check upcoming invoices and track due dates"
					/>
					<FeatureCard
						icon={<BsShieldCheck className="text-4xl" />}
						title="Secure & Private"
						description="Your data is protected with industry-standard encryption"
					/>
				</div>

				{/* CTA Section */}
				<div className="bg-card-light dark:bg-card-dark rounded-lg p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">
						Ready to get started?
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
						Sign in to access your account or create a new account to start managing
						your payments and invoices.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/login"
							className="px-8 py-4 bg-brand-purple text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:brightness-110 inline-flex items-center justify-center"
						>
							Sign In
						</Link>
						<Link
							href="/register"
							className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 inline-flex items-center justify-center"
						>
							Create Account
						</Link>
					</div>
				</div>

				{/* Back to Home */}
				<div className="mt-12 text-center">
					<Link
						href="/"
						className="text-gray-600 dark:text-gray-400 hover:text-brand-purple dark:hover:text-brand-purple transition-colors inline-flex items-center gap-2"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</section>
	);
}

/**
 * Feature Card Component
 */
function FeatureCard({ icon, title, description }) {
	return (
		<div className="flex flex-col items-center text-center p-6 bg-card-light dark:bg-card-dark rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-brand-purple">
			<div className="mb-4 text-brand-purple">{icon}</div>
			<h4 className="text-lg font-semibold mb-2">{title}</h4>
			<p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
		</div>
	);
}
