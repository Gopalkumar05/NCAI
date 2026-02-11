const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('items.product', 'name price discountPrice images stock category');
  
  if (wishlist) {
    res.json(wishlist);
  } else {
    res.json({ items: [] });
  }
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    // Check if product already in wishlist
    const itemExists = wishlist.items.some(item => 
      item.product.toString() === productId
    );
    
    if (itemExists) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }
    
    wishlist.items.push({ product: productId });
    wishlist.updatedAt = Date.now();
  } else {
    // Create new wishlist
    wishlist = new Wishlist({
      user: req.user._id,
      items: [{ product: productId }]
    });
  }
  
  await wishlist.save();
  const populatedWishlist = await Wishlist.findById(wishlist._id)
    .populate('items.product', 'name price discountPrice images stock category');
  
  res.status(201).json(populatedWishlist);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }
  
  const initialLength = wishlist.items.length;
  wishlist.items = wishlist.items.filter(item => 
    item.product.toString() !== req.params.productId
  );
  
  if (wishlist.items.length === initialLength) {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }
  
  wishlist.updatedAt = Date.now();
  await wishlist.save();
  
  res.json({ message: 'Product removed from wishlist' });
});

// @desc    Move wishlist item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
const moveToCart = asyncHandler(async (req, res) => {
  // This would integrate with cartController
  res.json({ message: 'Feature to be implemented' });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    wishlist.items = [];
    wishlist.updatedAt = Date.now();
    await wishlist.save();
  }
  
  res.json({ message: 'Wishlist cleared' });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  clearWishlist
};