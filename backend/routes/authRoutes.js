


const express = require('express');
const router = express.Router();
const {protect}= require('../middleware/authMiddleware')
const { registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserAddress,
  removeUserAddress,
  forgotUserPassword,
  resetUserPassword, } = require('../controllers/authController');


router.post('/register', registerUser);
router.post('/login',loginUser);
router.post('/forgot-password',forgotUserPassword);
router.put('/reset-password/:resetToken',resetUserPassword);

// Protected routes - User
router.get('/profile', protect,getUserProfile);
router.put('/profile', protect,updateUserProfile);
router.put('/address', protect,updateUserAddress);
router.delete('/address/:index', protect,removeUserAddress);

module.exports = router;