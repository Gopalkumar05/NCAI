const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice 
  } = req.body;
  
  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }
  
  // Check stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }
  }
  
  // Update stock and create order items
  const orderItems = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    
    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: item.price,
      image: product.images[0]?.url || ''
    });
    
    // Update stock
    product.stock -= item.quantity;
    await product.save();
  }
  
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });
  
  const createdOrder = await order.save();
  
  // Clear cart after order
  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  cart.updatedAt = Date.now();
  await cart.save();
  
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');
  
  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  if (order.orderStatus !== 'pending') {
    res.status(400);
    throw new Error('Order cannot be cancelled');
  }
  
  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }
  
  order.orderStatus = 'cancelled';
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

// @desc    Get order history
// @route   GET /api/orders/history
// @access  Private
const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 
    user: req.user._id,
    isDelivered: true 
  })
  .sort({ deliveredAt: -1 })
  .limit(10);
  
  res.json(orders);
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  cancelOrder,
  getOrderHistory
};