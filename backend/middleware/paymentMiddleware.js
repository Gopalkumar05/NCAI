const asyncHandler = require('express-async-handler');

// Validate payment amount
const validatePaymentAmount = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || amount < 0.5) {
    res.status(400);
    throw new Error('Invalid payment amount. Minimum amount is $0.50');
  }
  
  if (amount > 100000) {
    res.status(400);
    throw new Error('Payment amount exceeds maximum limit of $100,000');
  }
  
  next();
});

// Validate payment currency
const validatePaymentCurrency = asyncHandler(async (req, res, next) => {
  const { currency = 'usd' } = req.body;
  const allowedCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud'];
  
  if (!allowedCurrencies.includes(currency.toLowerCase())) {
    res.status(400);
    throw new Error(`Unsupported currency. Allowed currencies: ${allowedCurrencies.join(', ')}`);
  }
  
  next();
});

// Check if payment method belongs to user
const validatePaymentMethodOwnership = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // If user has stripeCustomerId, verify the payment method belongs to them
  if (req.user.stripeCustomerId) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const paymentMethod = await stripe.paymentMethods.retrieve(id);
      
      if (paymentMethod.customer !== req.user.stripeCustomerId) {
        res.status(403);
        throw new Error('Payment method does not belong to user');
      }
    } catch (error) {
      if (error.code === 'resource_missing') {
        res.status(404);
        throw new Error('Payment method not found');
      }
      throw error;
    }
  }
  
  next();
});

module.exports = {
  validatePaymentAmount,
  validatePaymentCurrency,
  validatePaymentMethodOwnership
};