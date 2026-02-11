// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSalesAnalytics,
  getInventoryAnalytics,
  getCustomerAnalytics,
  getRealtimeData,
  getAnalyticsSummary,
  getUserAnalytics,
  getProductAnalytics,
  getRevenueAnalytics
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.use(protect, admin);

// @route   GET /api/admin/analytics
// @desc    Get analytics summary (for dashboard)
// @access  Private/Admin
router.get('/analytics', getAnalyticsSummary);

// @route   GET /api/admin/analytics/sales
// @desc    Get sales analytics
// @access  Private/Admin
router.get('/analytics/sales', getSalesAnalytics);

// @route   GET /api/admin/analytics/inventory
// @desc    Get inventory analytics
// @access  Private/Admin
router.get('/analytics/inventory', getInventoryAnalytics);

// @route   GET /api/admin/analytics/customers
// @desc    Get customer analytics
// @access  Private/Admin
router.get('/analytics/customers', getCustomerAnalytics);

// @route   GET /api/admin/analytics/users
// @desc    Get user analytics
// @access  Private/Admin
router.get('/analytics/users', getUserAnalytics);

// @route   GET /api/admin/analytics/products
// @desc    Get product analytics
// @access  Private/Admin
router.get('/analytics/products', getProductAnalytics);

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Private/Admin
router.get('/analytics/revenue', getRevenueAnalytics);

// @route   GET /api/admin/analytics/realtime
// @desc    Get real-time dashboard data
// @access  Private/Admin
router.get('/analytics/realtime', getRealtimeData);

module.exports = router;