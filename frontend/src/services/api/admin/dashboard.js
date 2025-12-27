import apiClient from '../client';

// Dashboard Statistics
export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response;
};

export const getRecentActivities = async (limit = 10) => {
  const response = await apiClient.get(`/admin/dashboard/activities?limit=${limit}`);
  return response;
};

export const getRevenueAnalytics = async (startDate, endDate) => {
  let url = '/admin/dashboard/revenue';
  const params = [];
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  
  const response = await apiClient.get(url);
  return response;
};
