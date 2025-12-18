/**
 * Email Templates
 * HTML and plain text templates for registration and payment confirmation emails
 */

import { emailConfig } from './email-config';

/**
 * Registration Welcome Email
 * @param {string} companyName - Company name from registration
 * @returns {Object} Email subject, HTML, and text content
 */
export const registrationEmail = (companyName) => ({
	subject: 'Welcome to the Client Portal',
	html: `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h1 style="color: #7c3aed; margin-bottom: 10px;">Welcome to the Client Portal</h1>
			</div>

			<p style="font-size: 16px; line-height: 1.6; color: #333;">
				Hi ${companyName},
			</p>

			<p style="font-size: 16px; line-height: 1.6; color: #333;">
				Thank you for registering! Your account has been successfully created.
			</p>

			<p style="font-size: 16px; line-height: 1.6; color: #333;">
				You can now access the client portal to:
			</p>

			<ul style="font-size: 16px; line-height: 1.8; color: #333;">
				<li>Make secure payments</li>
				<li>View your payment history</li>
				<li>Check upcoming invoices</li>
			</ul>

			<div style="text-align: center; margin: 40px 0;">
				<a href="${emailConfig.baseUrl}/clients"
				   style="background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
					Access Client Portal
				</a>
			</div>

			<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
				<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
					If you have any questions, please reply to this email.
				</p>
			</div>
		</div>
	`,
	text: `Welcome to the Client Portal!

Hi ${companyName},

Thank you for registering! Your account has been successfully created.

You can now access the client portal to:
- Make secure payments
- View your payment history
- Check upcoming invoices

Access the portal: ${emailConfig.baseUrl}/clients

If you have any questions, please reply to this email.`
});

/**
 * Payment Confirmation Email
 * @param {Object} data - Payment details
 * @param {string} data.companyName - Company name
 * @param {number} data.amount - Payment amount in dollars
 * @param {string} data.invoiceNumber - Invoice number (optional)
 * @param {string} data.description - Payment description (optional)
 * @param {string} data.sessionId - Stripe checkout session ID
 * @param {string} data.receiptUrl - Receipt URL (optional)
 * @returns {Object} Email subject, HTML, and text content
 */
export const paymentConfirmationEmail = (data) => {
	const { companyName, amount, invoiceNumber, description, receiptUrl } = data;

	return {
		subject: `Payment Confirmation - $${amount.toFixed(2)}`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #10b981; margin-bottom: 10px;">Payment Successful</h1>
				</div>

				<p style="font-size: 16px; line-height: 1.6; color: #333;">
					Hi ${companyName || 'there'},
				</p>

				<p style="font-size: 16px; line-height: 1.6; color: #333;">
					Thank you for your payment! Your transaction has been processed successfully.
				</p>

				<div style="background: #f3f4f6; padding: 24px; border-radius: 8px; margin: 30px 0;">
					<h3 style="margin-top: 0; margin-bottom: 20px; color: #111827; font-size: 18px;">
						Payment Details
					</h3>
					<table style="width: 100%; border-collapse: collapse;">
						<tr>
							<td style="padding: 10px 0; font-weight: 600; color: #374151;">Amount:</td>
							<td style="text-align: right; padding: 10px 0; font-size: 18px; font-weight: 700; color: #10b981;">
								$${amount.toFixed(2)}
							</td>
						</tr>
						${
							invoiceNumber
								? `
						<tr>
							<td style="padding: 10px 0; font-weight: 600; color: #374151;">Invoice #:</td>
							<td style="text-align: right; padding: 10px 0; color: #111827;">
								${invoiceNumber}
							</td>
						</tr>
						`
								: ''
						}
						${
							description
								? `
						<tr>
							<td style="padding: 10px 0; font-weight: 600; color: #374151;">Description:</td>
							<td style="text-align: right; padding: 10px 0; color: #111827;">
								${description}
							</td>
						</tr>
						`
								: ''
						}
					</table>
				</div>

				${
					receiptUrl
						? `
				<div style="text-align: center; margin: 40px 0;">
					<a href="${receiptUrl}"
					   style="background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
						View Receipt
					</a>
				</div>
				`
						: ''
				}

				<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
					<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
						If you have any questions about this payment, please reply to this email.
					</p>
				</div>
			</div>
		`,
		text: `Payment Successful!

Hi ${companyName || 'there'},

Thank you for your payment! Your transaction has been processed successfully.

Payment Details:
- Amount: $${amount.toFixed(2)}${invoiceNumber ? `\n- Invoice #: ${invoiceNumber}` : ''}${description ? `\n- Description: ${description}` : ''}

${receiptUrl ? `View receipt: ${receiptUrl}\n` : ''}
If you have any questions about this payment, please reply to this email.`
	};
};
