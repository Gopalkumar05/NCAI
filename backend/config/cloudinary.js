const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

// Image Upload Configuration
const imageUploadConfig = {
  folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'flower_shop',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  transformation: [
    { width: 800, height: 800, crop: 'limit' }, // Main image
    { quality: 'auto:good' },
    { fetch_format: 'auto' }
  ],
  resource_type: 'image',
  max_file_size: Number(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  timeout: 60000 // 1 minute timeout
};

// Product Image Storage
const productImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `${imageUploadConfig.folder}/products`,
    allowed_formats: imageUploadConfig.allowed_formats,
    transformation: imageUploadConfig.transformation,
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      return `product_${timestamp}_${randomString}`;
    }
  }
});

// User Avatar Storage
const userAvatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `${imageUploadConfig.folder}/avatars`,
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 200, height: 200, crop: 'thumb', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const userId = req.user?._id || 'anonymous';
      return `avatar_${userId}_${timestamp}`;
    }
  }
});

// Review Image Storage
const reviewImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `${imageUploadConfig.folder}/reviews`,
    allowed_formats: imageUploadConfig.allowed_formats,
    transformation: [
      { width: 600, height: 600, crop: 'limit' },
      { quality: 'auto:good' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      return `review_${timestamp}_${randomString}`;
    }
  }
});

// Banner/Ad Image Storage
const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `${imageUploadConfig.folder}/banners`,
    allowed_formats: imageUploadConfig.allowed_formats,
    transformation: [
      { width: 1200, height: 400, crop: 'fill' },
      { quality: 'auto:best' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `banner_${timestamp}`;
    }
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
  }
};

// Create multer upload instances
const uploadProductImage = multer({ 
  storage: productImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: imageUploadConfig.max_file_size
  }
});

const uploadUserAvatar = multer({ 
  storage: userAvatarStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB for avatars
  }
});

const uploadReviewImage = multer({ 
  storage: reviewImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: imageUploadConfig.max_file_size
  }
});

const uploadBannerImage = multer({ 
  storage: bannerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB for banners
  }
});

// Helper functions for Cloudinary operations
const cloudinaryUtils = {
  // Upload image from buffer (for base64 images)
  uploadFromBuffer: async (buffer, folder = 'temp') => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${imageUploadConfig.folder}/${folder}`,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });
  },

  // Upload multiple images
  uploadMultipleImages: async (files, folder = 'products') => {
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${imageUploadConfig.folder}/${folder}`,
            resource_type: 'image',
            transformation: imageUploadConfig.transformation
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(file.buffer);
      });
    });
    
    return Promise.all(uploadPromises);
  },

  // Delete image by public_id
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Delete multiple images
  deleteMultipleImages: async (publicIds) => {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      throw error;
    }
  },

  // Generate optimized image URL
  getOptimizedUrl: (publicId, options = {}) => {
    const defaultOptions = {
      width: 800,
      height: 800,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, finalOptions);
  },

  // Generate thumbnail URL
  getThumbnailUrl: (publicId) => {
    return cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });
  },

  // Generate responsive image srcset
  getResponsiveSrcset: (publicId, sizes = [300, 600, 900, 1200]) => {
    return sizes.map(size => {
      const url = cloudinary.url(publicId, {
        width: size,
        crop: 'scale',
        quality: 'auto',
        fetch_format: 'auto'
      });
      return `${url} ${size}w`;
    }).join(', ');
  },

  // Get image info
  getImageInfo: async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Error getting image info:', error);
      throw error;
    }
  },

  // Create image transformation
  createTransformation: (options) => {
    return cloudinary.url('sample', options).split('/').pop();
  }
};

// Middleware for handling upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${imageUploadConfig.max_file_size / 1024 / 1024}MB`
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

const uploadToCloudinary = async (filePath, folder = 'reviews') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `bloombox/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Export everything
module.exports = {
  cloudinary,
  testCloudinaryConnection,
  imageUploadConfig,
  productImageStorage,
  userAvatarStorage,
  reviewImageStorage,
  bannerStorage,
  uploadProductImage,
  uploadUserAvatar,
  uploadReviewImage,
  uploadBannerImage,
  cloudinaryUtils,
  handleUploadError,
  imageFileFilter,
  uploadToCloudinary,
  deleteFromCloudinary
};