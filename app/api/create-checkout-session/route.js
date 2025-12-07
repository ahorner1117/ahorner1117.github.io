import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeConfig } from 'utils/stripe-config';

const stripe = new Stripe(stripeConfig.secretKey, {
	apiVersion: '2024-11-20.acacia',
});

export async function POST(request) {
	try {
		const { amount, email, description, invoiceNumber } = await request.json();

		// Validation
		if (!amount || amount < 1) {
			return NextResponse.json(
				{ error: 'Amount must be at least $1.00' },
				{ status: 400 }
			);
		}

		if (amount > 999999) {
			return NextResponse.json(
				{ error: 'Amount cannot exceed $999,999.00' },
				{ status: 400 }
			);
		}

		// Convert dollars to cents for Stripe
		const amountInCents = Math.round(amount * 100);

		// Build line item description
		let lineItemName = 'Client Payment';
		if (invoiceNumber) {
			lineItemName = `Invoice #${invoiceNumber}`;
		}

		let lineItemDescription = description || 'Payment for services rendered';

		// Create Stripe Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: lineItemName,
							description: lineItemDescription,
						},
						unit_amount: amountInCents,
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			customer_email: email,
			success_url: `${stripeConfig.baseUrl}/clients?payment=success&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${stripeConfig.baseUrl}/clients?payment=cancelled`,
			metadata: {
				invoiceNumber: invoiceNumber || 'N/A',
				description: description || 'N/A',
			},
			billing_address_collection: 'required',
		});

		return NextResponse.json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error('Stripe error:', error);

		return NextResponse.json(
			{ error: error.message || 'Failed to create checkout session' },
			{ status: 500 }
		);
	}
}
