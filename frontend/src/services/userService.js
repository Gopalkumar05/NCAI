// // services/userService.js
// import api from './api';

// export const userService = {
//   // User Authentication
//   register: (data) => api.post('/users/register', data),
//   login: (email, password) => api.post('/users/login', { email, password }),
//   logout: () => api.post('/users/logout'),
//   forgotPassword: (email) => api.post('/users/forgot-password', { email }),
//   resetPassword: (token, data) => api.post(`/users/reset-password/${token}`, data),
  
//   // User Profile
//   getProfile: () => api.get('/users/profile'),
//   updateProfile: (data) => api.put('/users/profile', data),
//   changePassword: (data) => api.put('/users/change-password', data),
//   deleteAccount: () => api.delete('/users/account'),
  
//   // User Orders
//   getOrders: () => api.get('/users/orders'),
//   getOrderById: (id) => api.get(`/users/orders/${id}`),
//   cancelOrder: (id) => api.post(`/users/orders/${id}/cancel`),
  
//   // User Addresses
//   getAddresses: () => api.get('/users/addresses'),
//   addAddress: (data) => api.post('/users/addresses', data),
//   updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
//   deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
//   setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`),
  
//   // User Payments
//   getPaymentMethods: () => api.get('/users/payment-methods'),
//   addPaymentMethod: (data) => api.post('/users/payment-methods', data),
//   updatePaymentMethod: (id, data) => api.put(`/users/payment-methods/${id}`, data),
//   deletePaymentMethod: (id) => api.delete(`/users/payment-methods/${id}`),
//   setDefaultPaymentMethod: (id) => api.put(`/users/payment-methods/${id}/default`),
  
//   // User Wishlist
//   getWishlist: () => api.get('/users/wishlist'),
//   addToWishlist: (productId) => api.post('/users/wishlist', { productId }),
//   removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
  
//   // User Reviews
//   getReviews: () => api.get('/users/reviews'),
//   addReview: (data) => api.post('/users/reviews', data),
//   updateReview: (id, data) => api.put(`/users/reviews/${id}`, data),
//   deleteReview: (id) => api.delete(`/users/reviews/${id}`),
  
//   // User Notifications
//   getNotifications: () => api.get('/users/notifications'),
//   markAsRead: (id) => api.put(`/users/notifications/${id}/read`),
//   markAllAsRead: () => api.put('/users/notifications/read-all'),
//   deleteNotification: (id) => api.delete(`/users/notifications/${id}`),
  
//   // User Settings
//   getSettings: () => api.get('/users/settings'),
//   updateSettings: (data) => api.put('/users/settings', data),
//   subscribeNewsletter: () => api.post('/users/newsletter/subscribe'),
//   unsubscribeNewsletter: () => api.post('/users/newsletter/unsubscribe'),
  
//   // User Support
//   createTicket: (data) => api.post('/users/support/tickets', data),
//   getTickets: () => api.get('/users/support/tickets'),
//   getTicketById: (id) => api.get(`/users/support/tickets/${id}`),
//   addTicketReply: (id, data) => api.post(`/users/support/tickets/${id}/reply`, data),
  
//   // User Affiliate
//   getAffiliateInfo: () => api.get('/users/affiliate'),
//   getAffiliateStats: () => api.get('/users/affiliate/stats'),
//   getAffiliateReferrals: () => api.get('/users/affiliate/referrals'),
//   getAffiliatePayments: () => api.get('/users/affiliate/payments'),
  
//   // User Downloads
//   getDownloads: () => api.get('/users/downloads'),
//   downloadFile: (id) => api.get(`/users/downloads/${id}`, { responseType: 'blob' }),
// };

// export default userService;

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