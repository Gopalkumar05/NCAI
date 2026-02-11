

// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin, superAdminProtect } = require('../middleware/authMiddleware');
const {
  getAllAdmins,
  updateAdminStatus,
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  getProducts,        // Add this
  getProductById, 
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  uploadProductImage,
  deleteProductImage,
  uploadMultipleImages
} = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middleware/uploadMiddleware');
// Dashboard
router.get('/dashboard',  admin, getDashboardStats);
router.post('/upload/image', protect, admin, upload.single('image'), uploadProductImage);
// route
router.delete('/upload/image', protect, admin, deleteProductImage);
// Multiple images upload
router.post('/upload/images', protect, admin, uploadMultiple.array('images', 10), uploadMultipleImages);

// User Management
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

// Product Management
router.post('/products', protect, admin, createProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.get('/products', protect, admin, getProducts);              // Add this line
router.get('/products/:id', protect, admin, getProductById); 
// Order Management
router.get('/orders', protect, admin, getOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

// Super admin only routes
router.get('/admins', superAdminProtect, getAllAdmins);
router.put('/admins/:id', superAdminProtect, updateAdminStatus);

module.exports = router;