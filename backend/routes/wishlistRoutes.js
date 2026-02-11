const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const wishlistController = require('../controllers/wishlistController');

router.route('/')
  .get(protect, wishlistController.getWishlist)
  .post(protect, wishlistController.addToWishlist)
  .delete(protect, wishlistController.clearWishlist);

router.delete('/:productId', protect, wishlistController.removeFromWishlist);
router.post('/:productId/move-to-cart', protect, wishlistController.moveToCart);

module.exports = router;