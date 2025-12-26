import apiClient from "../client";

/**
 * Get trainer's payment tracking
 * @returns {Promise<Array>}
 */
export const getPaymentTracking = async () => {
	return apiClient.get("/trainer/payments");
};

/**
 * Get pending payments
 * @returns {Promise<Array>}
 */
export const getPendingPayments = async () => {
	return apiClient.get("/trainer/payments/pending");
};

/**
 * Get payment history
 * @returns {Promise<Array>}
 */
export const getPaymentHistory = async () => {
	return apiClient.get("/trainer/payments/history");
};
