// // middleware/uploadMiddleware.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const createUploadDir = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Configure storage with dynamic paths
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadType = req.body.type || 'general';
//     const uploadPath = path.join('uploads', uploadType);
    
//     createUploadDir(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
//     cb(null, `${baseName}-${uniqueSuffix}${ext}`);
//   }
// });

// // Enhanced file filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error(`File type not allowed. Allowed types: ${allowedTypes.toString()}`));
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { 
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//     files: 1 // Single file for single upload
//   },
//   fileFilter: fileFilter
// });

// // For multiple uploads
// const uploadMultiple = multer({
//   storage: storage,
//   limits: { 
//     fileSize: 5 * 1024 * 1024, // 5MB per file
//     files: 10 // Max 10 files for multiple uploads
//   },
//   fileFilter: fileFilter
// });

// module.exports = { upload, uploadMultiple };



const { uploadProductImage } = require('../config/cloudinary');

// Export the configured multer instance directly
module.exports = {
  upload: uploadProductImage,
  uploadMultiple: {
    array: (fieldName, maxCount) => uploadProductImage.array(fieldName, maxCount)
  }
};

