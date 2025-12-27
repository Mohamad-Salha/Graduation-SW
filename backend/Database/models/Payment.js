/**
 * Payment Model - Stores all payment transactions
 * {
 *   "_id": "6744c2f4e13b2a9f3c5d9001",
 *   "studentId": "6744c2f4e13b2a9f3c5d3001",
 *   "sessionId": "6744c2f4e13b2a9f3c5d3101",
 *   "amount": 35,
 *   "paymentMethod": "credit_card",
 *   "cardDetails": {
 *     "last4": "4242",
 *     "brand": "visa"
 *   },
 *   "status": "completed",
 *   "transactionId": "txn_1234567890",
 *   "description": "Payment for practical session",
 *   "createdAt": "2025-11-24T08:00:00.000Z"
 * }
 */
const mongoose = require("../connection");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
	studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
	sessionId: { type: Schema.Types.ObjectId, ref: "StudentSession" },
	scheduleSlotId: { type: String }, // For booked practical schedule slots
	amount: { type: Number, required: true },
	paymentMethod: {
		type: String,
		enum: ["credit_card", "debit_card", "cash", "bank_transfer"],
		default: "credit_card",
	},
	cardDetails: {
		last4: { type: String },
		brand: { type: String }, // visa, mastercard, amex
		expiryMonth: { type: String },
		expiryYear: { type: String },
	},
	status: {
		type: String,
		enum: ["pending", "completed", "failed", "refunded"],
		default: "pending",
	},
	transactionId: { type: String },
	description: { type: String },
	failureReason: { type: String },
	metadata: { type: Object }, // Additional payment info
	// Invoice details
	invoiceNumber: { type: String, unique: true, sparse: true },
	invoiceDate: { type: Date },
	dueDate: { type: Date },
	paymentType: {
		type: String,
		enum: ["registration", "license_fee", "practical_session", "exam_fee", "other"],
		default: "other"
	},
	paidBy: { type: String }, // Name of person who paid
	receiptUrl: { type: String }, // URL to receipt/invoice PDF
	notes: { type: String },
	// Admin tracking
	recordedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who recorded this
	verifiedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin who verified
	verifiedAt: { type: Date },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Index for faster queries
PaymentSchema.index({ studentId: 1, createdAt: -1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ status: 1 });

module.exports = mongoose.model("Payment", PaymentSchema);
