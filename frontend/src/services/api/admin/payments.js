import apiClient from '../client';

// Get all payments
export const getAllPayments = async (filters = {}) => {
  let url = '/admin/payments';
  const params = [];
  if (filters.status) params.push(`status=${filters.status}`);
  if (filters.paymentType) params.push(`paymentType=${filters.paymentType}`);
  if (filters.studentId) params.push(`studentId=${filters.studentId}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  
  return await apiClient.get(url);
};

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  return await apiClient.get(`/admin/payments/${paymentId}`);
};

// Create payment record
export const createPayment = async (paymentData) => {
  return await apiClient.post('/admin/payments', paymentData);
};

// Update payment
export const updatePayment = async (paymentId, updateData) => {
  return await apiClient.put(`/admin/payments/${paymentId}`, updateData);
};
