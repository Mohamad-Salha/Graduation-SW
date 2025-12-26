import apiClient from "../client";

/**
 * Get student's payment history
 * @returns {Promise<Array>}
 */
export const getPaymentHistory = async () => {
	return apiClient.get("/student/payments");
};

/**
 * Get pending payments
 * @returns {Promise<Array>}
 */
export const getPendingPayments = async () => {
	return apiClient.get("/student/payments/pending");
};

/**
 * Make a payment
 * @param {object} paymentData
 * @returns {Promise<object>}
 */
export const makePayment = async (paymentData) => {
	return apiClient.post("/student/payments", paymentData);
};
