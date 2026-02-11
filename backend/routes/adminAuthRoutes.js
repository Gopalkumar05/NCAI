// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const { admin } = require('../middleware/authMiddleware');
const {
  registerAdmin,
  verifyEmail,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  resendVerification,
  logoutAdmin
} = require('../controllers/adminController');

// Public admin auth routes
router.post('/register', registerAdmin);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotAdminPassword);
router.post('/reset-password/:token', resetAdminPassword);
router.get('/reset-password/:token', resetAdminPassword);
router.get('/validate-reset-token/:token', resetAdminPassword);
// Protected admin auth routes (require admin authentication)
router.get('/me', admin, getAdminProfile);
router.put('/update-profile', admin, updateAdminProfile);
router.put('/change-password', admin, changeAdminPassword);
router.post('/resend-verification', admin, resendVerification);
router.post('/logout', admin, logoutAdmin);

module.exports = router;