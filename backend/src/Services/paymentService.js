const paymentRepo = require("../Repositories/paymentRepo");
const studentRepo = require("../Repositories/studentRepo");
const crypto = require("crypto");

class PaymentService {
	/**
	 * Process a credit card payment
	 * This simulates a payment gateway integration
	 * In production, integrate with Stripe, PayPal, etc.
	 */
	async processCardPayment(userId, paymentData) {
		const {
			amount,
			cardNumber,
			cardholderName,
			expiryMonth,
			expiryYear,
			cvv,
			sessionId,
			scheduleSlotId,
			description,
		} = paymentData;

		// Validate amount
		if (!amount || amount <= 0) {
			throw new Error("Invalid payment amount");
		}

		// Get student by userId
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student not found");
		}

		// Validate card details (basic validation)
		if (!this.validateCardNumber(cardNumber)) {
			throw new Error("Invalid card number");
		}

		if (!this.validateExpiryDate(expiryMonth, expiryYear)) {
			throw new Error("Card has expired or invalid expiry date");
		}

		if (!this.validateCVV(cvv)) {
			throw new Error("Invalid CVV");
		}

		// Get card brand
		const cardBrand = this.getCardBrand(cardNumber);
		const last4 = cardNumber.slice(-4);

		// Generate unique transaction ID
		const transactionId = this.generateTransactionId();

		// Create payment record
		const payment = await paymentRepo.createPayment({
			studentId: student._id,
			sessionId: sessionId || null,
			scheduleSlotId: scheduleSlotId || null,
			amount,
			paymentMethod: "credit_card",
			cardDetails: {
				last4,
				brand: cardBrand,
				expiryMonth,
				expiryYear,
			},
			status: "pending",
			transactionId,
			description: description || "Payment for practical session",
		});

		// Simulate payment gateway processing
		const paymentResult = await this.simulatePaymentGateway(
			payment._id,
			cardNumber,
			amount
		);

		if (paymentResult.success) {
			// Update payment status to completed
			await paymentRepo.updatePaymentStatus(payment._id, "completed");

			// Update the session/slot payment amount
			if (sessionId) {
				await paymentRepo.markStudentSessionPaid(sessionId, amount);
			}

			if (scheduleSlotId) {
				// Parse scheduleId and slotId from scheduleSlotId (format: "scheduleId_slotId")
				const [scheduleId, slotId] = scheduleSlotId.split("_");
				if (scheduleId && slotId) {
					await paymentRepo.markScheduleSlotPaid(
						scheduleId,
						slotId,
						amount
					);
				}
			}

			return {
				success: true,
				message: "Payment processed successfully",
				transactionId,
				amount,
				paymentId: payment._id,
				cardLast4: last4,
				cardBrand,
			};
		} else {
			// Update payment status to failed
			await paymentRepo.updatePaymentStatus(
				payment._id,
				"failed",
				paymentResult.reason
			);

			throw new Error(
				`Payment failed: ${paymentResult.reason || "Unknown error"}`
			);
		}
	}

	/**
	 * Get payment history for a student
	 */
	async getPaymentHistory(userId) {
		const student = await studentRepo.getStudentByUserId(userId);
		if (!student) {
			throw new Error("Student not found");
		}

		const payments = await paymentRepo.getStudentPayments(student._id);
		const stats = await paymentRepo.getStudentPaymentStats(student._id);

		// Calculate totals
		let totalPaid = 0;
		let totalPending = 0;
		let totalFailed = 0;

		stats.forEach((stat) => {
			if (stat._id === "completed") totalPaid = stat.total;
			if (stat._id === "pending") totalPending = stat.total;
			if (stat._id === "failed") totalFailed = stat.total;
		});

		return {
			payments: payments.map((p) => ({
				id: p._id,
				amount: p.amount,
				status: p.status,
				paymentMethod: p.paymentMethod,
				cardLast4: p.cardDetails?.last4,
				cardBrand: p.cardDetails?.brand,
				transactionId: p.transactionId,
				description: p.description,
				createdAt: p.createdAt,
				failureReason: p.failureReason,
			})),
			summary: {
				totalPaid,
				totalPending,
				totalFailed,
				totalTransactions: payments.length,
			},
		};
	}

	/**
	 * Get payment details
	 */
	async getPaymentDetails(userId, paymentId) {
		const payment = await paymentRepo.findById(paymentId);
		if (!payment) {
			throw new Error("Payment not found");
		}

		const student = await studentRepo.getStudentByUserId(userId);
		if (
			!student ||
			payment.studentId.toString() !== student._id.toString()
		) {
			throw new Error("Unauthorized access to payment details");
		}

		return {
			id: payment._id,
			amount: payment.amount,
			status: payment.status,
			paymentMethod: payment.paymentMethod,
			cardLast4: payment.cardDetails?.last4,
			cardBrand: payment.cardDetails?.brand,
			transactionId: payment.transactionId,
			description: payment.description,
			createdAt: payment.createdAt,
			failureReason: payment.failureReason,
			session: payment.sessionId
				? {
						id: payment.sessionId._id,
						date: payment.sessionId.date,
						time: payment.sessionId.time,
				  }
				: null,
		};
	}

	// ==================== HELPER METHODS ====================

	/**
	 * Simulate payment gateway (replace with real gateway in production)
	 */
	async simulatePaymentGateway(paymentId, cardNumber, amount) {
		// Simulate processing delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Test card numbers (simulate different scenarios)
		if (cardNumber === "4242424242424242") {
			// Success case
			return { success: true };
		} else if (cardNumber === "4000000000000002") {
			// Declined card
			return { success: false, reason: "Card declined" };
		} else if (cardNumber === "4000000000000069") {
			// Expired card
			return { success: false, reason: "Card expired" };
		} else if (cardNumber === "4000000000000127") {
			// Insufficient funds
			return { success: false, reason: "Insufficient funds" };
		} else if (cardNumber.startsWith("4")) {
			// Any other card starting with 4 (Visa) - Success
			return { success: true };
		} else if (cardNumber.startsWith("5")) {
			// Mastercard - Success
			return { success: true };
		} else if (cardNumber.startsWith("3")) {
			// Amex - Success
			return { success: true };
		} else {
			// Invalid card
			return { success: false, reason: "Invalid card number" };
		}
	}

	/**
	 * Generate unique transaction ID
	 */
	generateTransactionId() {
		const timestamp = Date.now();
		const random = crypto.randomBytes(8).toString("hex");
		return `TXN_${timestamp}_${random}`;
	}

	/**
	 * Validate card number using Luhn algorithm
	 */
	validateCardNumber(cardNumber) {
		// Remove spaces and dashes
		const cleaned = cardNumber.replace(/[\s-]/g, "");

		// Check if it's all digits and length is between 13-19
		if (!/^\d{13,19}$/.test(cleaned)) {
			return false;
		}

		// Luhn algorithm
		let sum = 0;
		let isEven = false;

		for (let i = cleaned.length - 1; i >= 0; i--) {
			let digit = parseInt(cleaned[i]);

			if (isEven) {
				digit *= 2;
				if (digit > 9) {
					digit -= 9;
				}
			}

			sum += digit;
			isEven = !isEven;
		}

		return sum % 10 === 0;
	}

	/**
	 * Validate expiry date
	 */
	validateExpiryDate(month, year) {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1;

		const expMonth = parseInt(month);
		const expYear = parseInt(year);

		// Check valid month
		if (expMonth < 1 || expMonth > 12) {
			return false;
		}

		// Handle 2-digit year
		const fullYear = expYear < 100 ? 2000 + expYear : expYear;

		// Check if expired
		if (fullYear < currentYear) {
			return false;
		}

		if (fullYear === currentYear && expMonth < currentMonth) {
			return false;
		}

		return true;
	}

	/**
	 * Validate CVV
	 */
	validateCVV(cvv) {
		return /^\d{3,4}$/.test(cvv);
	}

	/**
	 * Get card brand from card number
	 */
	getCardBrand(cardNumber) {
		const cleaned = cardNumber.replace(/[\s-]/g, "");

		if (/^4/.test(cleaned)) {
			return "visa";
		} else if (/^5[1-5]/.test(cleaned)) {
			return "mastercard";
		} else if (/^3[47]/.test(cleaned)) {
			return "amex";
		} else if (/^6(?:011|5)/.test(cleaned)) {
			return "discover";
		} else {
			return "unknown";
		}
	}
}

module.exports = new PaymentService();
