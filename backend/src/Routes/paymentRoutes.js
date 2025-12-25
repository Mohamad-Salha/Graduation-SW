const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/paymentController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/roleMiddleware");

// Apply authentication and student role check to all routes
router.use(verifyToken);
router.use(requireRole("student"));

// POST /api/student/payment/process - Process credit card payment
router.post("/process", (req, res) =>
	paymentController.processPayment(req, res)
);

// GET /api/student/payment/history - Get payment history
router.get("/history", (req, res) =>
	paymentController.getPaymentHistory(req, res)
);

// GET /api/student/payment/:paymentId - Get payment details
router.get("/:paymentId", (req, res) =>
	paymentController.getPaymentDetails(req, res)
);

module.exports = router;
