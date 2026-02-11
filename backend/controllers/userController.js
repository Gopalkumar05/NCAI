
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ==============================
// USER PROFILE CONTROLLERS
// ==============================

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -resetPasswordToken -resetPasswordExpire');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Get user stats
  const ordersCount = await Order.countDocuments({ user: user._id });
  const totalSpent = await Order.aggregate([
    { $match: { user: user._id, isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  
  const recentOrders = await Order.find({ user: user._id })
    .sort('-createdAt')
    .limit(3)
    .select('_id totalPrice orderStatus createdAt');
  
  res.json({
    user,
    stats: {
      ordersCount,
      totalSpent: totalSpent[0]?.total || 0,
      memberSince: user.createdAt
    },
    recentOrders
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, password, newPassword } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    user.email = email;
  }
  
  // Update basic info
  if (name) user.name = name;
  if (phone) user.phone = phone;
  
  // Update password if provided
  if (password && newPassword) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
  }
  
  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    address: updatedUser.address,
    message: 'Profile updated successfully'
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteUserAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    res.status(400);
    throw new Error('Password is required to delete account');
  }
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error('Invalid password');
  }
  
  // Cancel any active subscriptions in Stripe
  if (user.stripeCustomerId) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active'
      });
      
      for (const subscription of subscriptions.data) {
        await stripe.subscriptions.cancel(subscription.id);
      }
    } catch (error) {
      console.error('Error cancelling Stripe subscriptions:', error);
    }
  }
  
  // Delete user
  await user.deleteOne();
  
  res.json({ message: 'Account deleted successfully' });
});

// ==============================
// USER ADDRESS CONTROLLERS
// ==============================

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('address');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json(user.address);
});

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addUserAddress = asyncHandler(async (req, res) => {
  const { street, city, state, country, zipCode, phone, isDefault } = req.body;
  
  if (!street || !city || !state || !country || !zipCode) {
    res.status(400);
    throw new Error('All address fields are required');
  }
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const newAddress = {
    street,
    city,
    state,
    country,
    zipCode,
    phone: phone || user.phone,
    isDefault: isDefault || false
  };
  
  // If setting as default, remove default from other addresses
  if (newAddress.isDefault) {
    user.address.forEach(address => {
      address.isDefault = false;
    });
  }
  
  // If this is the first address, set as default
  if (user.address.length === 0) {
    newAddress.isDefault = true;
  }
  
  user.address.push(newAddress);
  await user.save();
  
  res.status(201).json({
    message: 'Address added successfully',
    address: newAddress,
    addresses: user.address
  });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { street, city, state, country, zipCode, phone, isDefault } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const addressIndex = user.address.findIndex(addr => addr._id.toString() === id);
  
  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // Update address fields
  if (street) user.address[addressIndex].street = street;
  if (city) user.address[addressIndex].city = city;
  if (state) user.address[addressIndex].state = state;
  if (country) user.address[addressIndex].country = country;
  if (zipCode) user.address[addressIndex].zipCode = zipCode;
  if (phone) user.address[addressIndex].phone = phone;
  
  // Handle default address
  if (isDefault !== undefined) {
    if (isDefault) {
      // Remove default from all addresses
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
      user.address[addressIndex].isDefault = true;
    } else {
      // Cannot unset default if it's the only default address
      const defaultAddresses = user.address.filter(addr => addr.isDefault);
      if (defaultAddresses.length === 1 && defaultAddresses[0]._id.toString() === id) {
        res.status(400);
        throw new Error('You must have at least one default address');
      }
      user.address[addressIndex].isDefault = false;
    }
  }
  
  await user.save();
  
  res.json({
    message: 'Address updated successfully',
    address: user.address[addressIndex],
    addresses: user.address
  });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const addressIndex = user.address.findIndex(addr => addr._id.toString() === id);
  
  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // Check if this is the default address
  const isDefault = user.address[addressIndex].isDefault;
  
  // Remove address
  user.address.splice(addressIndex, 1);
  
  // If we removed the default address and there are other addresses, set the first one as default
  if (isDefault && user.address.length > 0) {
    user.address[0].isDefault = true;
  }
  
  await user.save();
  
  res.json({
    message: 'Address deleted successfully',
    addresses: user.address
  });
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const addressIndex = user.address.findIndex(addr => addr._id.toString() === id);
  
  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // Remove default from all addresses
  user.address.forEach(addr => {
    addr.isDefault = false;
  });
  
  // Set new default
  user.address[addressIndex].isDefault = true;
  await user.save();
  
  res.json({
    message: 'Default address updated successfully',
    address: user.address[addressIndex]
  });
});

// ==============================
// USER ORDERS CONTROLLERS
// ==============================

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const query = { user: req.user._id };
  
  if (status) {
    query.orderStatus = status;
  }
  
  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('orderItems.product', 'name images')
    .exec();
  
  const count = await Order.countDocuments(query);
  
  res.json({
    orders,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalOrders: count
  });
});

// @desc    Get single order
// @route   GET /api/users/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('orderItems.product', 'name images category');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  res.json(order);
});

// @desc    Cancel order
// @route   PUT /api/users/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Check if order can be cancelled
  if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
    res.status(400);
    throw new Error(`Cannot cancel order with status: ${order.orderStatus}`);
  }
  
  // Check if order is paid - initiate refund if applicable
  if (order.isPaid) {
    // Here you would typically:
    // 1. Check if refund is possible (within refund window)
    // 2. Initiate refund through Stripe
    // 3. Update order with refund information
    
    // For now, just update status
    order.orderStatus = 'cancelled';
    order.paymentResult.refunded = true;
    order.paymentResult.refundedAt = new Date();
  } else {
    order.orderStatus = 'cancelled';
  }
  
  // Restore product stock
  for (const item of order.orderItems) {
    // You would need to fetch and update product stock here
    // This is simplified - you need to implement based on your Product model
  }
  
  await order.save();
  
  res.json({
    message: 'Order cancelled successfully',
    order
  });
});

// ==============================
// USER PAYMENT METHODS CONTROLLERS
// ==============================

// @desc    Get user payment methods
// @route   GET /api/users/payment-methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  if (!req.user.stripeCustomerId) {
    return res.json([]);
  }
  
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    });
    
    const formattedMethods = paymentMethods.data.map(method => ({
      id: method.id,
      type: method.type,
      card: {
        brand: method.card.brand,
        last4: method.card.last4,
        expMonth: method.card.exp_month,
        expYear: method.card.exp_year
      },
      billing_details: method.billing_details,
      created: method.created,
      isDefault: method.id === req.user.defaultPaymentMethodId
    }));
    
    res.json(formattedMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.json([]);
  }
});

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
const addPaymentMethod = asyncHandler(async (req, res) => {
  const { paymentMethodId, makeDefault = false } = req.body;
  
  if (!paymentMethodId) {
    res.status(400);
    throw new Error('Payment method ID is required');
  }
  
  if (!req.user.stripeCustomerId) {
    res.status(400);
    throw new Error('No Stripe customer found');
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
      message: 'Payment method added successfully',
      paymentMethod: {
        id: paymentMethod.id,
        card: paymentMethod.card
      }
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500);
    throw new Error('Failed to add payment method');
  }
});

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods/:id
// @access  Private
const deletePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    // Detach payment method from customer
    await stripe.paymentMethods.detach(id);
    
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
    res.status(500);
    throw new Error('Failed to remove payment method');
  }
});

// ==============================
// USER NOTIFICATIONS CONTROLLERS
// ==============================

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  // This is a simplified version
  // You would typically have a Notification model
  
  const notifications = [
    {
      id: '1',
      title: 'Welcome to Flower Shop!',
      message: 'Thank you for creating an account with us.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '2',
      title: 'Order Confirmed',
      message: 'Your order #ORD12345 has been confirmed.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 172800000) // 2 days ago
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  res.json({
    notifications,
    unreadCount
  });
});

// ==============================
// USER SETTINGS CONTROLLERS
// ==============================

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
const getUserSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('emailPreferences notificationPreferences');
  
  const settings = {
    emailPreferences: user.emailPreferences || {
      newsletter: true,
      promotions: true,
      orderUpdates: true,
      productUpdates: false
    },
    notificationPreferences: user.notificationPreferences || {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisibility: 'private',
      showOrders: false
    }
  };
  
  res.json(settings);
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
const updateUserSettings = asyncHandler(async (req, res) => {
  const { emailPreferences, notificationPreferences, privacy } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  if (emailPreferences) {
    user.emailPreferences = emailPreferences;
  }
  
  if (notificationPreferences) {
    user.notificationPreferences = notificationPreferences;
  }
  
  await user.save();
  
  res.json({
    message: 'Settings updated successfully',
    settings: {
      emailPreferences: user.emailPreferences,
      notificationPreferences: user.notificationPreferences,
      privacy
    }
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Current password and new password are required');
  }
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  
  // Validate new password
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  
  // Update password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  
  res.json({ message: 'Password changed successfully' });
});

module.exports = {
  // Profile
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  changePassword,
  
  // Addresses
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  
  // Orders
  getUserOrders,
  getOrderById,
  cancelOrder,
  
  // Payment Methods
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  
  // Notifications
  getNotifications,
  
  // Settings
  getUserSettings,
  updateUserSettings
};