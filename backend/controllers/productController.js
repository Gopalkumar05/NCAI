const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {};
  
  const category = req.query.category ? { category: req.query.category } : {};
  const occasion = req.query.occasion ? { occasion: req.query.occasion } : {};
  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};
  
  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...occasion,
    ...minPrice,
    ...maxPrice,
    isAvailable: true
  });
  
  const products = await Product.find({
    ...keyword,
    ...category,
    ...occasion,
    ...minPrice,
    ...maxPrice,
    isAvailable: true
  })
  .limit(pageSize)
  .skip(pageSize * (page - 1))
  .sort({ [req.query.sortBy || 'createdAt']: req.query.sortOrder === 'asc' ? 1 : -1 });
  
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    count
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    isFeatured: true, 
    isAvailable: true 
  })
  .limit(8)
  .sort({ createdAt: -1 });
  
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isAvailable: true
    }).limit(4);
    
    // Get reviews
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ product, relatedProducts, reviews });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    category: req.params.category,
    isAvailable: true 
  });
  
  res.json(products);
});

// @desc    Get products for occasion
// @route   GET /api/products/occasion/:occasion
// @access  Public
const getProductsByOccasion = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    occasion: req.params.occasion,
    isAvailable: true 
  });
  
  res.json(products);
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
// const createProductReview = asyncHandler(async (req, res) => {
//   const { rating, comment } = req.body;
  
//   const product = await Product.findById(req.params.id);
  
//   if (!product) {
//     res.status(404);
//     throw new Error('Product not found');
//   }
  
//   // Check if user has purchased this product
//   const hasPurchased = false; // You would check order history here
  
//   const review = new Review({
//     product: req.params.id,
//     user: req.user._id,
//     rating: Number(rating),
//     comment,
//     isVerifiedPurchase: hasPurchased
//   });
  
//   const createdReview = await review.save();
  
//   // Update product rating
//   const reviews = await Review.find({ product: req.params.id });
//   product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//   product.numOfReviews = reviews.length;
//   await product.save();
  
//   res.status(201).json(createdReview);
// });

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  
  res.json(reviews);
});

// @desc    Get top rated products
// @route   GET /api/products/top-rated
// @access  Public
const getTopRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    isAvailable: true,
    ratings: { $gte: 4 }
  })
  .sort({ ratings: -1 })
  .limit(8);
  
  res.json(products);
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isAvailable: true })
    .sort({ createdAt: -1 })
    .limit(8);
  
  res.json(products);
});

// @desc    Get discounted products
// @route   GET /api/products/discounted
// @access  Public
const getDiscountedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    discountPrice: { $exists: true, $ne: null },
    isAvailable: true 
  })
  .sort({ createdAt: -1 })
  .limit(8);
  
  res.json(products);
});


// const updateProductReview = asyncHandler(async (req, res) => {
//   const { rating, comment } = req.body;
  
//   const review = await Review.findById(req.params.reviewId);
  
//   if (!review) {
//     res.status(404);
//     throw new Error('Review not found');
//   }
  
//   // Check if user owns the review
//   if (review.user.toString() !== req.user._id.toString()) {
//     res.status(401);
//     throw new Error('Not authorized to update this review');
//   }
  
//   // Update review
//   review.rating = Number(rating);
//   review.comment = comment;
//   review.isEdited = true;
//   review.lastEdited = Date.now();
  
//   const updatedReview = await review.save();
  
//   // Update product rating
//   const reviews = await Review.find({ product: req.params.id });
//   const product = await Product.findById(req.params.id);
  
//   product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//   product.numOfReviews = reviews.length;
//   await product.save();
  
//   res.json(updatedReview);
// });

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }
  
  await review.deleteOne();
  
  // Update product rating
  const reviews = await Review.find({ product: req.params.id });
  const product = await Product.findById(req.params.id);
  
  if (reviews.length > 0) {
    product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    product.numOfReviews = reviews.length;
  } else {
    product.ratings = 0;
    product.numOfReviews = 0;
  }
  
  await product.save();
  
  res.json({ message: 'Review deleted successfully' });
});

// @desc    Get single review
// @route   GET /api/products/:id/reviews/:reviewId
// @access  Public
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId)
    .populate('user', 'name')
    .populate('product', 'name');
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  res.json(review);
});

// @desc    Report a review
// @route   POST /api/products/:id/reviews/:reviewId/report
// @access  Private
const reportReview = asyncHandler(async (req, res) => {
  const { reason, details } = req.body;
  
  const review = await Review.findById(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user has already reported this review
  const alreadyReported = review.reports.some(
    report => report.user.toString() === req.user._id.toString()
  );
  
  if (alreadyReported) {
    res.status(400);
    throw new Error('You have already reported this review');
  }
  
  review.reports.push({
    user: req.user._id,
    reason,
    details,
    reportedAt: Date.now()
  });
  
  await review.save();
  
  res.json({ message: 'Review reported successfully' });
});

// @desc    Mark review as helpful
// @route   POST /api/products/:id/reviews/:reviewId/helpful
// @access  Private
const markReviewAsHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user has already marked as helpful
  const alreadyHelpful = review.helpfulVotes.some(
    vote => vote.user.toString() === req.user._id.toString()
  );
  
  if (alreadyHelpful) {
    // Remove helpful vote
    review.helpfulVotes = review.helpfulVotes.filter(
      vote => vote.user.toString() !== req.user._id.toString()
    );
  } else {
    // Add helpful vote
    review.helpfulVotes.push({
      user: req.user._id,
      votedAt: Date.now()
    });
  }
  
  review.helpfulCount = review.helpfulVotes.length;
  await review.save();
  
  res.json({ helpfulCount: review.helpfulCount, isHelpful: !alreadyHelpful });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/reviews';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).array('images', 4); // Max 4 images

// @desc    Create product review with images
// @route   POST /api/products/:id/reviews
// @access  Private
// const createProductReview = asyncHandler(async (req, res) => {
//   const { rating, title, comment } = req.body;
  
//   const product = await Product.findById(req.params.id);
  
//   if (!product) {
//     res.status(404);
//     throw new Error('Product not found');
//   }
  
//   // Check if user has already reviewed this product
//   const existingReview = await Review.findOne({
//     product: req.params.id,
//     user: req.user._id
//   });
  
//   if (existingReview) {
//     res.status(400);
//     throw new Error('You have already reviewed this product');
//   }
  
//   // Check if user has purchased this product (simplified)
//   const hasPurchased = false; // Implement actual purchase check
  
//   // Handle image uploads
//   let images = [];
  
//   if (req.files && req.files.length > 0) {
//     // Upload to Cloudinary (recommended for production)
//     if (process.env.CLOUDINARY_CLOUD_NAME) {
//       for (const file of req.files) {
//         try {
//           const result = await uploadToCloudinary(file.path, 'reviews');
//           images.push({
//             url: result.secure_url,
//             publicId: result.public_id
//           });
//           // Delete local file after upload
//           fs.unlinkSync(file.path);
//         } catch (error) {
//           console.error('Cloudinary upload error:', error);
//         }
//       }
//     } else {
//       // Local storage
//       images = req.files.map(file => ({
//         url: `/uploads/reviews/${file.filename}`,
//         localPath: file.path
//       }));
//     }
//   }
  
//   // Also handle URL images from request body
//   if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
//     const urlImages = req.body.imageUrls.filter(url => {
//       try {
//         new URL(url);
//         return true;
//       } catch {
//         return false;
//       }
//     }).map(url => ({ url }));
    
//     images = [...images, ...urlImages];
//   }
  
//   const review = new Review({
//     product: req.params.id,
//     user: req.user._id,
//     rating: Number(rating),
//     title: title || undefined,
//     comment,
//     images,
//     isVerifiedPurchase: hasPurchased
//   });
  
//   const createdReview = await review.save();
  
//   // Update product rating
//   const reviews = await Review.find({ product: req.params.id });
//   product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//   product.numOfReviews = reviews.length;
//   await product.save();
  
//   res.status(201).json(createdReview);
// });

// // @desc    Update product review with images
// // @route   PUT /api/products/:id/reviews/:reviewId
// // @access  Private
// const updateProductReview = asyncHandler(async (req, res) => {
//   const { rating, title, comment, images: newImagesData } = req.body;
  
//   const review = await Review.findById(req.params.reviewId);
  
//   if (!review) {
//     res.status(404);
//     throw new Error('Review not found');
//   }
  
//   // Check if user owns the review
//   if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
//     res.status(401);
//     throw new Error('Not authorized to update this review');
//   }
  
//   // Handle image uploads for update
//   let images = review.images || [];
  
//   if (req.files && req.files.length > 0) {
//     // Upload new images to Cloudinary
//     if (process.env.CLOUDINARY_CLOUD_NAME) {
//       for (const file of req.files) {
//         try {
//           const result = await uploadToCloudinary(file.path, 'reviews');
//           images.push({
//             url: result.secure_url,
//             publicId: result.public_id
//           });
//           // Delete local file after upload
//           fs.unlinkSync(file.path);
//         } catch (error) {
//           console.error('Cloudinary upload error:', error);
//         }
//       }
//     } else {
//       // Local storage
//       const newLocalImages = req.files.map(file => ({
//         url: `/uploads/reviews/${file.filename}`,
//         localPath: file.path
//       }));
//       images = [...images, ...newLocalImages];
//     }
//   }
  
//   // Handle URL images from request body
//   if (newImagesData && Array.isArray(newImagesData)) {
//     const urlImages = newImagesData
//       .filter(img => img.url && img.type === 'url')
//       .map(img => ({ url: img.url }));
    
//     images = [...images, ...urlImages];
//   }
  
//   // Limit to 4 images
//   images = images.slice(0, 4);
  
//   // Update review
//   review.rating = Number(rating);
//   review.title = title || undefined;
//   review.comment = comment;
//   review.images = images;
//   review.isEdited = true;
//   review.lastEdited = Date.now();
  
//   const updatedReview = await review.save();
  
//   // Update product rating
//   const reviews = await Review.find({ product: req.params.id });
//   const product = await Product.findById(req.params.id);
  
//   product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//   product.numOfReviews = reviews.length;
//   await product.save();
  
//   res.json(updatedReview);
// });

// @desc    Create product review (with images)
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, title, comment, imageUrls } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    product: req.params.id,
    user: req.user._id
  });
  
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }
  
  // Process uploaded files
  let images = [];
  
  // Handle file uploads
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => ({
      url: `/uploads/reviews/${file.filename}`,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    }));
  }
  
  // Handle URL images
  if (imageUrls) {
    try {
      const urls = JSON.parse(imageUrls);
      if (Array.isArray(urls)) {
        const urlImages = urls.map(url => ({ url }));
        images = [...images, ...urlImages];
      }
    } catch (error) {
      console.error('Error parsing imageUrls:', error);
    }
  }
  
  // Limit to 4 images
  images = images.slice(0, 4);
  
  const review = new Review({
    product: req.params.id,
    user: req.user._id,
    rating: Number(rating),
    title: title || undefined,
    comment,
    images,
    isVerifiedPurchase: false // Set based on actual purchase check
  });
  
  const createdReview = await review.save();
  
  // Update product rating
  const reviews = await Review.find({ product: req.params.id });
  product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  product.numOfReviews = reviews.length;
  await product.save();
  
  res.status(201).json(createdReview);
});

// @desc    Update product review (with images)
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, title, comment, images: imageData } = req.body;
  
  const review = await Review.findById(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check authorization
  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }
  
  // Process new images
  let newImages = [];
  
  // Handle file uploads
  if (req.files && req.files.length > 0) {
    const fileImages = req.files.map(file => ({
      url: `/uploads/reviews/${file.filename}`,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    }));
    newImages = [...newImages, ...fileImages];
  }
  
  // Keep existing images if provided
  if (imageData) {
    try {
      const parsedImages = JSON.parse(imageData);
      if (Array.isArray(parsedImages)) {
        newImages = [...newImages, ...parsedImages];
      }
    } catch (error) {
      console.error('Error parsing imageData:', error);
    }
  }
  
  // Limit to 4 images
  review.images = newImages.slice(0, 4);
  review.rating = Number(rating);
  review.title = title || undefined;
  review.comment = comment;
  review.isEdited = true;
  review.lastEdited = Date.now();
  
  const updatedReview = await review.save();
  
  // Update product rating
  const reviews = await Review.find({ product: req.params.id });
  const product = await Product.findById(req.params.id);
  
  product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  product.numOfReviews = reviews.length;
  await product.save();
  
  res.json(updatedReview);
});

// @desc    Delete product review image
// @route   DELETE /api/products/:id/reviews/:reviewId/images/:imageIndex
// @access  Private
const deleteReviewImage = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to modify this review');
  }
  
  const imageIndex = parseInt(req.params.imageIndex);
  
  if (imageIndex < 0 || imageIndex >= review.images.length) {
    res.status(400);
    throw new Error('Invalid image index');
  }
  
  const imageToDelete = review.images[imageIndex];
  
  // Delete from Cloudinary if publicId exists
  if (imageToDelete.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      await deleteFromCloudinary(imageToDelete.publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
  
  // Delete local file if exists
  if (imageToDelete.localPath && fs.existsSync(imageToDelete.localPath)) {
    try {
      fs.unlinkSync(imageToDelete.localPath);
    } catch (error) {
      console.error('Error deleting local file:', error);
    }
  }
  
  // Remove image from array
  review.images.splice(imageIndex, 1);
  await review.save();
  
  res.json({ message: 'Image deleted successfully', review });
});

// @desc    Upload review images
// @route   POST /api/products/:id/reviews/:reviewId/images
// @access  Private
const uploadReviewImages = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to modify this review');
  }
  
  if (review.images.length >= 4) {
    res.status(400);
    throw new Error('Maximum 4 images allowed per review');
  }
  
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images provided');
  }
  
  const availableSlots = 4 - review.images.length;
  const filesToUpload = req.files.slice(0, availableSlots);
  
  let newImages = [];
  
  // Upload to Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    for (const file of filesToUpload) {
      try {
        const result = await uploadToCloudinary(file.path, 'reviews');
        newImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
        // Delete local file
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
      }
    }
  } else {
    // Local storage
    newImages = filesToUpload.map(file => ({
      url: `/uploads/reviews/${file.filename}`,
      localPath: file.path
    }));
  }
  
  review.images = [...review.images, ...newImages];
  await review.save();
  
  res.status(201).json({
    message: 'Images uploaded successfully',
    images: newImages,
    totalImages: review.images.length
  });
});

// module.exports = {
//   getProducts,
//   getFeaturedProducts,
//   getProductById,
//   getProductsByCategory,
//   getProductsByOccasion,
//   createProductReview,
//   updateProductReview,
//   deleteProductReview,
//   getProductReviews,
//   getReviewById,
//   reportReview,
//   markReviewAsHelpful,
//   getTopRatedProducts,
//   getNewArrivals,
//   getDiscountedProducts
// };

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getProductsByOccasion,
  createProductReview: [
    upload,
    asyncHandler(createProductReview)
  ],
  updateProductReview: [
    upload,
    asyncHandler(updateProductReview)
  ],
  deleteProductReview,
  getProductReviews,
  getReviewById,
  reportReview,
  markReviewAsHelpful,
  deleteReviewImage,
  uploadReviewImages,
  getTopRatedProducts,
  getNewArrivals,
  getDiscountedProducts
};