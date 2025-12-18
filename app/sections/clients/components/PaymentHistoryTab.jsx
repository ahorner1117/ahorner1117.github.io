/**
 * Payment History Tab Component
 * Displays payment history fetched from Firestore via API
 */

"use client";

import useSWR from 'swr';
import { AiOutlineLoading3Quarters, AiOutlineDownload } from 'react-icons/ai';
import { BsCheckCircle, BsXCircle, BsClock } from 'react-icons/bs';

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export function PaymentHistoryTab({ email }) {
	const { data, error, isLoading } = useSWR(
		`/api/payments?email=${encodeURIComponent(email)}`,
		fetcher,
		{
			refreshInterval: 30000, // Refresh every 30 seconds
			revalidateOnFocus: true
		}
	);

	if (isLoading) {
		return (
			<div className="flex-center py-16">
				<AiOutlineLoading3Quarters className="text-5xl animate-spin text-brand-purple" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg">
				<p className="text-red-800 dark:text-red-200 font-semibold mb-2">
					Error loading payment history
				</p>
				<p className="text-sm text-red-700 dark:text-red-300">
					Please try again later or contact support if the problem persists.
				</p>
			</div>
		);
	}

	const payments = data?.payments || [];

	if (payments.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4">
					<BsClock className="text-6xl text-gray-400 mx-auto" />
				</div>
				<p className="text-xl font-semibold mb-2">No payment history yet</p>
				<p className="text-gray-600 dark:text-gray-400">
					Your completed payments will appear here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="mb-6">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Showing {payments.length} payment{payments.length !== 1 ? 's' : ''}
				</p>
			</div>

			{payments.map((payment) => (
				<PaymentCard key={payment.id} payment={payment} />
			))}
		</div>
	);
}

/**
 * Payment Card Component
 */
function PaymentCard({ payment }) {
	const date = new Date(payment.createdAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	return (
		<div className="p-6 bg-card-light dark:bg-card-dark rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-purple transition-colors">
			<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
				{/* Left Side - Payment Info */}
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-3">
						<p className="text-3xl font-bold">${payment.amount.toFixed(2)}</p>
						<StatusBadge status={payment.status} />
					</div>

					<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{date}</p>

					{payment.invoiceNumber && (
						<p className="text-sm font-medium mb-1">
							Invoice: <span className="text-brand-purple">{payment.invoiceNumber}</span>
						</p>
					)}

					{payment.description && (
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
							{payment.description}
						</p>
					)}

					{payment.sessionId && (
						<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
							ID: {payment.sessionId.slice(-12)}
						</p>
					)}
				</div>

				{/* Right Side - Actions */}
				<div className="flex flex-col items-end gap-2">
					{payment.receiptUrl && (
						<a
							href={payment.receiptUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:brightness-110 transition-all"
						>
							<AiOutlineDownload />
							Receipt
						</a>
					)}
					<p className="text-xs text-gray-500 dark:text-gray-500 uppercase">
						{payment.currency?.toUpperCase() || 'USD'}
					</p>
				</div>
			</div>
		</div>
	);
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }) {
	const styles = {
		succeeded: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-200',
			border: 'border-green-300 dark:border-green-700',
			icon: <BsCheckCircle />
		},
		pending: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-200',
			border: 'border-yellow-300 dark:border-yellow-700',
			icon: <BsClock />
		},
		failed: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-200',
			border: 'border-red-300 dark:border-red-700',
			icon: <BsXCircle />
		}
	};

	const style = styles[status] || styles.pending;

	return (
		<span
			className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
		>
			{style.icon}
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
}
