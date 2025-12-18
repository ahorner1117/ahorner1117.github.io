/**
 * Upcoming Invoices Tab Component
 * Displays upcoming invoices fetched from Stripe via API
 */

"use client";

import useSWR from 'swr';
import { AiOutlineLoading3Quarters, AiOutlineFileText } from 'react-icons/ai';
import { BsCalendar, BsExclamationTriangle } from 'react-icons/bs';

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export function UpcomingInvoicesTab({ email }) {
	const { data, error, isLoading } = useSWR(
		`/api/invoices?email=${encodeURIComponent(email)}`,
		fetcher,
		{
			refreshInterval: 300000, // Refresh every 5 minutes
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
					Error loading invoices
				</p>
				<p className="text-sm text-red-700 dark:text-red-300">
					Please try again later or contact support if the problem persists.
				</p>
			</div>
		);
	}

	const invoices = data?.invoices || [];

	if (invoices.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4">
					<AiOutlineFileText className="text-6xl text-gray-400 mx-auto" />
				</div>
				<p className="text-xl font-semibold mb-2">No upcoming invoices</p>
				<p className="text-gray-600 dark:text-gray-400">
					You're all caught up! Invoices will appear here when they're created.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="mb-6">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Showing {invoices.length} upcoming invoice{invoices.length !== 1 ? 's' : ''}
				</p>
			</div>

			{invoices.map((invoice) => (
				<InvoiceCard key={invoice.id} invoice={invoice} />
			))}
		</div>
	);
}

/**
 * Invoice Card Component
 */
function InvoiceCard({ invoice }) {
	const dueDate = invoice.due_date
		? new Date(invoice.due_date * 1000).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		: 'No due date';

	const createdDate = new Date(invoice.created * 1000).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	const amount = (invoice.amount_due / 100).toFixed(2);
	const isOverdue = invoice.due_date && invoice.due_date * 1000 < Date.now();
	const isDraft = invoice.status === 'draft';

	return (
		<div
			className={`
      p-6 rounded-lg border-2 transition-all hover:shadow-lg
      ${
				isOverdue
					? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-700'
					: isDraft
						? 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600'
						: 'bg-card-light dark:bg-card-dark border-gray-200 dark:border-gray-700 hover:border-brand-purple'
			}
    `}
		>
			<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
				{/* Left Side - Invoice Info */}
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-3">
						<AiOutlineFileText className="text-2xl text-brand-purple" />
						<p className="font-semibold text-lg">
							{invoice.number || `Invoice ${invoice.id.slice(-8)}`}
						</p>
						{isDraft && (
							<span className="px-2 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
								DRAFT
							</span>
						)}
					</div>

					<p className="text-4xl font-bold mb-4 text-brand-purple">${amount}</p>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<BsCalendar className="text-gray-500" />
							<span className="text-gray-600 dark:text-gray-400">
								Created: {createdDate}
							</span>
						</div>

						<div className="flex items-center gap-2 text-sm">
							<BsCalendar className={isOverdue ? 'text-red-600' : 'text-gray-500'} />
							<span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}>
								Due: {dueDate}
								{isOverdue && (
									<span className="ml-2 inline-flex items-center gap-1">
										<BsExclamationTriangle />
										OVERDUE
									</span>
								)}
							</span>
						</div>
					</div>

					{invoice.description && (
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
							{invoice.description}
						</p>
					)}
				</div>

				{/* Right Side - Action */}
				<div className="flex flex-col items-end gap-3">
					{invoice.hosted_invoice_url && (
						<a
							href={invoice.hosted_invoice_url}
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-3 bg-brand-purple text-white font-semibold rounded-lg hover:brightness-110 transition-all inline-flex items-center gap-2"
						>
							<AiOutlineFileText />
							View Invoice
						</a>
					)}

					{invoice.invoice_pdf && (
						<a
							href={invoice.invoice_pdf}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-brand-purple hover:text-brand-pink transition-colors"
						>
							Download PDF
						</a>
					)}

					<p className="text-xs text-gray-500 dark:text-gray-500 uppercase mt-2">
						{invoice.currency?.toUpperCase() || 'USD'}
					</p>
				</div>
			</div>
		</div>
	);
}
