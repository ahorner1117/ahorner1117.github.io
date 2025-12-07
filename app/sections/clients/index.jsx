"use client";

import { useRef, useState, useEffect } from "react";
import { LazyMotion, domAnimation, useInView } from "framer-motion";
import { HeadingDivider } from "components";
import { BsCreditCard2Front } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function ClientsSection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	// Form state
	const [amount, setAmount] = useState("");
	const [email, setEmail] = useState("");
	const [description, setDescription] = useState("");
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Success/cancel message handling
	const [paymentStatus, setPaymentStatus] = useState(null);

	useEffect(() => {
		// Check URL for payment status
		const params = new URLSearchParams(window.location.search);
		const status = params.get('payment');

		if (status === 'success') {
			setPaymentStatus('success');
			// Clear URL params after showing message
			setTimeout(() => {
				window.history.replaceState({}, '', window.location.pathname);
			}, 100);
		} else if (status === 'cancelled') {
			setPaymentStatus('cancelled');
			setTimeout(() => {
				window.history.replaceState({}, '', window.location.pathname);
			}, 100);
		}
	}, []);

	// Format amount input
	const handleAmountChange = (e) => {
		const value = e.target.value.replace(/[^0-9.]/g, '');

		// Allow only one decimal point
		const parts = value.split('.');
		if (parts.length > 2) return;

		// Limit to 2 decimal places
		if (parts[1] && parts[1].length > 2) return;

		setAmount(value);
		setError(""); // Clear error on input change
	};

	const getDate = () => {
		const date = new Date();
		const fullDateString = date.toDateString();
		return  fullDateString;
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// Validation
		const numAmount = parseFloat(amount);

		if (!amount || isNaN(numAmount) || numAmount < 1) {
			setError("Please enter an amount of at least $1.00");
			setLoading(false);
			return;
		}

		if (numAmount > 999999) {
			setError("Amount cannot exceed $999,999.00");
			setLoading(false);
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			setError("Please enter a valid email address");
			setLoading(false);
			return;
		}

		try {
			// Call API to create Stripe Checkout session
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: numAmount,
					email: email.trim(),
					description: description.trim(),
					invoiceNumber: invoiceNumber.trim(),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create checkout session');
			}

			// Redirect to Stripe Checkout
			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error('No checkout URL received');
			}
		} catch (err) {
			console.error('Payment error:', err);
			setError(err.message || 'An error occurred. Please try again.');
			setLoading(false);
		}
	};

	return (
		<LazyMotion features={domAnimation}>
			<section id="clients" className="section">
				<HeadingDivider title="Client Payments" />

				<div className="pt-8 pb-16">
					{/* Introductory Text */}
					<div
						className="text-md font-light leading-relaxed mb-8 max-w-3xl"
						style={{
							transform: isInView ? "none" : "translateX(-200px)",
							opacity: isInView ? 1 : 0,
							transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
						}}
					>
						<p className="text-lg mb-4">
							Welcome! Use this secure payment form to complete your invoice payment.
							All transactions are processed through Stripe's industry-leading secure
							checkout system.
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							If you have any questions about your invoice, please contact me before
							submitting payment.
						</p>
					</div>

					{/* Success/Cancel Messages */}
					{paymentStatus === 'success' && (
						<div
							className="mb-8 p-6 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg"
							style={{
								transform: isInView ? "none" : "translateY(-30px)",
								opacity: isInView ? 1 : 0,
								transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
							}}
						>
							<h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
								Payment Successful!
							</h3>
							<p className="text-green-700 dark:text-green-300">
								Thank you for your payment. You should receive a receipt via email shortly.
							</p>
						</div>
					)}

					{paymentStatus === 'cancelled' && (
						<div
							className="mb-8 p-6 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-lg"
							style={{
								transform: isInView ? "none" : "translateY(-30px)",
								opacity: isInView ? 1 : 0,
								transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
							}}
						>
							<h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
								Payment Cancelled
							</h3>
							<p className="text-yellow-700 dark:text-yellow-300">
								Your payment was cancelled. Feel free to try again or contact me if you
								need assistance.
							</p>
						</div>
					)}

					{/* Payment Form */}
					<div className="flex justify-center">
						<div
							ref={ref}
							className="w-full max-w-2xl bg-card-light dark:bg-card-dark rounded-lg p-8 border border-gray-200 dark:border-gray-700"
							style={{
								transform: isInView ? "none" : "translateY(50px)",
								opacity: isInView ? 1 : 0,
								transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
							}}
						>
							<div className="flex items-center gap-3 mb-6">
								<BsCreditCard2Front className="text-3xl text-brand-purple" />
								<h3 className="text-2xl font-bold">Secure Payment</h3>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Amount Input */}
								<div>
									<label
										htmlFor="amount"
										className="block text-sm font-medium mb-2"
									>
										Payment Amount <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium">
											$
										</span>
										<input
											type="text"
											id="amount"
											value={amount}
											onChange={handleAmountChange}
											placeholder="0.00"
											required
											disabled={loading}
											className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
										/>
									</div>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										Enter amount in USD (e.g., 100.00)
									</p>
								</div>

								{/* Email Input */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium mb-2"
									>
										Email Address <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="your@email.com"
										required
										disabled={loading}
										className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
									/>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										Receipt will be sent to this email
									</p>
								</div>

								{/* Invoice Number (Optional) */}
								<div>
									<label
										htmlFor="invoiceNumber"
										className="block text-sm font-medium mb-2"
									>
										Invoice Number <span className="text-gray-500">(Optional)</span>
									</label>
									<input
										type="text"
										id="invoiceNumber"
										value={invoiceNumber}
										onChange={(e) => setInvoiceNumber(e.target.value)}
										placeholder="e.g., INV-2024-001"
										disabled={loading}
										maxLength={50}
										className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
									/>
								</div>

								{/* Description (Optional) */}
								<div>
									<label
										htmlFor="description"
										className="block text-sm font-medium mb-2"
									>
										Payment Description <span className="text-gray-500">(Optional)</span>
									</label>
									<textarea
										id="description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder={`e.g., Website development services -  ${ getDate()}`}
										disabled={loading}
										rows={3}
										maxLength={200}
										className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
									/>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{description.length}/200 characters
									</p>
								</div>

								{/* Error Message */}
								{error && (
									<div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg">
										<p className="text-sm text-red-800 dark:text-red-200">{error}</p>
									</div>
								)}

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full py-4 px-6 bg-brand-purple text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-3"
								>
									{loading ? (
										<>
											<AiOutlineLoading3Quarters className="text-xl animate-spin" />
											Processing...
										</>
									) : (
										<>
											<BsCreditCard2Front className="text-xl" />
											Proceed to Secure Checkout
										</>
									)}
								</button>

								{/* Security Badge */}
								<div className="text-center text-sm text-gray-600 dark:text-gray-400">
									<p className="flex items-center justify-center gap-2">
										<svg
											className="w-4 h-4 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
												clipRule="evenodd"
											/>
										</svg>
										Secured by Stripe | PCI Compliant
									</p>
									<p className="mt-1 text-xs">
										Your payment information is encrypted and never stored on our servers.
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</LazyMotion>
	);
}
