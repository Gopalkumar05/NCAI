// services/authService.js
import api from './api';

export const authService = {
  // ===== ADMIN AUTHENTICATION =====
  registerAdmin: (data) => api.post('/admin/auth/register', data),
  verifyEmail: (token) => api.get(`/admin/auth/verify-email/${token}`),
  loginAdmin: (email, password) => api.post('/admin/auth/login', { email, password }),
  getCurrentAdmin: () => api.get('/admin/auth/me'),
  updateAdminProfile: (data) => api.put('/admin/auth/update-profile', data),
  changeAdminPassword: (data) => api.put('/admin/auth/change-password', data),
  forgotAdminPassword: (email) => api.post('/admin/auth/forgot-password', { email }),
  resetAdminPassword: (token, data) => api.post(`/admin/auth/reset-password/${token}`, data),
  resendVerification: () => api.post('/admin/auth/resend-verification'),
  logout: () => api.post('/admin/auth/logout'),
   validateResetToken: (token) => api.get(`/admin/auth/validate-reset-token/${token}`),
  
  // ===== USER AUTHENTICATION =====
  registerUser: (data) => api.post('/users/register', data),
  loginUser: (email, password) => api.post('/users/login', { email, password }),
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.put('/users/update-profile', data),
  changeUserPassword: (data) => api.put('/users/change-password', data),
  forgotUserPassword: (email) => api.post('/users/forgot-password', { email }),
  resetUserPassword: (token, data) => api.put(`/users/reset-password/${token}`, data),
  verifyUserEmail: (token) => api.get(`/users/verify-email/${token}`),
  resendUserVerification: () => api.post('/users/resend-verification'),
  logoutUser: () => api.post('/users/logout'),
  
  // ===== COMMON =====
  refreshToken: () => api.post('/auth/refresh'),
  validateToken: (token) => api.post('/auth/validate', { token }),
};

export default authService;