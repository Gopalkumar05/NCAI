// services/orderService.js
import api from './api';

export const orderService = {
  // Orders
  createOrder: (data) => api.post('/orders', data),
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
  trackOrder: (id) => api.get(`/orders/${id}/track`),
  
  // Cart
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (id, data) => api.put(`/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
  
  // Checkout
  getShippingMethods: () => api.get('/checkout/shipping-methods'),
  calculateShipping: (data) => api.post('/checkout/calculate-shipping', data),
  getTaxes: (data) => api.post('/checkout/taxes', data),
  createPaymentIntent: (data) => api.post('/checkout/payment-intent', data),
  confirmPayment: (data) => api.post('/checkout/confirm-payment', data),
  validateCheckout: (data) => api.post('/checkout/validate', data),
  
  // Payment Methods
  getPaymentMethods: () => api.get('payment/methods'),
  
  // Order Analytics (for users)
  getOrderStats: () => api.get('/orders/stats'),
};

export default orderService;