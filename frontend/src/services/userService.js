
import api from './api';

export const userService = {
  // Profile
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  deleteAccount: (password) => api.delete('/users/account', { data: { password } }),
  changePassword: (data) => api.put('/users/change-password', data),
  
  // Addresses
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`),
  
  // Orders
  getOrders: (params) => api.get('/users/orders', { params }),
  getOrderById: (id) => api.get(`/users/orders/${id}`),
  cancelOrder: (id) => api.put(`/users/orders/${id}/cancel`),
  
  // Payment Methods
  getPaymentMethods: () => api.get('/users/payment-methods'),
  addPaymentMethod: (data) => api.post('/users/payment-methods', data),
  deletePaymentMethod: (id) => api.delete(`/users/payment-methods/${id}`),
  
  // Notifications
  getNotifications: () => api.get('/users/notifications'),
  
  // Settings
  getSettings: () => api.get('/users/settings'),
  updateSettings: (data) => api.put('/users/settings', data),
};

export default userService;
