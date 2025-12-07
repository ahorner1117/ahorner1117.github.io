/**
 * Stripe Configuration
 * Automatically selects the appropriate Stripe keys and BASE_URL based on environment
 * - Development (NODE_ENV === 'development'): Uses test keys and localhost
 * - Production (NODE_ENV === 'production'): Uses live keys and GitHub Pages URL
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const stripeConfig = {
	// Stripe Secret Key (server-side only)
	secretKey: isDevelopment
		? process.env.STRIPE_SECRET_KEY_TEST
		: process.env.STRIPE_SECRET_KEY_LIVE,

	// Stripe Publishable Key (client-side safe)
	publishableKey: isDevelopment
		? process.env.STRIPE_PUBLISHABLE_KEY_TEST
		: process.env.STRIPE_PUBLISHABLE_KEY_LIVE,

	// Base URL for redirects
	baseUrl: isDevelopment
		? process.env.NEXT_PUBLIC_BASE_URL_DEV
		: process.env.NEXT_PUBLIC_BASE_URL_PROD,

	// Environment info
	environment: isDevelopment ? 'development' : 'production',
	isTest: isDevelopment,
};

// Log current environment (helpful for debugging)
if (typeof window === 'undefined') {
	// Server-side only
	console.log(`[Stripe Config] Environment: ${stripeConfig.environment}`);
	console.log(`[Stripe Config] Using ${stripeConfig.isTest ? 'TEST' : 'LIVE'} keys`);
	console.log(`[Stripe Config] Base URL: ${stripeConfig.baseUrl}`);
}
