// const asyncHandler = require('express-async-handler');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // @desc    Create payment intent
// // @route   POST /api/payment/create-payment-intent
// // @access  Private
// const createPaymentIntent = asyncHandler(async (req, res) => {
//   const { amount, currency = 'usd' } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency,
//       metadata: {
//         userId: req.user._id.toString()
//       }
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id
//     });
//   } catch (error) {
//     res.status(500);
//     throw new Error('Payment processing failed');
//   }
// });

// // @desc    Get payment methods
// // @route   GET /api/payment/methods
// // @access  Private
// const getPaymentMethods = asyncHandler(async (req, res) => {
//   // This would require saving customer IDs in your database
//   // For simplicity, we'll just return an empty array
//   res.json([]);
// });

// // @desc    Handle payment success webhook
// // @route   POST /api/payment/webhook
// // @access  Public
// const handleWebhook = asyncHandler(async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error('Webhook error:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       // Update order status in database
//       console.log('Payment succeeded:', paymentIntent.id);
//       break;
//     case 'payment_intent.payment_failed':
//       const failedPayment = event.data.object;
//       console.log('Payment failed:', failedPayment.id);
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// });

// module.exports = {
//   createPaymentIntent,
//   getPaymentMethods,
//   handleWebhook
// };

const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { 
    amount, 
    currency = 'usd',
    description,
    metadata = {},
    setup_future_usage = null 
  } = req.body;

  if (!amount || amount < 1) {
    res.status(400);
    throw new Error('Invalid amount. Minimum amount is $1.00');
  }

  try {
    // Get or create Stripe customer
    let stripeCustomerId = req.user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone,
        metadata: {
          userId: req.user._id.toString(),
          userType: req.user.role
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Save customer ID to user
      req.user.stripeCustomerId = stripeCustomerId;
      await req.user.save();
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: stripeCustomerId,
      description: description || `Payment for order from ${req.user.email}`,
      metadata: {
        ...metadata,
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        userName: req.user.name
      },
      setup_future_usage: setup_future_usage,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      shipping: metadata.shipping || null,
      receipt_email: metadata.receiptEmail || req.user.email
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      customerId: stripeCustomerId,
      createdAt: paymentIntent.created
    });
  } catch (error) {
    console.error('Stripe error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      res.status(400);
      throw new Error(`Card error: ${error.message}`);
    } else if (error.type === 'StripeRateLimitError') {
      res.status(429);
      throw new Error('Too many requests. Please try again later.');
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400);
      throw new Error(`Invalid request: ${error.message}`);
    } else if (error.type === 'StripeAPIError') {
      res.status(500);
      throw new Error('Stripe API error. Please try again.');
    } else if (error.type === 'StripeConnectionError') {
      res.status(500);
      throw new Error('Network error. Please check your connection.');
    } else if (error.type === 'StripeAuthenticationError') {
      res.status(500);
      throw new Error('Authentication error with payment processor.');
    } else {
      res.status(500);
      throw new Error('Payment processing failed. Please try again.');
    }
  }
});

// @desc    Get payment methods for customer
// @route   GET /api/payment/methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  try {
    if (!req.user.stripeCustomerId) {
      return res.json([]);
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    });

    // Format response
    const formattedMethods = paymentMethods.data.map(method => ({
      id: method.id,
      type: method.type,
      card: {
        brand: method.card.brand,
        last4: method.card.last4,
        expMonth: method.card.exp_month,
        expYear: method.card.exp_year,
        country: method.card.country
      },
      billing_details: method.billing_details,
      created: method.created,
      isDefault: method.id === req.user.defaultPaymentMethodId
    }));

    res.json(formattedMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.json([]); // Return empty array on error
  }
});

// @desc    Save payment method
// @route   POST /api/payment/methods
// @access  Private
const savePaymentMethod = asyncHandler(async (req, res) => {
  const { paymentMethodId, makeDefault = false } = req.body;

  if (!paymentMethodId) {
    res.status(400);
    throw new Error('Payment method ID is required');
  }

  try {
    // Attach payment method to customer
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: req.user.stripeCustomerId,
    });

    if (makeDefault) {
      // Update customer's default payment method
      await stripe.customers.update(req.user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Save default payment method ID to user
      req.user.defaultPaymentMethodId = paymentMethodId;
      await req.user.save();
    }

    res.json({
      success: true,
      message: 'Payment method saved successfully',
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card,
        billing_details: paymentMethod.billing_details
      }
    });
  } catch (error) {
    console.error('Error saving payment method:', error);
    
    if (error.code === 'resource_missing') {
      res.status(400);
      throw new Error('Payment method not found');
    } else if (error.code === 'payment_method_unexpected_state') {
      res.status(400);
      throw new Error('Payment method already attached to another customer');
    } else {
      res.status(500);
      throw new Error('Failed to save payment method');
    }
  }
});

// @desc    Remove payment method
// @route   DELETE /api/payment/methods/:id
// @access  Private
const removePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Detach payment method from customer
    const paymentMethod = await stripe.paymentMethods.detach(id);

    // If this was the default payment method, clear it
    if (req.user.defaultPaymentMethodId === id) {
      req.user.defaultPaymentMethodId = undefined;
      await req.user.save();
    }

    res.json({
      success: true,
      message: 'Payment method removed successfully'
    });
  } catch (error) {
    console.error('Error removing payment method:', error);
    
    if (error.code === 'resource_missing') {
      res.status(404);
      throw new Error('Payment method not found');
    } else {
      res.status(500);
      throw new Error('Failed to remove payment method');
    }
  }
});

// @desc    Set default payment method
// @route   PUT /api/payment/methods/:id/default
// @access  Private
const setDefaultPaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Verify payment method exists and belongs to customer
    const paymentMethod = await stripe.paymentMethods.retrieve(id);
    
    if (!paymentMethod.customer || paymentMethod.customer !== req.user.stripeCustomerId) {
      res.status(404);
      throw new Error('Payment method not found for this user');
    }

    // Update customer's default payment method
    await stripe.customers.update(req.user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: id,
      },
    });

    // Save default payment method ID to user
    req.user.defaultPaymentMethodId = id;
    await req.user.save();

    res.json({
      success: true,
      message: 'Default payment method updated successfully'
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    
    if (error.code === 'resource_missing') {
      res.status(404);
      throw new Error('Payment method not found');
    } else {
      res.status(500);
      throw new Error('Failed to set default payment method');
    }
  }
});

// @desc    Create setup intent for saving cards
// @route   POST /api/payment/setup-intent
// @access  Private
const createSetupIntent = asyncHandler(async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: req.user.stripeCustomerId,
      payment_method_types: ['card'],
      metadata: {
        userId: req.user._id.toString(),
        purpose: 'save_card'
      }
    });

    res.json({
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500);
    throw new Error('Failed to create setup intent');
  }
});

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const { limit = 10, starting_after } = req.query;

  try {
    const payments = await stripe.paymentIntents.list({
      customer: req.user.stripeCustomerId,
      limit: parseInt(limit),
      starting_after: starting_after
    });

    // Get related orders from database
    const paymentIntents = await Promise.all(
      payments.data.map(async (payment) => {
        const order = await Order.findOne({ 
          'paymentResult.id': payment.id 
        }).select('_id orderNumber totalPrice orderStatus createdAt');

        return {
          id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          created: payment.created,
          order: order || null,
          description: payment.description,
          receipt_url: payment.charges.data[0]?.receipt_url
        };
      })
    );

    res.json({
      success: true,
      payments: paymentIntents,
      hasMore: payments.has_more,
      nextCursor: payments.data[payments.data.length - 1]?.id
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500);
    throw new Error('Failed to fetch payment history');
  }
});

// @desc    Get payment details
// @route   GET /api/payment/:id
// @access  Private
const getPaymentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
    // Verify payment belongs to user
    if (paymentIntent.customer !== req.user.stripeCustomerId && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Unauthorized to view this payment');
    }

    // Get related order
    const order = await Order.findOne({ 
      'paymentResult.id': paymentIntent.id 
    });

    // Get charge details if available
    let chargeDetails = null;
    if (paymentIntent.latest_charge) {
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      chargeDetails = {
        id: charge.id,
        receipt_url: charge.receipt_url,
        receipt_number: charge.receipt_number,
        refunded: charge.refunded,
        amount_refunded: charge.amount_refunded / 100
      };
    }

    res.json({
      success: true,
      payment: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        customer: paymentIntent.customer,
        description: paymentIntent.description,
        metadata: paymentIntent.metadata,
        order: order,
        charge: chargeDetails,
        payment_method: paymentIntent.payment_method
      }
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    
    if (error.code === 'resource_missing') {
      res.status(404);
      throw new Error('Payment not found');
    } else {
      res.status(500);
      throw new Error('Failed to fetch payment details');
    }
  }
});

// @desc    Create refund
// @route   POST /api/payment/:id/refund
// @access  Private/Admin
const createRefund = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, reason = 'requested_by_customer' } = req.body;

  // Only admin or the user who made the payment can request refund
  const isAdmin = req.user.role === 'admin';

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
    // Verify authorization
    if (paymentIntent.customer !== req.user.stripeCustomerId && !isAdmin) {
      res.status(403);
      throw new Error('Unauthorized to refund this payment');
    }

    // Get related order
    const order = await Order.findOne({ 'paymentResult.id': id });
    if (!order) {
      res.status(404);
      throw new Error('Order not found for this payment');
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: id,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason,
      metadata: {
        refundedBy: req.user._id.toString(),
        refundedByName: req.user.name,
        orderId: order._id.toString()
      }
    });

    // Update order status
    order.orderStatus = 'refunded';
    order.paymentResult.refunded = true;
    order.paymentResult.refundedAt = new Date();
    order.paymentResult.refundId = refund.id;
    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        created: refund.created
      }
    });
  } catch (error) {
    console.error('Error creating refund:', error);
    
    if (error.code === 'resource_missing') {
      res.status(404);
      throw new Error('Payment not found');
    } else if (error.code === 'charge_already_refunded') {
      res.status(400);
      throw new Error('Payment already refunded');
    } else {
      res.status(500);
      throw new Error('Failed to process refund');
    }
  }
});

// @desc    Handle Stripe webhook events
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;
      
    case 'payment_intent.canceled':
      await handlePaymentIntentCanceled(event.data.object);
      break;
      
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object);
      break;
      
    case 'setup_intent.succeeded':
      await handleSetupIntentSucceeded(event.data.object);
      break;
      
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Webhook handlers
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const order = await Order.findOne({ 
      'paymentResult.id': paymentIntent.id 
    });
    
    if (order) {
      order.paymentResult.status = 'succeeded';
      order.isPaid = true;
      order.paidAt = new Date();
      order.orderStatus = 'processing';
      
      await order.save();
      console.log(`Order ${order._id} marked as paid for payment ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error('Error updating order on payment success:', error);
  }
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const order = await Order.findOne({ 
      'paymentResult.id': paymentIntent.id 
    });
    
    if (order) {
      order.paymentResult.status = 'failed';
      order.paymentResult.failureMessage = paymentIntent.last_payment_error?.message;
      order.orderStatus = 'payment_failed';
      
      await order.save();
      console.log(`Order ${order._id} marked as payment failed for payment ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error('Error updating order on payment failure:', error);
  }
};

const handlePaymentIntentCanceled = async (paymentIntent) => {
  console.log('Payment canceled:', paymentIntent.id);
};

const handleChargeRefunded = async (charge) => {
  try {
    const order = await Order.findOne({ 
      'paymentResult.id': charge.payment_intent 
    });
    
    if (order) {
      order.orderStatus = 'refunded';
      order.paymentResult.refunded = true;
      order.paymentResult.refundedAt = new Date();
      
      await order.save();
      console.log(`Order ${order._id} marked as refunded for payment ${charge.payment_intent}`);
    }
  } catch (error) {
    console.error('Error updating order on refund:', error);
  }
};

const handleSetupIntentSucceeded = async (setupIntent) => {
  console.log('Setup intent succeeded:', setupIntent.id);
  // Handle successful card setup
};

const handleSubscriptionCreated = async (subscription) => {
  console.log('Subscription created:', subscription.id);
  // Handle subscription creation
};

const handleSubscriptionDeleted = async (subscription) => {
  console.log('Subscription deleted:', subscription.id);
  // Handle subscription deletion
};

// @desc    Get Stripe publishable key
// @route   GET /api/payment/config
// @access  Public
const getPaymentConfig = asyncHandler(async (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    currency: 'usd',
    country: 'US',
    allowedPaymentMethods: ['card'],
    testMode: process.env.NODE_ENV !== 'production'
  });
});

module.exports = {
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
};