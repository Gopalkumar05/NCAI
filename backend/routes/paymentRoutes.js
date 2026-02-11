const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  getPaymentMethods,
  savePaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  createSetupIntent,
  getPaymentHistory,
  getPaymentDetails,
  createRefund,
  handleWebhook,
  getPaymentConfig
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/config', getPaymentConfig);
router.post('/webhook', handleWebhook); // Must be public for Stripe webhooks

// Protected routes
router.use(protect);

// Payment intents
router.post('/create-payment-intent', createPaymentIntent);
router.post('/setup-intent', createSetupIntent);

// Payment methods
router.get('/methods', getPaymentMethods);
router.post('/methods', savePaymentMethod);
router.delete('/methods/:id', removePaymentMethod);
router.put('/methods/:id/default', setDefaultPaymentMethod);

// Payment history and details
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentDetails);

// Admin only routes
router.post('/:id/refund', admin, createRefund);

module.exports = router;