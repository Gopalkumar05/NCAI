
import api from './api';

export const adminService = {
  // Dashboard Statistics
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // User Management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  banUser: (id) => api.post(`/admin/users/${id}/ban`),
  unbanUser: (id) => api.post(`/admin/users/${id}/unban`),
  
  // Product Management
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  getProductById: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  

  // Category Management
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Order Management
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}`, data),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  getOrderAnalytics: (params) => api.get('/admin/orders/analytics', { params }),
  
  // Payment Management
  getPayments: (params = {}) => api.get('/admin/payments', { params }),
  updatePaymentStatus: (id, data) => api.put(`/admin/payments/${id}`, data),
  getPaymentAnalytics: (params) => api.get('/admin/payments/analytics', { params }),
  
  // Admin Management (Super Admin Only)
  getAdmins: () => api.get('/admin/auth/admins'),
  getAdminById: (id) => api.get(`/admin/auth/admins/${id}`),
  createAdmin: (data) => api.post('/admin/auth/admins', data),
  updateAdmin: (id, data) => api.put(`/admin/auth/admins/${id}`, data),
  deleteAdmin: (id) => api.delete(`/admin/auth/admins/${id}`),
  updateAdminStatus: (id, data) => api.put(`/admin/auth/admins/${id}/status`, data),
  
  // Analytics & Reports
  getAnalytics: (params = {}) => api.get('/admin/analytics', { params }),
  getSalesReport: (params) => api.get('/admin/analytics/sales', { params }),
  getUserAnalytics: (params) => api.get('/admin/analytics/users', { params }),
  getProductAnalytics: (params) => api.get('/admin/analytics/products', { params }),
  getRevenueAnalytics: (params) => api.get('/admin/analytics/revenue', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  getGeneralSettings: () => api.get('/admin/settings/general'),
  updateGeneralSettings: (data) => api.put('/admin/settings/general', data),
  getEmailSettings: () => api.get('/admin/settings/email'),
  updateEmailSettings: (data) => api.put('/admin/settings/email', data),
  getPaymentSettings: () => api.get('/admin/settings/payment'),
  updatePaymentSettings: (data) => api.put('/admin/settings/payment', data),
  
  // File Upload
  uploadImage: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    return api.post('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadMultipleImages: (files, type = 'general') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('type', type);
    return api.post('/admin/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (imageUrl) => api.delete('/admin/upload/image', { data: { imageUrl } }),
  
  // Content Management
  getPages: () => api.get('/admin/pages'),
  getPageBySlug: (slug) => api.get(`/admin/pages/${slug}`),
  createPage: (data) => api.post('/admin/pages', data),
  updatePage: (id, data) => api.put(`/admin/pages/${id}`, data),
  deletePage: (id) => api.delete(`/admin/pages/${id}`),
  
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data) => api.post('/admin/banners', data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
  
  // Reviews & Ratings
  getReviews: (params = {}) => api.get('/admin/reviews', { params }),
  updateReview: (id, data) => api.put(`/admin/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  
  // Coupons & Discounts
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  
  // Newsletter
  getSubscribers: (params = {}) => api.get('/admin/newsletter/subscribers', { params }),
  sendNewsletter: (data) => api.post('/admin/newsletter/send', data),
  deleteSubscriber: (id) => api.delete(`/admin/newsletter/subscribers/${id}`),
  
  // Backup & Export
  exportData: (type, params) => api.get(`/admin/export/${type}`, { params, responseType: 'blob' }),
  createBackup: () => api.post('/admin/backup'),
  getBackups: () => api.get('/admin/backups'),
  restoreBackup: (id) => api.post(`/admin/backups/${id}/restore`),
  deleteBackup: (id) => api.delete(`/admin/backups/${id}`),
  
  // Logs & Activity
  getActivityLogs: (params = {}) => api.get('/admin/logs/activity', { params }),
  getErrorLogs: (params = {}) => api.get('/admin/logs/errors', { params }),
  clearLogs: (type) => api.delete(`/admin/logs/${type}`),
  
  // System Info
  getSystemInfo: () => api.get('/admin/system/info'),
  clearCache: () => api.post('/admin/system/clear-cache'),
  
  // Notification Management
  getNotifications: (params = {}) => api.get('/admin/notifications', { params }),
  markNotificationAsRead: (id) => api.put(`/admin/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.put('/admin/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/admin/notifications/${id}`),
  
  // Support & Tickets
  getTickets: (params = {}) => api.get('/admin/support/tickets', { params }),
  getTicketById: (id) => api.get(`/admin/support/tickets/${id}`),
  updateTicket: (id, data) => api.put(`/admin/support/tickets/${id}`, data),
  addTicketReply: (id, data) => api.post(`/admin/support/tickets/${id}/reply`, data),
  closeTicket: (id) => api.put(`/admin/support/tickets/${id}/close`),
  deleteTicket: (id) => api.delete(`/admin/support/tickets/${id}`),
  
  // Customer Support
  getChats: (params = {}) => api.get('/admin/support/chats', { params }),
  getChatById: (id) => api.get(`/admin/support/chats/${id}`),
  sendMessage: (id, data) => api.post(`/admin/support/chats/${id}/message`, data),
  closeChat: (id) => api.put(`/admin/support/chats/${id}/close`),
  
  // Import Data
  importData: (type, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post(`/admin/import/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // SEO Management
  getSEO: (params = {}) => api.get('/admin/seo', { params }),
  updateSEO: (id, data) => api.put(`/admin/seo/${id}`, data),
  generateSitemap: () => api.post('/admin/seo/generate-sitemap'),
  
  // Shipping & Delivery
  getShippingMethods: () => api.get('/admin/shipping/methods'),
  createShippingMethod: (data) => api.post('/admin/shipping/methods', data),
  updateShippingMethod: (id, data) => api.put(`/admin/shipping/methods/${id}`, data),
  deleteShippingMethod: (id) => api.delete(`/admin/shipping/methods/${id}`),
  
  getShippingZones: () => api.get('/admin/shipping/zones'),
  createShippingZone: (data) => api.post('/admin/shipping/zones', data),
  updateShippingZone: (id, data) => api.put(`/admin/shipping/zones/${id}`, data),
  deleteShippingZone: (id) => api.delete(`/admin/shipping/zones/${id}`),
  
  // Tax Management
  getTaxRates: () => api.get('/admin/tax/rates'),
  createTaxRate: (data) => api.post('/admin/tax/rates', data),
  updateTaxRate: (id, data) => api.put(`/admin/tax/rates/${id}`, data),
  deleteTaxRate: (id) => api.delete(`/admin/tax/rates/${id}`),
  
  // Inventory Management
  getInventory: (params = {}) => api.get('/admin/inventory', { params }),
  updateInventory: (id, data) => api.put(`/admin/inventory/${id}`, data),
  getLowStock: () => api.get('/admin/inventory/low-stock'),
  getStockHistory: (id) => api.get(`/admin/inventory/${id}/history`),
  
  // Wishlist Management
  getUserWishlists: (params = {}) => api.get('/admin/wishlists', { params }),
  getUserWishlist: (userId) => api.get(`/admin/wishlists/${userId}`),
  
  // Returns & Refunds
  getReturns: (params = {}) => api.get('/admin/returns', { params }),
  getReturnById: (id) => api.get(`/admin/returns/${id}`),
  updateReturn: (id, data) => api.put(`/admin/returns/${id}`, data),
  processRefund: (id, data) => api.post(`/admin/returns/${id}/refund`, data),
  
  // Gift Cards
  getGiftCards: (params = {}) => api.get('/admin/gift-cards', { params }),
  createGiftCard: (data) => api.post('/admin/gift-cards', data),
  updateGiftCard: (id, data) => api.put(`/admin/gift-cards/${id}`, data),
  deleteGiftCard: (id) => api.delete(`/admin/gift-cards/${id}`),
  
  // Affiliate Management
  getAffiliates: (params = {}) => api.get('/admin/affiliates', { params }),
  getAffiliateById: (id) => api.get(`/admin/affiliates/${id}`),
  updateAffiliate: (id, data) => api.put(`/admin/affiliates/${id}`, data),
  processAffiliatePayment: (id, data) => api.post(`/admin/affiliates/${id}/payment`, data),
  
  // API Keys
  getApiKeys: () => api.get('/admin/api-keys'),
  createApiKey: (data) => api.post('/admin/api-keys', data),
  updateApiKey: (id, data) => api.put(`/admin/api-keys/${id}`, data),
  deleteApiKey: (id) => api.delete(`/admin/api-keys/${id}`),
  regenerateApiKey: (id) => api.post(`/admin/api-keys/${id}/regenerate`),
  
  // Custom Fields
  getCustomFields: (type) => api.get(`/admin/custom-fields/${type}`),
  createCustomField: (data) => api.post('/admin/custom-fields', data),
  updateCustomField: (id, data) => api.put(`/admin/custom-fields/${id}`, data),
  deleteCustomField: (id) => api.delete(`/admin/custom-fields/${id}`),
  
  // Webhooks
  getWebhooks: () => api.get('/admin/webhooks'),
  createWebhook: (data) => api.post('/admin/webhooks', data),
  updateWebhook: (id, data) => api.put(`/admin/webhooks/${id}`, data),
  deleteWebhook: (id) => api.delete(`/admin/webhooks/${id}`),
  testWebhook: (id) => api.post(`/admin/webhooks/${id}/test`),
};

export default adminService;