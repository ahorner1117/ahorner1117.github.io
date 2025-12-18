/**
 * Payments API Route
 * Fetches payment history for a user from Firestore
 */

import { NextResponse } from 'next/server';
import { getFirestoreInstance } from 'utils/firebase-config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

/**
 * GET /api/payments?email=user@example.com
 * Fetch payment history for a specific user
 */
export async function GET(request) {
	try {
		// Lazy load Firestore
		const db = await getFirestoreInstance();
		if (!db) {
			return NextResponse.json(
				{
					error: 'Database unavailable',
					details: 'Firestore is not initialized'
				},
				{ status: 503 }
			);
		}

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

		// Query Firestore for payments
		const paymentsQuery = query(
			collection(db, 'payments'),
			where('email', '==', email),
			orderBy('createdAt', 'desc'),
			limit(50) // Limit to 50 most recent payments
		);

		const querySnapshot = await getDocs(paymentsQuery);

		// Transform Firestore documents to JSON-serializable format
		const payments = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			payments.push({
				id: doc.id,
				sessionId: data.sessionId,
				paymentIntentId: data.paymentIntentId,
				email: data.email,
				amount: data.amount,
				currency: data.currency,
				status: data.status,
				invoiceNumber: data.invoiceNumber,
				description: data.description,
				receiptUrl: data.receiptUrl,
				createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
				paidAt: data.paidAt?.toDate().toISOString() || null
			});
		});

		console.log(`[Payments API] Fetched ${payments.length} payments for ${email}`);

		return NextResponse.json({
			payments,
			count: payments.length
		});
	} catch (error) {
		console.error('[Payments API] Error fetching payments:', error);

		// Handle Firestore index error
		if (error.code === 'failed-precondition' || error.message?.includes('index')) {
			return NextResponse.json(
				{
					error: 'Database index required',
					details:
						'Please create a composite index in Firestore: (email ASC, createdAt DESC)',
					payments: []
				},
				{ status: 200 } // Return 200 with empty array to not break UI
			);
		}

		return NextResponse.json(
			{
				error: 'Failed to fetch payments',
				details: error.message
			},
			{ status: 500 }
		);
	}
}
