/**
 * Send Email API Route
 * Handles sending emails via Resend for registration and payment confirmation
 */

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailConfig, validateEmailConfig } from 'utils/email-config';
import { registrationEmail, paymentConfirmationEmail } from 'utils/email-templates';

// Initialize Resend client
const resend = new Resend(emailConfig.apiKey);

/**
 * POST /api/send-email
 * Send an email based on type (registration or payment_confirmation)
 */
export async function POST(request) {
	try {
		// Validate email configuration
		const configValidation = validateEmailConfig();
		if (!configValidation.isValid) {
			console.error('[Send Email] Configuration errors:', configValidation.errors);
			return NextResponse.json(
				{
					error: 'Email service not configured',
					details: configValidation.errors
				},
				{ status: 500 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { type, to, data } = body;

		// Validate required fields
		if (!type || !to) {
			return NextResponse.json(
				{
					error: 'Missing required fields',
					details: 'type and to are required'
				},
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(to)) {
			return NextResponse.json(
				{
					error: 'Invalid email address',
					details: 'Please provide a valid email address'
				},
				{ status: 400 }
			);
		}

		// Generate email content based on type
		let emailContent;
		try {
			switch (type) {
				case 'registration':
					if (!data?.companyName) {
						return NextResponse.json(
							{
								error: 'Missing required data',
								details: 'companyName is required for registration emails'
							},
							{ status: 400 }
						);
					}
					emailContent = registrationEmail(data.companyName);
					break;

				case 'payment_confirmation':
					if (!data?.amount) {
						return NextResponse.json(
							{
								error: 'Missing required data',
								details: 'amount is required for payment confirmation emails'
							},
							{ status: 400 }
						);
					}
					emailContent = paymentConfirmationEmail(data);
					break;

				default:
					return NextResponse.json(
						{
							error: 'Invalid email type',
							details: 'type must be "registration" or "payment_confirmation"'
						},
						{ status: 400 }
					);
			}
		} catch (templateError) {
			console.error('[Send Email] Template generation error:', templateError);
			return NextResponse.json(
				{
					error: 'Failed to generate email content',
					details: templateError.message
				},
				{ status: 500 }
			);
		}

		// Send email via Resend
		try {
			const result = await resend.emails.send({
				from: emailConfig.fromEmail,
				to,
				subject: emailContent.subject,
				html: emailContent.html,
				text: emailContent.text
			});

			console.log(
				`[Send Email] Successfully sent ${type} email to ${to} (ID: ${result.id})`
			);

			return NextResponse.json({
				success: true,
				messageId: result.id,
				type,
				environment: emailConfig.environment
			});
		} catch (sendError) {
			console.error('[Send Email] Resend API error:', sendError);

			// Return error but don't expose sensitive details to client
			return NextResponse.json(
				{
					error: 'Failed to send email',
					details: sendError.message || 'Email service error'
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('[Send Email] Unexpected error:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error.message
			},
			{ status: 500 }
		);
	}
}

/**
 * GET /api/send-email
 * Health check endpoint
 */
export async function GET() {
	const configValidation = validateEmailConfig();

	return NextResponse.json({
		status: 'ok',
		service: 'email',
		configured: configValidation.isValid,
		environment: emailConfig.environment,
		errors: configValidation.isValid ? [] : configValidation.errors
	});
}
