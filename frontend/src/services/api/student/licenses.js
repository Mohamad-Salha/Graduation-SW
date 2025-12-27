import apiClient from '../client';

/**
 * Get all available licenses for enrollment
 */
export const getAvailableLicenses = async () => {
  try {
    const response = await apiClient.get('/api/student/licenses');
    return response;
  } catch (error) {
    console.error('Error fetching licenses:', error);
    throw error;
  }
};

/**
 * Enroll in a specific license
 */
export const enrollInLicense = async (licenseId) => {
  try {
    const response = await apiClient.post('/api/student/enroll', { licenseId });
    return response;
  } catch (error) {
    console.error('Error enrolling in license:', error);
    throw error;
  }
};
