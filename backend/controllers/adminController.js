const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const generateToken = require("../utils/generateToken");
 const sendEmail = require('../utils/sendEmail'); // Adjust the path based on your project structure

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin

const uploadMultipleImages = asyncHandler(async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('Please upload at least one image');
    }

    // Check maximum files limit
    const maxFiles = 10;
    if (req.files.length > maxFiles) {
      res.status(400);
      throw new Error(`Maximum ${maxFiles} images allowed per upload`);
    }

    // Get base URL for constructing full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadType = req.body.type || 'products';
    
    // Process all uploaded files
    const uploadedImages = req.files.map(file => {
      // Construct image URL based on upload type
      const imagePath = file.path.replace(/\\/g, '/'); // Normalize path for Windows
      const relativePath = imagePath.split('uploads/')[1];
      const imageUrl = `${baseUrl}/uploads/${relativePath}`;
      
      return {
        url: imageUrl,
        public_id: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: relativePath, // Store relative path for deletion
        uploadType: uploadType,
        uploadedAt: new Date().toISOString()
      };
    });

    // Calculate total size
    const totalSize = uploadedImages.reduce((sum, img) => sum + img.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: {
        images: uploadedImages,
        count: uploadedImages.length,
        totalSize: totalSize,
        totalSizeMB: `${totalSizeMB} MB`,
        uploadType: uploadType
      }
    });

  } catch (error) {
    console.error('Multiple image upload error:', error);
    
    // If there's an error, clean up any uploaded files
    if (req.files && req.files.length > 0) {
      const fs = require('fs');
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error cleaning up file:', unlinkError.message);
          }
        }
      });
    }

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const deleteMultipleImages = asyncHandler(async (req, res) => {
  try {
    const { imageUrls } = req.body;
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      res.status(400);
      throw new Error('Please provide an array of image URLs to delete');
    }

    const fs = require('fs');
    const path = require('path');
    const results = [];
    const errors = [];

    // Process each image URL
    for (const imageUrl of imageUrls) {
      try {
        // Extract filename from URL (handle different URL formats)
        let filename;
        if (imageUrl.includes('/uploads/')) {
          filename = imageUrl.split('/uploads/')[1];
        } else {
          // If it's just a filename, use it directly
          filename = imageUrl;
        }

        if (!filename) {
          errors.push({ url: imageUrl, error: 'Invalid URL format' });
          continue;
        }

        // Construct full file path
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        // Check if file exists and delete
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          results.push({ url: imageUrl, status: 'deleted' });
        } else {
          results.push({ url: imageUrl, status: 'not_found' });
        }
      } catch (error) {
        errors.push({ url: imageUrl, error: error.message });
      }
    }

    const successCount = results.filter(r => r.status === 'deleted').length;
    const notFoundCount = results.filter(r => r.status === 'not_found').length;

    res.json({
      success: true,
      message: `Processed ${imageUrls.length} images`,
      data: {
        deleted: successCount,
        notFound: notFoundCount,
        errors: errors.length,
        details: {
          results,
          errors: errors.length > 0 ? errors : undefined
        }
      }
    });

  } catch (error) {
    console.error('Multiple image delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const uploadProductImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image');
    }

    console.log('📁 Uploaded file info:', {
      filename: req.file.filename,
      path: req.file.path,
      destination: req.file.destination
    });

    // Get the upload type from request
    const uploadType = req.body.type || 'general';
    
    // Construct full URL for the image - INCLUDE THE SUBDIRECTORY
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${uploadType}/${req.file.filename}`;
    
    // Return response matching frontend expectation
    res.json({
      url: imageUrl,
      path: `${uploadType}/${req.file.filename}`, // Include subdirectory
      public_id: req.file.filename,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      success: true
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// controller
const deleteProductImage = asyncHandler(async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      res.status(400);
      throw new Error('Image URL is required');
    }

    // Extract filename from URL
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Check if file exists and delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
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

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
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

const validateResetToken = asyncHandler(async (req, res) => {
  console.log('=== VALIDATE TOKEN ENDPOINT ===');
  
  try {
    const resetToken = req.params.token;
    
    // Hash the token
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find admin
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

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
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

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
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

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
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
// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
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

    // Build query
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Featured filter
    if (isFeatured !== '') {
      query.isFeatured = isFeatured === 'true';
    }
    
    // Availability filter
    if (isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    // Get total count
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
// @desc    Get product by ID
// @route   GET /api/admin/products/:id
// @access  Private/Admin
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
// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
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


// controllers/adminController.js - Updated registerAdmin function
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

    // Validation
    if (!firstName || !lastName || !email || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      res.status(400);
      throw new Error('Admin already exists with this email');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please enter a valid email address');
    }

    // Validate password strength
    if (password.length < 8) {
      res.status(400);
      throw new Error('Password must be at least 8 characters long');
    }

    // Create admin
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

    // Generate token
    const token = generateToken(admin._id);

    // Send verification email (optional - you can enable this later)
    if (process.env.SEND_EMAILS === 'true') {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/admin/auth/verify-email/${admin.verificationToken}`;
      
      const message = `
        <h1>Welcome to the Admin Dashboard</h1>
        <p>Please verify your email address to complete your registration.</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `;

      try {
        await sendEmail({
          email: admin.email,
          subject: 'Verify Your Email Address',
          html: message
        });
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    }

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
    
    // Handle duplicate key error
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Email already exists');
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400);
      throw new Error(messages.join(', '));
    }
    
    throw error;
  }
});

// @desc    Verify email
// @route   GET /api/admin/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // Get hashed token
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

  // Update admin
  admin.isVerified = true;
  admin.verificationToken = undefined;
  admin.verificationTokenExpires = undefined;
  await admin.save();

  // Redirect to frontend or send success response
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } else {
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  }
});

// @desc    Login admin
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Get admin with password
  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if admin is active
  if (!admin.isActive) {
    res.status(403);
    throw new Error('Account is deactivated. Please contact administrator.');
  }

  // Check if account is locked
  if (admin.isLocked) {
    const lockMinutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
    res.status(423);
    throw new Error(`Account locked. Try again in ${lockMinutes} minutes`);
  }

  // Check password
  const isPasswordCorrect = await admin.comparePassword(password);
  
  if (!isPasswordCorrect) {
    // Increment login attempts
    await admin.incrementLoginAttempts();
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  await admin.resetLoginAttempts();

  // Generate token
  const token = generateToken(admin._id);

  // Update last login
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

// @desc    Get current admin profile
// @route   GET /api/admin/auth/me
// @access  Private/Admin
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

// @desc    Update admin profile
// @route   PUT /api/admin/auth/update-profile
// @access  Private/Admin
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

// @desc    Change password - Admin
// @route   PUT /api/admin/auth/change-password
// @access  Private/Admin
const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  // Get admin with password
  const admin = await Admin.findById(req.admin._id).select('+password');

  // Check current password
  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password
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
    // For security, don't reveal if admin exists or not
    return res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    });
  }

  try {
    // Generate reset token
    const resetToken = admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    // Create reset URL - POINT TO FRONTEND, NOT BACKEND
    const frontendUrl = process.env.FRONTEND_URL;
    const resetUrl = `${frontendUrl}/areset-password/${resetToken}`;
    
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Or copy and paste this link in your browser:<br>${resetUrl}</p>
    `;

    console.log('Sending email to:', admin.email);
    console.log('Reset token generated:', resetToken.substring(0, 20) + '...');
    console.log('Reset URL (Frontend):', resetUrl);

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
    console.error('Forgot password error details:', error);
    
    // Reset token and expiry
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    // More specific error handling
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check email credentials.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address.';
    } else if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
      errorMessage = 'Unable to connect to email server. Please try again later.';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



const resetAdminPassword = asyncHandler(async (req, res) => {
  console.log('=== RESET PASSWORD REQUEST ===');
  console.log('Reset token from URL:', req.params.token);

  try {
    // Get token from URL
    const resetToken = req.params.token;

    // Hash the token to compare with stored hashed token
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken) // Changed from Token to resetToken
      .digest('hex');

    console.log('Looking for admin with hashed token:', hashedToken);
    
    // Find admin with matching token and check if token hasn't expired
    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!admin) {
      console.log('Invalid or expired reset token');
      res.status(400);
      throw new Error('Reset token is invalid or has expired');
    }

    console.log('Admin found:', admin.email);
    console.log('Token expires at:', admin.passwordResetExpires);
    
    // Check if token is still valid
    if (admin.passwordResetExpires < Date.now()) {
      console.log('Token has expired');
      res.status(400);
      throw new Error('Reset token has expired');
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Token is valid. Please proceed to reset your password.',
      email: admin.email
      // Removed token from response for security
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error validating reset token'
    });
  }
});

// @desc    Resend verification email
// @route   POST /api/admin/auth/resend-verification
// @access  Private/Admin
const resendVerification = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin.isVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = admin.createVerificationToken();
  await admin.save({ validateBeforeSave: false });

  // Send verification email
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

// @desc    Logout admin
// @route   POST /api/admin/auth/logout
// @access  Private/Admin
const logoutAdmin = asyncHandler(async (req, res) => {
  // Update last activity
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

// @desc    Get all admins (for super admin only)
// @route   GET /api/admin/auth/admins
// @access  Private/SuperAdmin
const getAllAdmins = asyncHandler(async (req, res) => {
  // Check if current admin is super admin
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

// @desc    Update admin status (for super admin only)
// @route   PUT /api/admin/auth/admins/:id
// @access  Private/SuperAdmin
const updateAdminStatus = asyncHandler(async (req, res) => {
  // Check if current admin is super admin
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
  
  // Update permissions if provided
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

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
getProductById,
getProducts,

  
  // Admin controllers
  registerAdmin,
  verifyEmail,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  resendVerification,
  logoutAdmin,
  getAllAdmins,
  updateAdminStatus,
  uploadProductImage,
  deleteProductImage,
  deleteMultipleImages,
  uploadMultipleImages
};
