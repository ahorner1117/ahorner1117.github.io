/**
 * Email Service Configuration
 * Configures Resend API based on environment (dev vs prod)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const emailConfig = {
	// Resend API key
	apiKey: process.env.RESEND_API_KEY,

	// From email address (environment-based)
	fromEmail: isDevelopment
		? process.env.RESEND_FROM_EMAIL_DEV || 'onboarding@resend.dev'
		: process.env.RESEND_FROM_EMAIL_PROD || 'noreply@yourdomain.com',

	// Stripe webhook secret (environment-based)
	webhookSecret: isDevelopment
		? process.env.STRIPE_WEBHOOK_SECRET_TEST
		: process.env.STRIPE_WEBHOOK_SECRET_LIVE,

	// Environment identifier
	environment: isDevelopment ? 'development' : 'production',

	// Base URL for links in emails
	baseUrl:
		process.env.NEXT_PUBLIC_BASE_URL_PROD || 'https://ahorner1117-github-io.vercel.app'
};

// Validation helper
export function validateEmailConfig() {
	const errors = [];

	if (!emailConfig.apiKey) {
		errors.push('RESEND_API_KEY is not configured');
	}

	if (!emailConfig.webhookSecret && !isDevelopment) {
		errors.push('STRIPE_WEBHOOK_SECRET is not configured for production');
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}
