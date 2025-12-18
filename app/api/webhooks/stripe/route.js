/**
 * Stripe Webhook Handler
 * Listens for Stripe checkout events and stores payment records in Firestore
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeConfig } from 'utils/stripe-config';
import { emailConfig } from 'utils/email-config';
import { getFirestoreInstance } from 'utils/firebase-config';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// Initialize Stripe with secret key
const stripe = new Stripe(stripeConfig.secretKey);

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request) {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	// Verify webhook signature
	let event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, emailConfig.webhookSecret);
	} catch (err) {
		console.error('[Stripe Webhook] Signature verification failed:', err.message);
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
	}

	console.log(`[Stripe Webhook] Received event: ${event.type}`);

	// Handle the event
	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutCompleted(event.data.object);
				break;

			case 'checkout.session.async_payment_succeeded':
				await handleAsyncPaymentSucceeded(event.data.object);
				break;

			case 'checkout.session.async_payment_failed':
				await handleAsyncPaymentFailed(event.data.object);
				break;

			default:
				console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('[Stripe Webhook] Error processing event:', error);
		return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
	}
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(session) {
	console.log(`[Stripe Webhook] Processing checkout.session.completed: ${session.id}`);

	try {
		// Lazy load Firestore
		const db = await getFirestoreInstance();
		if (!db) {
			throw new Error('Firestore not initialized');
		}

		// Extract payment details
		const email = session.customer_email;
		const amountTotal = session.amount_total / 100; // Convert cents to dollars
		const paymentIntentId = session.payment_intent;
		const invoiceNumber = session.metadata?.invoiceNumber || null;
		const description = session.metadata?.description || null;

		// Check if already processed (idempotency)
		const existingPayments = await getDocs(
			query(collection(db, 'payments'), where('sessionId', '==', session.id))
		);

		if (!existingPayments.empty) {
			console.log(`[Stripe Webhook] Payment already processed: ${session.id}`);
			return;
		}

		// Get receipt URL from charge
		let receiptUrl = null;
		if (paymentIntentId) {
			try {
				const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
				const chargeId = paymentIntent.latest_charge;
				if (chargeId) {
					const charge = await stripe.charges.retrieve(chargeId);
					receiptUrl = charge.receipt_url;
				}
			} catch (chargeError) {
				console.error('[Stripe Webhook] Error fetching receipt:', chargeError);
			}
		}

		// Get Firebase UID if user exists
		let uid = null;
		try {
			const usersQuery = query(collection(db, 'users'), where('email', '==', email));
			const userDocs = await getDocs(usersQuery);
			if (!userDocs.empty) {
				uid = userDocs.docs[0].data().uid;
			}
		} catch (userError) {
			console.error('[Stripe Webhook] Error fetching user:', userError);
		}

		// Get company name from user profile if available
		let companyName = session.customer_details?.name || '';
		if (uid && !companyName) {
			try {
				const usersQuery = query(collection(db, 'users'), where('uid', '==', uid));
				const userDocs = await getDocs(usersQuery);
				if (!userDocs.empty) {
					companyName = userDocs.docs[0].data().companyName || '';
				}
			} catch (nameError) {
				console.error('[Stripe Webhook] Error fetching company name:', nameError);
			}
		}

		// Store payment record in Firestore
		const paymentData = {
			sessionId: session.id,
			paymentIntentId: paymentIntentId || null,
			email,
			uid,
			amount: amountTotal,
			currency: session.currency || 'usd',
			status: session.payment_status === 'paid' ? 'succeeded' : 'pending',
			invoiceNumber,
			description,
			receiptUrl,
			createdAt: serverTimestamp(),
			paidAt: serverTimestamp(),
			metadata: session.metadata || {}
		};

		await addDoc(collection(db, 'payments'), paymentData);
		console.log(`[Stripe Webhook] Payment record created for ${email}`);

		// Send payment confirmation email (non-blocking)
		if (session.payment_status === 'paid') {
			fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PROD}/api/send-email`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'payment_confirmation',
					to: email,
					data: {
						companyName,
						amount: amountTotal,
						invoiceNumber,
						description,
						sessionId: session.id,
						receiptUrl
					}
				})
			})
				.then((res) => {
					if (res.ok) {
						console.log(`[Stripe Webhook] Payment confirmation email sent to ${email}`);
					} else {
						console.error('[Stripe Webhook] Failed to send confirmation email');
					}
				})
				.catch((err) => {
					console.error('[Stripe Webhook] Error sending confirmation email:', err);
				});
		}
	} catch (error) {
		console.error('[Stripe Webhook] Error in handleCheckoutCompleted:', error);
		throw error;
	}
}

/**
 * Handle async payment succeeded (for bank transfers, etc.)
 */
async function handleAsyncPaymentSucceeded(session) {
	console.log(`[Stripe Webhook] Processing async_payment_succeeded: ${session.id}`);

	try {
		// Lazy load Firestore
		const db = await getFirestoreInstance();
		if (!db) {
			throw new Error('Firestore not initialized');
		}

		// Update payment status in Firestore
		const paymentsQuery = query(
			collection(db, 'payments'),
			where('sessionId', '==', session.id)
		);
		const paymentDocs = await getDocs(paymentsQuery);

		if (!paymentDocs.empty) {
			const paymentDoc = paymentDocs.docs[0];
			await paymentDoc.ref.update({
				status: 'succeeded',
				paidAt: serverTimestamp()
			});

			console.log(`[Stripe Webhook] Payment status updated to succeeded: ${session.id}`);

			// Send confirmation email for async payment
			const paymentData = paymentDoc.data();
			fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PROD}/api/send-email`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'payment_confirmation',
					to: paymentData.email,
					data: {
						companyName: '',
						amount: paymentData.amount,
						invoiceNumber: paymentData.invoiceNumber,
						description: paymentData.description,
						sessionId: session.id,
						receiptUrl: paymentData.receiptUrl
					}
				})
			}).catch((err) => {
				console.error('[Stripe Webhook] Error sending async confirmation email:', err);
			});
		} else {
			console.warn(`[Stripe Webhook] No payment found for session: ${session.id}`);
		}
	} catch (error) {
		console.error('[Stripe Webhook] Error in handleAsyncPaymentSucceeded:', error);
		throw error;
	}
}

/**
 * Handle async payment failed
 */
async function handleAsyncPaymentFailed(session) {
	console.log(`[Stripe Webhook] Processing async_payment_failed: ${session.id}`);

	try {
		// Lazy load Firestore
		const db = await getFirestoreInstance();
		if (!db) {
			throw new Error('Firestore not initialized');
		}

		// Update payment status in Firestore
		const paymentsQuery = query(
			collection(db, 'payments'),
			where('sessionId', '==', session.id)
		);
		const paymentDocs = await getDocs(paymentsQuery);

		if (!paymentDocs.empty) {
			const paymentDoc = paymentDocs.docs[0];
			await paymentDoc.ref.update({
				status: 'failed'
			});

			console.log(`[Stripe Webhook] Payment status updated to failed: ${session.id}`);
		} else {
			console.warn(`[Stripe Webhook] No payment found for session: ${session.id}`);
		}
	} catch (error) {
		console.error('[Stripe Webhook] Error in handleAsyncPaymentFailed:', error);
		throw error;
	}
}

/**
 * GET /api/webhooks/stripe
 * Health check endpoint
 */
export async function GET() {
	return NextResponse.json({
		status: 'ok',
		service: 'stripe-webhook',
		configured: !!emailConfig.webhookSecret
	});
}
