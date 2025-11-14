import api from './api.js';

/**
 * Dashboard service - handles dashboard-related API calls
 */

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

