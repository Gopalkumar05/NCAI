

const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const generateToken = require("../utils/generateToken");
const sendEmail = require('../utils/sendEmail');

// IMPORT CLOUDINARY CORRECTLY
const cloudinary = require('../config/cloudinary');
// If cloudinary is exported as an object with cloudinary property, use this:
// const { cloudinary } = require('../config/cloudinary');

// ==============================
// IMAGE UPLOAD CONTROLLERS
// ==============================

// SINGLE IMAGE UPLOAD
// ==============================
// IMAGE UPLOAD CONTROLLERS - USING MULTER STORAGE
// ==============================

// SINGLE IMAGE UPLOAD - Using multer-storage-cloudinary
const uploadProductImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    console.log('✅ Image uploaded to Cloudinary:', {
      url: req.file.path,
      public_id: req.file.filename,
      size: req.file.size
    });

    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

// MULTIPLE IMAGES UPLOAD - Using multer-storage-cloudinary
const uploadMultipleImages = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString()
    }));

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: {
        images: uploadedImages,
        count: uploadedImages.length
      }
    });
  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
});

// DELETE IMAGE - From Cloudinary
const deleteProductImage = asyncHandler(async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
});

// // MULTIPLE IMAGES UPLOAD
// const uploadMultipleImages = asyncHandler(async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       res.status(400);
//       throw new Error('Please upload at least one image');
//     }

//     const maxFiles = 10;
//     if (req.files.length > maxFiles) {
//       res.status(400);
//       throw new Error(`Maximum ${maxFiles} images allowed per upload`);
//     }

//     const uploadType = req.body.type || 'products';
//     const folder = `bloombox/${uploadType}`;
    
//     const uploadPromises = req.files.map(file => 
//       cloudinary.uploader.upload(file.path, {
//         folder: folder,
//         resource_type: 'auto',
//         transformation: [
//           { width: 800, height: 800, crop: 'limit' },
//           { quality: 'auto:good' }
//         ]
//       })
//     );

//     const results = await Promise.all(uploadPromises);

//     const uploadedImages = results.map(result => ({
//       url: result.secure_url,
//       public_id: result.public_id,
//       originalname: result.original_filename,
//       size: result.bytes,
//       mimetype: result.format,
//       uploadType: uploadType,
//       uploadedAt: new Date().toISOString()
//     }));

//     res.status(201).json({
//       success: true,
//       message: `${uploadedImages.length} image(s) uploaded successfully`,
//       data: {
//         images: uploadedImages,
//         count: uploadedImages.length
//       }
//     });

//   } catch (error) {
//     console.error('Multiple image upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to upload images'
//     });
//   }
// });

// ==============================
// DASHBOARD CONTROLLERS
// ==============================

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'customer' });
  
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email');
  
  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: totalRevenue[0]?.total || 0,
    recentOrders,
    monthlyRevenue
  });
});

// ==============================
// USER MANAGEMENT CONTROLLERS
// ==============================

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (user) {
    const userOrders = await Order.find({ user: req.params.id });
    res.json({ user, orders: userOrders });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// ==============================
// PRODUCT MANAGEMENT CONTROLLERS
// ==============================

const getProducts = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      isFeatured = '',
      isAvailable = '',
      minPrice = '',
      maxPrice = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (isFeatured !== '') {
      query.isFeatured = isFeatured === 'true';
    }
    
    if (isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500);
    throw new Error('Failed to fetch products');
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500);
    throw new Error('Failed to fetch product');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    discountPrice: req.body.discountPrice,
    category: req.body.category,
    occasion: req.body.occasion || [],
    images: req.body.images || [],
    stock: req.body.stock,
    tags: req.body.tags || [],
    isFeatured: req.body.isFeatured || false,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.discountPrice = req.body.discountPrice || product.discountPrice;
    product.category = req.body.category || product.category;
    product.occasion = req.body.occasion || product.occasion;
    product.images = req.body.images || product.images;
    product.stock = req.body.stock || product.stock;
    product.tags = req.body.tags || product.tags;
    product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
    product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// ==============================
// ORDER MANAGEMENT CONTROLLERS
// ==============================

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    order.trackingNumber = req.body.trackingNumber || order.trackingNumber;
    
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// ==============================
// ADMIN AUTHENTICATION CONTROLLERS
// ==============================

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      department,
      designation,
      profileImage
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      res.status(400);
      throw new Error('Admin already exists with this email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please enter a valid email address');
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error('Password must be at least 8 characters long');
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
      department: department || 'operations',
      designation,
      profileImage,
      createdBy: req.admin?._id || null
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        token,
        admin: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          department: admin.department,
          isVerified: admin.isVerified,
          isActive: admin.isActive
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Email already exists');
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400);
      throw new Error(messages.join(', '));
    }
    
    throw error;
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const admin = await Admin.findOne({
    verificationToken,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!admin) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  admin.isVerified = true;
  admin.verificationToken = undefined;
  admin.verificationTokenExpires = undefined;
  await admin.save();

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } else {
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!admin.isActive) {
    res.status(403);
    throw new Error('Account is deactivated. Please contact administrator.');
  }

  if (admin.isLocked) {
    const lockMinutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
    res.status(423);
    throw new Error(`Account locked. Try again in ${lockMinutes} minutes`);
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  
  if (!isPasswordCorrect) {
    await admin.incrementLoginAttempts();
    res.status(401);
    throw new Error('Invalid credentials');
  }

  await admin.resetLoginAttempts();

  const token = generateToken(admin._id);

  admin.lastLogin = Date.now();
  admin.ipAddress = req.ip;
  admin.userAgent = req.headers['user-agent'];
  await admin.save();

  res.json({
    success: true,
    token,
    admin: {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      profileImage: admin.profileImage,
      department: admin.department,
      designation: admin.designation,
      isVerified: admin.isVerified,
      permissions: admin.getAllPermissions(),
      lastLogin: admin.lastLogin
    }
  });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  
  res.json({
    success: true,
    admin: {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      profileImage: admin.profileImage,
      department: admin.department,
      designation: admin.designation,
      isVerified: admin.isVerified,
      isActive: admin.isActive,
      permissions: admin.getAllPermissions(),
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }
  });
});

const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    admin.firstName = req.body.firstName || admin.firstName;
    admin.lastName = req.body.lastName || admin.lastName;
    admin.phone = req.body.phone || admin.phone;
    admin.department = req.body.department || admin.department;
    admin.designation = req.body.designation || admin.designation;
    
    if (req.body.profileImage) {
      admin.profileImage = req.body.profileImage;
    }

    const updatedAdmin = await admin.save();

    res.json({
      success: true,
      admin: {
        id: updatedAdmin._id,
        firstName: updatedAdmin.firstName,
        lastName: updatedAdmin.lastName,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        profileImage: updatedAdmin.profileImage,
        department: updatedAdmin.department,
        designation: updatedAdmin.designation,
        isVerified: updatedAdmin.isVerified,
        permissions: updatedAdmin.getAllPermissions()
      }
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});

const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const admin = await Admin.findById(req.admin._id).select('+password');

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

const forgotAdminPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    });
  }

  try {
    const resetToken = admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/admin/reset-password/${resetToken}`;
    
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      email: admin.email,
      subject: 'Password Reset Request',
      html: html
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
});

const resetAdminPassword = asyncHandler(async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    if (!password) {
      res.status(400);
      throw new Error('Password is required');
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error('Password must be at least 8 characters long');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!admin) {
      res.status(400);
      throw new Error('Reset token is invalid or has expired');
    }

    admin.password = password;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error resetting password'
    });
  }
});

const validateResetToken = asyncHandler(async (req, res) => {
  try {
    const resetToken = req.params.token;
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(200).json({
        success: false,
        message: 'Reset token is invalid or has expired'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      email: admin.email
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating token'
    });
  }
});

const resendVerification = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin.isVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  const verificationToken = admin.createVerificationToken();
  await admin.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get('host')}/api/admin/auth/verify-email/${verificationToken}`;
  
  const message = `
    <h1>Email Verification</h1>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `;

  try {
    await sendEmail({
      email: admin.email,
      subject: 'Verify Your Email Address',
      html: message
    });

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  if (admin) {
    admin.lastActivity = Date.now();
    await admin.save();
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

const getAllAdmins = asyncHandler(async (req, res) => {
  if (req.admin.role !== 'super_admin') {
    res.status(403);
    throw new Error('Not authorized to access this resource');
  }

  const admins = await Admin.find().select('-password -twoFactorSecret');
  
  res.json({
    success: true,
    count: admins.length,
    admins
  });
});

const updateAdminStatus = asyncHandler(async (req, res) => {
  if (req.admin.role !== 'super_admin') {
    res.status(403);
    throw new Error('Not authorized to access this resource');
  }

  const admin = await Admin.findById(req.params.id);
  
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  if (admin.role === 'super_admin' && req.admin._id.toString() !== admin._id.toString()) {
    res.status(403);
    throw new Error('Cannot modify another super admin');
  }

  admin.isActive = req.body.isActive !== undefined ? req.body.isActive : admin.isActive;
  admin.role = req.body.role || admin.role;
  
  if (req.body.permissions) {
    Object.keys(req.body.permissions).forEach(key => {
      if (admin.permissions[key] !== undefined) {
        admin.permissions[key] = req.body.permissions[key];
      }
    });
  }

  const updatedAdmin = await admin.save();

  res.json({
    success: true,
    admin: updatedAdmin
  });
});

// ==============================
// EXPORT ALL CONTROLLERS
// ==============================

module.exports = {
  // Dashboard
  getDashboardStats,
  
  // User Management
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  
  // Product Management
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Order Management
  getOrders,
  updateOrderStatus,
  
  // Image Upload
  uploadProductImage,
  uploadMultipleImages,
  deleteProductImage,
  
  // Admin Authentication
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  validateResetToken,
  verifyEmail,
  resendVerification,
  logoutAdmin,
  
  // Super Admin
  getAllAdmins,
  updateAdminStatus
};
