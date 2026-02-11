const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name price discountPrice images stock');
  
  if (cart) {
    res.json(cart);
  } else {
    res.json({ items: [], totalPrice: 0, totalItems: 0 });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }
  
  let cart = await Cart.findOne({ user: req.user._id });
  const price = product.discountPrice || product.price;
  
  if (cart) {
    // Cart exists, check if product already in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity, price });
    }
    
    // Recalculate totals
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = Date.now();
  } else {
    // Create new cart
    cart = new Cart({
      user: req.user._id,
      items: [{ product: productId, quantity, price }],
      totalItems: quantity,
      totalPrice: price * quantity
    });
  }
  
  await cart.save();
  const populatedCart = await Cart.findById(cart._id)
    .populate('items.product', 'name price discountPrice images stock');
  
  res.status(201).json(populatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  const itemIndex = cart.items.findIndex(item => 
    item._id.toString() === req.params.itemId
  );
  
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }
  
  // Check stock availability
  const product = await Product.findById(cart.items[itemIndex].product);
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }
  
  cart.items[itemIndex].quantity = quantity;
  
  // Recalculate totals
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  cart.updatedAt = Date.now();
  
  await cart.save();
  const populatedCart = await Cart.findById(cart._id)
    .populate('items.product', 'name price discountPrice images stock');
  
  res.json(populatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  cart.items = cart.items.filter(item => 
    item._id.toString() !== req.params.itemId
  );
  
  // Recalculate totals
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  cart.updatedAt = Date.now();
  
  await cart.save();
  res.json({ message: 'Item removed from cart' });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.updatedAt = Date.now();
    await cart.save();
  }
  
  res.json({ message: 'Cart cleared' });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};