const express = require('express');
const router = express.Router();
const {
  getShippingMethods,
  calculateShipping,
  getTaxes,
  createPaymentIntent,
  confirmPayment,
  getCheckoutSummary,
  validateCheckout
} = require('../controllers/checkoutController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/shipping-methods')
  .get(getShippingMethods);

router.route('/calculate-shipping')
  .post(calculateShipping);

router.route('/taxes')
  .post(getTaxes);

router.route('/payment-intent')
  .post(createPaymentIntent);

router.route('/confirm-payment')
  .post(confirmPayment);

router.route('/summary')
  .get(getCheckoutSummary);

router.route('/validate')
  .post(validateCheckout);

module.exports = router;