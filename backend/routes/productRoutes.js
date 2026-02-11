// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const productController = require('../controllers/productController');

// // Public routes
// router.get('/', productController.getProducts);
// router.get('/featured', productController.getFeaturedProducts);
// router.get('/top-rated', productController.getTopRatedProducts);
// router.get('/new-arrivals', productController.getNewArrivals);
// router.get('/discounted', productController.getDiscountedProducts);
// router.get('/category/:category', productController.getProductsByCategory);
// router.get('/occasion/:occasion', productController.getProductsByOccasion);
// router.get('/:id', productController.getProductById);
// router.get('/:id/reviews', productController.getProductReviews);

// // Protected routes
// router.post('/:id/reviews', protect, productController.createProductReview);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const productController = require('../controllers/productController');

// // Public routes
// router.get('/', productController.getProducts);
// router.get('/featured', productController.getFeaturedProducts);
// router.get('/top-rated', productController.getTopRatedProducts);
// router.get('/new-arrivals', productController.getNewArrivals);
// router.get('/discounted', productController.getDiscountedProducts);
// router.get('/category/:category', productController.getProductsByCategory);
// router.get('/occasion/:occasion', productController.getProductsByOccasion);
// router.get('/:id', productController.getProductById);
// router.get('/:id/reviews', productController.getProductReviews);
// router.get('/:id/reviews/:reviewId', productController.getReviewById);

// // Protected routes
// router.post('/:id/reviews', protect, productController.createProductReview);
// router.put('/:id/reviews/:reviewId', protect, productController.updateProductReview);
// router.delete('/:id/reviews/:reviewId', protect, productController.deleteProductReview);
// router.post('/:id/reviews/:reviewId/helpful', protect, productController.markReviewAsHelpful);
// router.post('/:id/reviews/:reviewId/report', protect, productController.reportReview);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/top-rated', productController.getTopRatedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/discounted', productController.getDiscountedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/occasion/:occasion', productController.getProductsByOccasion);
router.get('/:id', productController.getProductById);
router.get('/:id/reviews', productController.getProductReviews);
router.get('/:id/reviews/:reviewId', productController.getReviewById);

// Protected routes
router.post('/:id/reviews', protect, productController.createProductReview);
router.put('/:id/reviews/:reviewId', protect, productController.updateProductReview);
router.delete('/:id/reviews/:reviewId', protect, productController.deleteProductReview);
router.post('/:id/reviews/:reviewId/helpful', protect, productController.markReviewAsHelpful);
router.post('/:id/reviews/:reviewId/report', protect, productController.reportReview);

// Image routes
router.delete('/:id/reviews/:reviewId/images/:imageIndex', protect, productController.deleteReviewImage);
router.post('/:id/reviews/:reviewId/images', protect, productController.uploadReviewImages);

module.exports = router;