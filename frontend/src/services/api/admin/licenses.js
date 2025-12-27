import apiClient from '../client';

// Get all licenses
export const getAllLicenses = async () => {
  return await apiClient.get('/admin/licenses');
};

// Create new license
export const createLicense = async (licenseData) => {
  return await apiClient.post('/admin/licenses', licenseData);
};

// Update license
export const updateLicense = async (licenseId, updateData) => {
  return await apiClient.put(`/admin/licenses/${licenseId}`, updateData);
};

// Delete license
export const deleteLicense = async (licenseId) => {
  return await apiClient.delete(`/admin/licenses/${licenseId}`);
};
