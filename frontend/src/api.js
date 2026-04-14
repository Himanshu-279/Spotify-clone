/**
 * Axios API Configuration
 * ==========================================
 * Central configuration for all HTTP requests to the backend
 * Handles JWT token injection and error responses
 */

import axios from 'axios'

/**
 * Create Axios instance with default configuration
 * baseURL: Backend API endpoint
 */
const API = axios.create({ 
  baseURL: 'http://localhost:5001/api/v1',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
})

/**
 * Request Interceptor
 * ==========================================
 * Automatically adds JWT token to Authorization header
 * Runs before every request is sent
 */
API.interceptors.request.use((req) => {
  // Retrieve JWT token from localStorage
  const token = localStorage.getItem('token');
  
  // If token exists, add it to Authorization header
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

/**
 * Response Interceptor
 * ==========================================
 * Handles errors globally
 * Logs user out if token is expired or invalid
 */
API.interceptors.response.use(
  (response) => response, // Success: return response as-is
  (error) => {
    // Check if error is due to invalid/expired token
    if (error.response?.status === 401) {
      // Clear stored data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
