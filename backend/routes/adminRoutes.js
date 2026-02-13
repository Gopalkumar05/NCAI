

// // routes/adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect, admin, superAdminProtect } = require('../middleware/authMiddleware');
// const {
//   getAllAdmins,
//   updateAdminStatus,
//   getDashboardStats,
//   getUsers,
//   getUserById,
//   updateUser,
//   getProducts,        // Add this
//   getProductById, 
//   deleteUser,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getOrders,
//   updateOrderStatus,
//   uploadProductImage,
//   deleteProductImage,
//   uploadMultipleImages
// } = require('../controllers/adminController');
// const { upload, uploadMultiple } = require('../middleware/uploadMiddleware');
// // Dashboard
// router.get('/dashboard',  admin, getDashboardStats);
// router.post('/upload/image', protect, admin, upload.single('image'), uploadProductImage);
// // route
// router.delete('/upload/image', protect, admin, deleteProductImage);
// // Multiple images upload
// router.post('/upload/images', protect, admin, uploadMultiple.array('images', 10), uploadMultipleImages);

// // User Management
// router.get('/users', protect, admin, getUsers);
// router.get('/users/:id', protect, admin, getUserById);
// router.put('/users/:id', protect, admin, updateUser);
// router.delete('/users/:id', protect, admin, deleteUser);

// // Product Management
// router.post('/products', protect, admin, createProduct);
// router.put('/products/:id', protect, admin, updateProduct);
// router.delete('/products/:id', protect, admin, deleteProduct);
// router.get('/products', protect, admin, getProducts);              // Add this line
// router.get('/products/:id', protect, admin, getProductById); 
// // Order Management
// router.get('/orders', protect, admin, getOrders);
// router.put('/orders/:id', protect, admin, updateOrderStatus);

// // Super admin only routes
// router.get('/admins', superAdminProtect, getAllAdmins);
// router.put('/admins/:id', superAdminProtect, updateAdminStatus);

// module.exports = router;






const express = require('express');
const router = express.Router();
const { protect, admin, superAdminProtect } = require('../middleware/authMiddleware');
const {
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
  
  // Super Admin
  getAllAdmins,
  updateAdminStatus
} = require('../controllers/adminController');

const { upload, uploadMultiple } = require('../middleware/uploadMiddleware');

// ==============================
// ALL ROUTES REQUIRE ADMIN AUTHENTICATION
// ==============================
router.use(protect, admin);

// ==============================
// IMAGE UPLOAD ROUTES
// ==============================
router.post('/upload/image', upload.single('image'), uploadProductImage);
router.post('/upload/images', uploadMultiple.array('images', 10), uploadMultipleImages);
router.delete('/upload/image', deleteProductImage);

// ==============================
// DASHBOARD ROUTES
// ==============================
router.get('/dashboard', getDashboardStats);

// ==============================
// USER MANAGEMENT ROUTES
// ==============================
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ==============================
// PRODUCT MANAGEMENT ROUTES
// ==============================
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ==============================
// ORDER MANAGEMENT ROUTES
// ==============================
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);

// ==============================
// SUPER ADMIN ROUTES
// ==============================
router.get('/admins', superAdminProtect, getAllAdmins);
router.put('/admins/:id', superAdminProtect, updateAdminStatus);

module.exports = router;
