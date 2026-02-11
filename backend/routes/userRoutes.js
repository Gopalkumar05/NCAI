const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/userController');

// Profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

router.put('/change-password', protect, changePassword);

// Address routes
router.route('/addresses')
  .get(protect, getUserAddresses)
  .post(protect, addUserAddress);

router.route('/addresses/:id')
  .put(protect, updateUserAddress)
  .delete(protect, deleteUserAddress);

router.put('/addresses/:id/default', protect, setDefaultAddress);

// Order routes
router.get('/orders', protect, getUserOrders);
router.route('/orders/:id')
  .get(protect, getOrderById);
 router.route('/orders/:id/cancel').put(protect, cancelOrder);

// Payment method routes
router.route('/payment-methods')
  .get(protect, getPaymentMethods)
  .post(protect, addPaymentMethod);

router.delete('/payment-methods/:id', protect, deletePaymentMethod);

// Notification routes
router.get('/notifications', protect, getNotifications);

// Settings routes
router.route('/settings')
  .get(protect, getUserSettings)
  .put(protect, updateUserSettings);

module.exports = router;