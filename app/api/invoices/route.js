/**
 * Invoices API Route
 * Fetches upcoming invoices for a user from Stripe
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeConfig } from 'utils/stripe-config';

// Initialize Stripe with secret key
const stripe = new Stripe(stripeConfig.secretKey);

/**
 * GET /api/invoices?email=user@example.com
 * Fetch open/draft invoices for a specific customer email
 */
export async function GET(request) {
	try {
		// Get email from query parameters
		const { searchParams } = new URL(request.url);
		const email = searchParams.get('email');

		// Validate email parameter
		if (!email) {
			return NextResponse.json(
				{
					error: 'Missing required parameter',
					details: 'email parameter is required'
				},
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					error: 'Invalid email address',
					details: 'Please provide a valid email address'
				},
				{ status: 400 }
			);
		}

		// First, find customer by email
		const customers = await stripe.customers.list({
			email,
			limit: 1
		});

		// If no customer found, return empty array
		if (customers.data.length === 0) {
			console.log(`[Invoices API] No Stripe customer found for ${email}`);
			return NextResponse.json({
				invoices: [],
				count: 0,
				message: 'No customer found with this email'
			});
		}

		const customerId = customers.data[0].id;

		// Fetch invoices for this customer (open and draft status only)
		const invoices = await stripe.invoices.list({
			customer: customerId,
			status: 'open', // Only open invoices (unpaid)
			limit: 20
		});

		// Also fetch draft invoices
		const draftInvoices = await stripe.invoices.list({
			customer: customerId,
			status: 'draft',
			limit: 20
		});

		// Combine and format invoices
		const allInvoices = [...invoices.data, ...draftInvoices.data];

		const formattedInvoices = allInvoices.map((invoice) => ({
			id: invoice.id,
			number: invoice.number,
			amount_due: invoice.amount_due,
			amount_paid: invoice.amount_paid,
			amount_remaining: invoice.amount_remaining,
			currency: invoice.currency,
			status: invoice.status,
			due_date: invoice.due_date,
			created: invoice.created,
			hosted_invoice_url: invoice.hosted_invoice_url,
			invoice_pdf: invoice.invoice_pdf,
			description: invoice.description,
			customer_email: invoice.customer_email
		}));

		// Sort by due date (soonest first), then by created date
		formattedInvoices.sort((a, b) => {
			if (a.due_date && b.due_date) {
				return a.due_date - b.due_date;
			}
			if (a.due_date) return -1;
			if (b.due_date) return 1;
			return b.created - a.created;
		});

		console.log(`[Invoices API] Fetched ${formattedInvoices.length} invoices for ${email}`);

		return NextResponse.json({
			invoices: formattedInvoices,
			count: formattedInvoices.length
		});
	} catch (error) {
		console.error('[Invoices API] Error fetching invoices:', error);

		// Handle Stripe API errors
		if (error.type === 'StripeInvalidRequestError') {
			return NextResponse.json(
				{
					error: 'Invalid request to Stripe',
					details: error.message,
					invoices: []
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				error: 'Failed to fetch invoices',
				details: error.message,
				invoices: []
			},
			{ status: 500 }
		);
	}
}
