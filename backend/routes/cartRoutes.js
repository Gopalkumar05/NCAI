const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.route('/')
  .get(protect, cartController.getCart)
  .post(protect, cartController.addToCart)
  .delete(protect, cartController.clearCart);

router.route('/:itemId')
  .put(protect, cartController.updateCartItem)
  .delete(protect, cartController.removeFromCart);

module.exports = router;