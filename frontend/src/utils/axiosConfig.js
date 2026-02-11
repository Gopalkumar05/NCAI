// utils/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ncai.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Make it globally available if needed
if (typeof window !== 'undefined') {
  window.api = api;
}

export default api;
