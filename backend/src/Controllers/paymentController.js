const paymentService = require("../Services/paymentService");

class PaymentController {
	// POST /api/student/payment/process
	async processPayment(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const paymentData = req.body;

			// Validate required fields
			const {
				amount,
				cardNumber,
				cardholderName,
				expiryMonth,
				expiryYear,
				cvv,
			} = paymentData;

			if (
				!amount ||
				!cardNumber ||
				!cardholderName ||
				!expiryMonth ||
				!expiryYear ||
				!cvv
			) {
				return res.status(400).json({
					error: "All payment details are required",
				});
			}

			const result = await paymentService.processCardPayment(
				userId,
				paymentData
			);

			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({
				error: error.message,
				success: false,
			});
		}
	}

	// GET /api/student/payment/history
	async getPaymentHistory(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const result = await paymentService.getPaymentHistory(userId);

			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	// GET /api/student/payment/:paymentId
	async getPaymentDetails(req, res) {
		try {
			const userId = req.user.id; // From JWT token
			const { paymentId } = req.params;

			if (!paymentId) {
				return res.status(400).json({
					error: "Payment ID is required",
				});
			}

			const result = await paymentService.getPaymentDetails(
				userId,
				paymentId
			);

			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

module.exports = new PaymentController();
