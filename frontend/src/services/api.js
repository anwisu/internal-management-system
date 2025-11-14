import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

/**
 * Axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor
 */
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    } else {
      // Handle API errors
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        'An error occurred';
      error.message = errorMessage;
    }

    return Promise.reject(error);
  }
);

export default api;

