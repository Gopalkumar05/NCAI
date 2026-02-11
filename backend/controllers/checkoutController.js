const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ShippingMethod = require('../models/ShippingMethod');

// @desc    Get shipping methods
// @route   GET /api/checkout/shipping-methods
// @access  Private
const getShippingMethods = asyncHandler(async (req, res) => {
  const shippingMethods = await ShippingMethod.find({ isActive: true })
    .sort({ price: 1 });
  
  res.json(shippingMethods);
});

// @desc    Calculate shipping cost
// @route   POST /api/checkout/calculate-shipping
// @access  Private
// const calculateShipping = asyncHandler(async (req, res) => {
//   const { shippingMethodId, address } = req.body;
  
//   // Get shipping method
//   const shippingMethod = await ShippingMethod.findById(shippingMethodId);
  
//   if (!shippingMethod) {
//     res.status(404);
//     throw new Error('Shipping method not found');
//   }
  
//   // Calculate base shipping cost
//   let shippingCost = shippingMethod.basePrice;
  
//   // Add regional surcharges if applicable
//   if (address.country === 'CA') {
//     shippingCost += 5.00; // Additional charge for Canada
//   } else if (address.country === 'AU' || address.country === 'UK') {
//     shippingCost += 10.00; // Additional charge for international
//   }
  
//   // Add expedited fees if selected
//   if (shippingMethod.isExpedited) {
//     shippingCost += shippingMethod.expeditedFee || 15.00;
//   }
  
//   // Get cart to calculate weight-based shipping
//   const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  
//   if (cart && cart.items.length > 0) {
//     // Calculate total weight (assuming products have weight field)
//     const totalWeight = cart.items.reduce((sum, item) => {
//       const productWeight = item.product?.weight || 0.5; // Default 0.5kg per product
//       return sum + (productWeight * item.quantity);
//     }, 0);
    
//     // Add weight-based charges
//     if (totalWeight > 5) {
//       shippingCost += (totalWeight - 5) * 2; // $2 per kg over 5kg
//     }
//   }
  
//   // Round to 2 decimal places
//   shippingCost = Math.round(shippingCost * 100) / 100;
  
//   res.json({
//     shippingMethod: shippingMethod.name,
//     estimatedDays: shippingMethod.estimatedDays,
//     price: shippingCost,
//     totalWeight: totalWeight || 0,
//     surcharges: shippingCost - shippingMethod.basePrice
//   });
// });


const calculateShipping = asyncHandler(async (req, res) => {
  const { shippingMethodId, address } = req.body;
  
  // Get shipping method
  const shippingMethod = await ShippingMethod.findById(shippingMethodId);
  
  if (!shippingMethod) {
    res.status(404);
    throw new Error('Shipping method not found');
  }
  
  // Calculate base shipping cost
  let shippingCost = shippingMethod.basePrice;
  let totalWeight = 0; // Initialize totalWeight here
  
  // Add regional surcharges if applicable
  if (address.country === 'CA') {
    shippingCost += 5.00; // Additional charge for Canada
  } else if (address.country === 'AU' || address.country === 'UK') {
    shippingCost += 10.00; // Additional charge for international
  }
  
  // Add expedited fees if selected
  if (shippingMethod.isExpedited) {
    shippingCost += shippingMethod.expeditedFee || 15.00;
  }
  
  // Get cart to calculate weight-based shipping
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  
  if (cart && cart.items.length > 0) {
    // Calculate total weight (assuming products have weight field)
    totalWeight = cart.items.reduce((sum, item) => {
      const productWeight = item.product?.weight || 0.5; // Default 0.5kg per product
      return sum + (productWeight * item.quantity);
    }, 0);
    
    // Add weight-based charges
    if (totalWeight > 5) {
      shippingCost += (totalWeight - 5) * 2; // $2 per kg over 5kg
    }
  }
  
  // Round to 2 decimal places
  shippingCost = Math.round(shippingCost * 100) / 100;
  
  res.json({
    shippingMethod: shippingMethod.name,
    estimatedDays: shippingMethod.estimatedDays,
    price: shippingCost,
    totalWeight: totalWeight,
    surcharges: shippingCost - shippingMethod.basePrice
  });
});


// @desc    Calculate taxes
// @route   POST /api/checkout/taxes
// @access  Private
const getTaxes = asyncHandler(async (req, res) => {
  const { subtotal, shippingCost, address } = req.body;
  
  // Tax rates by state/province (simplified example)
  const taxRates = {
    // US States
    'CA': 0.0825, // California: 8.25%
    'NY': 0.0888, // New York: 8.88%
    'TX': 0.0825, // Texas: 8.25%
    'FL': 0.06,   // Florida: 6%
    'WA': 0.065,  // Washington: 6.5%
    // Canadian Provinces
    'ON': 0.13,   // Ontario: 13% HST
    'BC': 0.12,   // British Columbia: 12% HST
    'QC': 0.14975, // Quebec: 14.975%
    // Default rate
    'default': 0.08 // 8%
  };
  
  // Determine tax rate
  const state = address.state?.toUpperCase();
  const taxRate = taxRates[state] || taxRates['default'];
  
  // Calculate tax on subtotal only (not shipping in most jurisdictions)
  const taxAmount = subtotal * taxRate;
  
  res.json({
    taxRate: taxRate * 100, // Return as percentage
    taxAmount: Math.round(taxAmount * 100) / 100,
    taxableAmount: subtotal,
    jurisdiction: `${address.state}, ${address.country}`
  });
});

// @desc    Create payment intent
// @route   POST /api/checkout/payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd', metadata = {} } = req.body;
  
  if (!amount || amount < 1) {
    res.status(400);
    throw new Error('Invalid amount');
  }
  
  try {
    // Create customer in Stripe if not exists
    let customerId;
    
    // Check if user has a Stripe customer ID in their profile
    if (req.user.stripeCustomerId) {
      customerId = req.user.stripeCustomerId;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      
      customerId = customer.id;
      
      // Save customer ID to user profile
      req.user.stripeCustomerId = customerId;
      await req.user.save();
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata: {
        ...metadata,
        userId: req.user._id.toString(),
        userEmail: req.user.email
      },
      // Optional: Setup future usage
      setup_future_usage: 'off_session',
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500);
    throw new Error(`Payment processing failed: ${error.message}`);
  }
});

// @desc    Confirm payment and create order
// @route   POST /api/checkout/confirm-payment
// @access  Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { 
    paymentIntentId,
    shippingAddress,
    shippingMethodId,
    paymentMethod,
    saveAddress
  } = req.body;
  
  try {
    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error('Payment not successful');
    }
    
    // Verify payment belongs to user
    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Payment does not belong to user');
    }
    
    // Get cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock');
    
    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Cart is empty');
    }
    
    // Verify stock and calculate totals
    let itemsPrice = 0;
    const orderItems = [];
    
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.product.name} not found`);
      }
      
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }
      
      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
      
      // Add to order items
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
        image: product.images[0]?.url || ''
      });
      
      itemsPrice += item.price * item.quantity;
    }
    
    // Get shipping method
    const shippingMethod = await ShippingMethod.findById(shippingMethodId);
    const shippingPrice = shippingMethod ? shippingMethod.price : 0;
    
    // Calculate tax
    const taxResponse = await getTaxes({
      subtotal: itemsPrice,
      shippingCost: shippingPrice,
      address: shippingAddress
    });
    const taxAmount = taxResponse.taxAmount || 0;
    
    // Calculate total
    const totalPrice = itemsPrice + shippingPrice + taxAmount;
    
    // Verify total matches payment amount
    const paidAmount = paymentIntent.amount / 100;
    const amountDifference = Math.abs(paidAmount - totalPrice);
    
    if (amountDifference > 0.01) { // Allow 1 cent difference due to rounding
      res.status(400);
      throw new Error(`Payment amount ($${paidAmount}) does not match order total ($${totalPrice.toFixed(2)})`);
    }
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
      },
      itemsPrice,
      taxPrice: taxAmount,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: 'processing'
    });
    
    // Save address if requested
    if (saveAddress && shippingAddress) {
      // Add address to user's saved addresses
      const user = await User.findById(req.user._id);
      const newAddress = {
        ...shippingAddress,
        isDefault: user.address.length === 0 // Set as default if no addresses
      };
      user.address.push(newAddress);
      await user.save();
    }
    
    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
        totalPrice: order.totalPrice,
        items: order.orderItems.length,
        estimatedDelivery: shippingMethod ? 
          new Date(Date.now() + shippingMethod.estimatedDays * 24 * 60 * 60 * 1000) : 
          null,
        status: order.orderStatus
      }
    });
    
  } catch (error) {
    // If order creation fails, refund the payment
    if (paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
          reason: 'requested_by_customer'
        });
      } catch (refundError) {
        console.error('Refund failed:', refundError);
      }
    }
    throw error;
  }
});

// @desc    Get checkout summary
// @route   GET /api/checkout/summary
// @access  Private
const getCheckoutSummary = asyncHandler(async (req, res) => {
  // Get cart
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name price images stock category');
  
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  
  // Calculate subtotal
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  // Get default shipping method
  const defaultShipping = await ShippingMethod.findOne({ 
    isActive: true, 
    isDefault: true 
  }) || await ShippingMethod.findOne({ isActive: true });
  
  // Get user's default address
  const user = await User.findById(req.user._id);
  const defaultAddress = user.address.find(addr => addr.isDefault) || user.address[0];
  
  res.json({
    cart: {
      items: cart.items.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.price,
          image: item.product.images[0]?.url || '',
          category: item.product.category
        },
        quantity: item.quantity,
        price: item.price
      })),
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice
    },
    subtotal,
    estimatedShipping: defaultShipping ? {
      method: defaultShipping.name,
      price: defaultShipping.price,
      estimatedDays: defaultShipping.estimatedDays
    } : null,
    defaultAddress,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  });
});

// @desc    Validate checkout data
// @route   POST /api/checkout/validate
// @access  Private
const validateCheckout = asyncHandler(async (req, res) => {
  const { shippingAddress, shippingMethodId } = req.body;
  
  const errors = [];
  
  // Validate shipping address
  if (!shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    const requiredFields = ['street', 'city', 'state', 'country', 'zipCode', 'phone'];
    for (const field of requiredFields) {
      if (!shippingAddress[field] || shippingAddress[field].trim() === '') {
        errors.push(`${field.replace(/^\w/, c => c.toUpperCase())} is required`);
      }
    }
  }
  
  // Validate shipping method
  if (!shippingMethodId) {
    errors.push('Shipping method is required');
  } else {
    const shippingMethod = await ShippingMethod.findById(shippingMethodId);
    if (!shippingMethod || !shippingMethod.isActive) {
      errors.push('Selected shipping method is not available');
    }
  }
  
  // Validate cart
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name stock');
  
  if (!cart || cart.items.length === 0) {
    errors.push('Cart is empty');
  } else {
    // Check stock for each item
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        errors.push(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`);
      }
    }
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      isValid: false,
      errors
    });
  } else {
    res.json({
      isValid: true,
      message: 'Checkout data is valid'
    });
  }
});

module.exports = {
  getShippingMethods,
  calculateShipping,
  getTaxes,
  createPaymentIntent,
  confirmPayment,
  getCheckoutSummary,
  validateCheckout
};