

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// ==============================
// USER AUTHENTICATION CONTROLLERS
// ==============================

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    phone
  });

  if (user) {
    const token = generateToken(user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add/Update address
// @route   PUT /api/auth/address
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { address } = req.body;
  
  if (address.isDefault) {
    // Remove default from all addresses
    user.address.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Check if address already exists (by street + city)
  const existingAddressIndex = user.address.findIndex(addr => 
    addr.street === address.street && addr.city === address.city
  );

  if (existingAddressIndex > -1) {
    // Update existing address
    user.address[existingAddressIndex] = address;
  } else {
    // Add new address
    user.address.push(address);
  }

  await user.save();
  res.json({ message: 'Address updated successfully', addresses: user.address });
});

// @desc    Remove address
// @route   DELETE /api/auth/address/:index
// @access  Private
const removeUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const addressIndex = parseInt(req.params.index);
  
  if (addressIndex < 0 || addressIndex >= user.address.length) {
    res.status(400);
    throw new Error('Invalid address index');
  }

  user.address.splice(addressIndex, 1);
  await user.save();
  
  res.json({ message: 'Address removed successfully', addresses: user.address });
});

// @desc    Forgot password - User
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotUserPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set token expire time (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 10px 0;
    ">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Flower Shop',
      html: message
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password - User
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetUserPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    message: 'Password reset successful',
    token: generateToken(user._id)
  });
});


// Export all controllers
module.exports = {
  // User controllers
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserAddress,
  removeUserAddress,
  forgotUserPassword,
  resetUserPassword,
  
};


