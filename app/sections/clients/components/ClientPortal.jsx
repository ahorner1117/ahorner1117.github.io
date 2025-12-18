/**
 * Client Portal Component
 * Main portal with tabbed interface for authenticated users
 * Displays: Make Payment, Payment History, and Upcoming Invoices
 */

"use client";

import { useState } from 'react';
import { HeadingDivider, LogoutButton } from 'components';
import { MakePaymentTab } from './MakePaymentTab';
import { PaymentHistoryTab } from './PaymentHistoryTab';
import { UpcomingInvoicesTab } from './UpcomingInvoicesTab';
import { BsCreditCard2Front, BsClockHistory, BsFileEarmarkText } from 'react-icons/bs';

const TABS = {
	PAYMENT: 'make-payment',
	HISTORY: 'history',
	INVOICES: 'invoices'
};

export function ClientPortal({ userProfile }) {
	const [activeTab, setActiveTab] = useState(TABS.PAYMENT);

	return (
		<section className="section">
			<HeadingDivider title="Client Portal" />

			{/* User Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 dark:from-brand-purple/20 dark:to-brand-pink/20 rounded-lg border border-brand-purple/20">
				<div>
					<p className="text-2xl font-bold mb-1">
						Welcome, {userProfile.companyName || 'there'}!
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{userProfile.email}
					</p>
				</div>
				<LogoutButton />
			</div>

			{/* Tab Navigation */}
			<div className="border-b border-gray-200 dark:border-gray-700 mb-8">
				<nav className="flex flex-wrap gap-2 md:gap-4 -mb-px">
					<TabButton
						active={activeTab === TABS.PAYMENT}
						onClick={() => setActiveTab(TABS.PAYMENT)}
						icon={<BsCreditCard2Front />}
					>
						Make Payment
					</TabButton>
					<TabButton
						active={activeTab === TABS.HISTORY}
						onClick={() => setActiveTab(TABS.HISTORY)}
						icon={<BsClockHistory />}
					>
						Payment History
					</TabButton>
					<TabButton
						active={activeTab === TABS.INVOICES}
						onClick={() => setActiveTab(TABS.INVOICES)}
						icon={<BsFileEarmarkText />}
					>
						Upcoming Invoices
					</TabButton>
				</nav>
			</div>

			{/* Tab Content */}
			<div className="mt-8">
				{activeTab === TABS.PAYMENT && <MakePaymentTab userProfile={userProfile} />}
				{activeTab === TABS.HISTORY && <PaymentHistoryTab email={userProfile.email} />}
				{activeTab === TABS.INVOICES && <UpcomingInvoicesTab email={userProfile.email} />}
			</div>
		</section>
	);
}

/**
 * Tab Button Component
 */
function TabButton({ active, onClick, icon, children }) {
	return (
		<button
			onClick={onClick}
			className={`
        flex items-center gap-2 px-4 md:px-6 py-3 border-b-2 font-medium transition-all
        ${
					active
						? 'border-brand-purple text-brand-purple'
						: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-brand-purple hover:border-gray-300 dark:hover:border-gray-600'
				}
      `}
		>
			<span className="text-lg">{icon}</span>
			<span className="hidden sm:inline">{children}</span>
		</button>
	);
}
