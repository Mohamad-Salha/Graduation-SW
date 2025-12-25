const Payment = require("../../Database/models/Payment");
const StudentSession = require("../../Database/models/StudentSession");
const PracticalSchedule = require("../../Database/models/PracticalSchedule");
const Student = require("../../Database/models/Student");

class PaymentRepository {
	// Create a payment record
	async createPayment(paymentData) {
		const payment = new Payment(paymentData);
		return await payment.save();
	}

	// Find payment by transaction ID
	async findByTransactionId(transactionId) {
		return await Payment.findOne({ transactionId }).populate("studentId");
	}

	// Find payment by ID
	async findById(paymentId) {
		return await Payment.findById(paymentId)
			.populate("studentId")
			.populate("sessionId");
	}

	// Get all payments for a student
	async getStudentPayments(studentId) {
		return await Payment.find({ studentId })
			.populate("sessionId")
			.sort({ createdAt: -1 });
	}

	// Get payment statistics for a student
	async getStudentPaymentStats(studentId) {
		const stats = await Payment.aggregate([
			{ $match: { studentId } },
			{
				$group: {
					_id: "$status",
					total: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
		]);

		return stats;
	}

	// Update payment status
	async updatePaymentStatus(paymentId, status, failureReason = null) {
		const updateData = {
			status,
			updatedAt: new Date(),
		};

		if (failureReason) {
			updateData.failureReason = failureReason;
		}

		return await Payment.findByIdAndUpdate(paymentId, updateData, {
			new: true,
		});
	}

	// Get pending payments for a student
	async getPendingPayments(studentId) {
		return await Payment.find({ studentId, status: "pending" })
			.populate("sessionId")
			.sort({ createdAt: -1 });
	}

	// Mark session as paid in PracticalSchedule
	async markScheduleSlotPaid(scheduleId, slotId, amount) {
		return await PracticalSchedule.findOneAndUpdate(
			{ _id: scheduleId, "weeklySlots._id": slotId },
			{
				$set: {
					"weeklySlots.$.paymentAmount": amount,
				},
			},
			{ new: true }
		);
	}

	// Mark session as paid in StudentSession
	async markStudentSessionPaid(sessionId, amount) {
		return await StudentSession.findByIdAndUpdate(
			sessionId,
			{ paymentAmount: amount },
			{ new: true }
		);
	}

	// Get all payments (admin)
	async getAllPayments(filters = {}) {
		const query = {};
		if (filters.status) query.status = filters.status;
		if (filters.studentId) query.studentId = filters.studentId;
		if (filters.startDate) {
			query.createdAt = { $gte: new Date(filters.startDate) };
		}
		if (filters.endDate) {
			query.createdAt = {
				...query.createdAt,
				$lte: new Date(filters.endDate),
			};
		}

		return await Payment.find(query)
			.populate("studentId")
			.populate("sessionId")
			.sort({ createdAt: -1 });
	}

	// Get payment summary
	async getPaymentSummary() {
		return await Payment.aggregate([
			{
				$group: {
					_id: "$status",
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
		]);
	}
}

module.exports = new PaymentRepository();
