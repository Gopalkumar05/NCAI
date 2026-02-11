

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Star, 
//   X, 
//   User, 
//   AlertCircle, 
//   Edit2, 
//   Upload, 
//   Link, 
//   Image as ImageIcon,
//   Trash2,
//   Eye,
//   ExternalLink,
//   CheckCircle,
//   Info
// } from 'lucide-react';

// const ReviewForm = ({ 
//   onSubmit, 
//   onCancel, 
//   productName, 
//   isSubmitting = false,
//   initialData = null,
//   isEditMode = false 
// }) => {
//   const [rating, setRating] = useState(initialData?.rating || 0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [title, setTitle] = useState(initialData?.title || '');
//   const [comment, setComment] = useState(initialData?.comment || '');
//   const [images, setImages] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [activeTab, setActiveTab] = useState('upload');
//   const [imageUrlInput, setImageUrlInput] = useState('');
//   const fileInputRef = useRef(null);
//   const [uploadProgress, setUploadProgress] = useState({});

//   // Backend URL (same as ReviewList)
//   const BACKEND_URL = 'http://localhost:5000';

//   // Function to get full image URL (same as ReviewList)
//   const getFullImageUrl = (imagePath) => {
//     if (!imagePath) return null;
    
//     // If it's already a full URL
//     if (
//       imagePath.startsWith('http://') || 
//       imagePath.startsWith('https://') || 
//       imagePath.startsWith('blob:') ||
//       imagePath.startsWith('data:')
//     ) {
//       return imagePath;
//     }
    
//     // If it's a relative path starting with /uploads
//     if (imagePath.startsWith('/uploads/')) {
//       return `${BACKEND_URL}${imagePath}`;
//     }
    
//     // If it's just a filename
//     if (imagePath.includes('.png') || imagePath.includes('.jpg') || imagePath.includes('.jpeg') || imagePath.includes('.webp') || imagePath.includes('.gif')) {
//       return `${BACKEND_URL}/uploads/reviews/${imagePath}`;
//     }
    
//     return imagePath;
//   };

//   useEffect(() => {
//     if (initialData) {
//       setRating(initialData.rating || 0);
//       setTitle(initialData.title || '');
//       setComment(initialData.comment || '');
      
//       // Process images when in edit mode
//       if (initialData.images && Array.isArray(initialData.images)) {
//         const processedImages = initialData.images.map(image => {
//           // If image is a string (URL), convert it to object
//           if (typeof image === 'string') {
//             return {
//               url: getFullImageUrl(image),
//               originalUrl: image,
//               type: 'url',
//               id: Date.now() + Math.random()
//             };
//           }
//           // If image is an object
//           else if (image && typeof image === 'object') {
//             return {
//               ...image,
//               url: image.url ? getFullImageUrl(image.url) : image.file ? URL.createObjectURL(image.file) : null,
//               type: image.type || 'url',
//               id: image.id || Date.now() + Math.random()
//             };
//           }
//           return image;
//         });
//         setImages(processedImages);
//       }
//     }
//   }, [initialData]);

//   // Cleanup blob URLs on unmount
//   useEffect(() => {
//     return () => {
//       images.forEach(image => {
//         if (image?.url?.startsWith('blob:')) {
//           URL.revokeObjectURL(image.url);
//         }
//       });
//     };
//   }, []);

//   const validateImageUrl = (url) => {
//     try {
//       new URL(url);
//       const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
//       const hasValidExtension = imageExtensions.some(ext => 
//         url.toLowerCase().endsWith(ext)
//       );
//       return hasValidExtension;
//     } catch {
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     if (rating === 0) {
//       newErrors.rating = 'Please select a rating';
//     }

//     if (!comment.trim()) {
//       newErrors.comment = 'Please write a review';
//     } else if (comment.trim().length < 10) {
//       newErrors.comment = 'Review must be at least 10 characters';
//     } else if (comment.trim().length > 1000) {
//       newErrors.comment = 'Review must be less than 1000 characters';
//     }

//     if (title && title.length > 100) {
//       newErrors.title = 'Title must be less than 100 characters';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     // Create FormData for submission
//     const formData = new FormData();
//     formData.append('rating', rating);
//     formData.append('comment', comment.trim());
    
//     if (title.trim()) {
//       formData.append('title', title.trim());
//     }

//     // Add uploaded files
//     const newFiles = [];
//     const existingUrls = [];

//     images.forEach((image) => {
//       if (image.file) {
//         // New file upload
//         formData.append('images', image.file);
//         newFiles.push(image);
//       } else if (image.url && !image.file) {
//         // Existing URL (from server)
//         if (image.originalUrl) {
//           existingUrls.push(image.originalUrl);
//         } else {
//           existingUrls.push(image.url);
//         }
//       }
//     });

//     // Add existing image URLs as JSON
//     if (existingUrls.length > 0) {
//       formData.append('existingImages', JSON.stringify(existingUrls));
//     }

//     // Add to let backend know if we're in edit mode
//     if (isEditMode && initialData?._id) {
//       formData.append('reviewId', initialData._id);
//     }

//     onSubmit(formData);
//   };

//   const handleRatingChange = (newRating) => {
//     setRating(newRating);
//     if (errors.rating) {
//       setErrors({ ...errors, rating: '' });
//     }
//   };

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//     if (errors.title) {
//       setErrors({ ...errors, title: '' });
//     }
//   };

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//     if (errors.comment) {
//       setErrors({ ...errors, comment: '' });
//     }
//   };

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const totalImages = images.length + files.length;
    
//     if (totalImages > 4) {
//       alert(`Maximum 4 images allowed. You already have ${images.length} images.`);
//       return;
//     }

//     // Validate and process files
//     files.forEach(file => {
//       const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
//       const isValidSize = file.size <= 5 * 1024 * 1024;
      
//       if (!isValidType) {
//         alert(`${file.name} is not a valid image type.`);
//         return;
//       }
      
//       if (!isValidSize) {
//         alert(`${file.name} is too large. Maximum size is 5MB.`);
//         return;
//       }

//       const imageObject = {
//         url: URL.createObjectURL(file),
//         file: file,
//         name: file.name,
//         size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
//         type: 'upload',
//         id: Date.now() + Math.random()
//       };
      
//       setImages(prev => [...prev, imageObject]);
//     });
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleAddUrl = () => {
//     const url = imageUrlInput.trim();
    
//     if (!url) {
//       alert('Please enter an image URL');
//       return;
//     }

//     if (!validateImageUrl(url)) {
//       alert('Please enter a valid image URL (must end with .jpg, .png, .gif, etc.)');
//       return;
//     }

//     if (images.length >= 4) {
//       alert('Maximum 4 images allowed.');
//       return;
//     }

//     if (images.some(img => img.url === url || img.originalUrl === url)) {
//       alert('This URL is already added');
//       return;
//     }

//     const imageObject = {
//       url: url,
//       originalUrl: url,
//       type: 'url',
//       id: Date.now() + Math.random()
//     };
    
//     setImages(prev => [...prev, imageObject]);
//     setImageUrlInput('');
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddUrl();
//     }
//   };

//   const removeImage = (id) => {
//     const imageToRemove = images.find(img => img.id === id);
//     if (imageToRemove?.url?.startsWith('blob:')) {
//       URL.revokeObjectURL(imageToRemove.url);
//     }
//     setImages(prev => prev.filter(img => img.id !== id));
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const files = Array.from(e.dataTransfer.files);
//       const dataTransfer = new DataTransfer();
//       files.forEach(file => dataTransfer.items.add(file));
      
//       if (fileInputRef.current) {
//         fileInputRef.current.files = dataTransfer.files;
//         handleFileUpload({ target: { files: dataTransfer.files } });
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center mb-2">
//           <div className="flex items-center gap-3">
//             {isEditMode && (
//               <div className="p-2 bg-blue-100 rounded-full">
//                 <Edit2 className="w-5 h-5 text-blue-600" />
//               </div>
//             )}
//             <h3 className="text-xl font-bold text-gray-900">
//               {isEditMode ? 'Edit Your Review' : 'Write a Review'}
//             </h3>
//           </div>
//           {onCancel && (
//             <button
//               onClick={onCancel}
//               className="p-2 hover:bg-gray-100 rounded-full"
//               type="button"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           )}
//         </div>
//         {productName && (
//           <p className="text-gray-600">
//             {isEditMode ? 'Update your review for ' : 'Share your thoughts about '}
//             <span className="font-semibold text-gray-900">{productName}</span>
//           </p>
//         )}
//         {initialData?.isEdited && (
//           <div className="mt-2 text-sm text-gray-500">
//             Last edited: {new Date(initialData.lastEdited).toLocaleDateString()}
//           </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} className="p-6">
//         {/* Rating Section */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-3">
//             How would you rate this product? *
//           </label>
          
//           <div className="flex items-center gap-1 mb-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 type="button"
//                 onClick={() => handleRatingChange(star)}
//                 onMouseEnter={() => setHoverRating(star)}
//                 onMouseLeave={() => setHoverRating(0)}
//                 className="p-1 focus:outline-none hover:scale-110 transition-transform"
//               >
//                 <Star
//                   className={`w-10 h-10 transition-colors ${
//                     star <= (hoverRating || rating)
//                       ? 'text-yellow-400 fill-current'
//                       : 'text-gray-300'
//                   }`}
//                 />
//               </button>
//             ))}
//             <span className="ml-4 text-lg font-semibold text-gray-900">
//               {rating > 0 ? `${rating}.0` : '0.0'} / 5.0
//             </span>
//           </div>

//           <div className="flex justify-between text-sm text-gray-500 px-1">
//             <span>Poor</span>
//             <span>Average</span>
//             <span>Good</span>
//             <span>Very Good</span>
//             <span>Excellent</span>
//           </div>

//           {errors.rating && (
//             <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
//               <AlertCircle className="w-4 h-4" />
//               {errors.rating}
//             </div>
//           )}
//         </div>

//         {/* Review Title */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Review Title
//           </label>
//           <input
//             type="text"
//             value={title}
//             onChange={handleTitleChange}
//             placeholder="Summarize your experience (optional)"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//             maxLength={100}
//           />
//           <div className="flex justify-between items-center mt-1">
//             {errors.title && (
//               <div className="flex items-center gap-2 text-red-600 text-sm">
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.title}
//               </div>
//             )}
//             <div className="text-xs text-gray-500">
//               {title.length}/100 characters
//             </div>
//           </div>
//         </div>

//         {/* Review Comment */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Your Review *
//           </label>
//           <textarea
//             value={comment}
//             onChange={handleCommentChange}
//             placeholder="Share details of your experience with this product..."
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent min-h-[120px] resize-y"
//             rows={4}
//             maxLength={1000}
//           />
          
//           <div className="flex justify-between items-center mt-2">
//             <div>
//               {errors.comment && (
//                 <div className="flex items-center gap-2 text-red-600 text-sm">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.comment}
//                 </div>
//               )}
//             </div>
//             <div className="text-xs text-gray-500">
//               {comment.length}/1000 characters
//             </div>
//           </div>

//           {!isEditMode && (
//             <div className="mt-3 text-sm text-gray-600">
//               <p className="font-medium mb-1">Tips for a great review:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>Describe the quality and freshness</li>
//                 <li>Mention delivery and packaging</li>
//                 <li>Share how you used the flowers</li>
//                 <li>Include photos if possible</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Photo Upload Section */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Add Photos (Optional)
//             </label>
//             <span className="text-sm text-gray-500">
//               {images.length} of 4 images
//             </span>
//           </div>
          
//           {/* Tab Navigation */}
//           <div className="flex border-b border-gray-200 mb-4">
//             <button
//               type="button"
//               onClick={() => setActiveTab('upload')}
//               className={`flex-1 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'upload' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Upload className="w-4 h-4" />
//                 Upload Files
//               </div>
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab('url')}
//               className={`flex-1 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'url' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <Link className="w-4 h-4" />
//                 Add URL
//               </div>
//             </button>
//           </div>

//           {/* Upload Tab Content */}
//           {activeTab === 'upload' && (
//             <div>
//               <div
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-colors cursor-pointer mb-4"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-700 font-medium mb-2">
//                   Click to upload or drag and drop
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   PNG, JPG, WebP, GIF up to 5MB
//                 </p>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//           )}

//           {/* URL Tab Content */}
//           {activeTab === 'url' && (
//             <div className="space-y-4">
//               <div className="flex gap-2">
//                 <div className="flex-1">
//                   <input
//                     type="url"
//                     value={imageUrlInput}
//                     onChange={(e) => setImageUrlInput(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="https://example.com/image.jpg"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleAddUrl}
//                   disabled={!imageUrlInput.trim() || images.length >= 4}
//                   className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Add URL
//                 </button>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <Info className="w-4 h-4" />
//                 <span>Enter direct image URLs ending with .jpg, .png, .gif, etc.</span>
//               </div>
//             </div>
//           )}

//           {/* Image Thumbnails */}
//           {images.length > 0 && (
//             <div className="mt-6">
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 {images.map((image) => (
//                   <div key={image.id} className="relative group">
//                     <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
//                       {image.url ? (
//                         <img
//                           src={image.url}
//                           alt="Review"
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                             e.target.parentElement.innerHTML = `
//                               <div class="w-full h-full flex items-center justify-center bg-gray-100">
//                                 <div class="text-center p-2">
//                                   <ImageIcon class="w-6 h-6 text-gray-400 mx-auto mb-1" />
//                                   <p class="text-xs text-gray-500">Image not available</p>
//                                 </div>
//                               </div>
//                             `;
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <ImageIcon className="w-8 h-8 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeImage(image.id)}
//                       className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                     {image.type === 'upload' && (
//                       <div className="mt-1 text-xs text-gray-500 truncate">
//                         {image.name}
//                       </div>
//                     )}
//                     {image.type === 'url' && (
//                       <div className="mt-1 text-xs text-gray-500 truncate">
//                         URL Image
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
              
//               {/* Clear All Button */}
//               <div className="mt-4 text-right">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (window.confirm('Remove all images?')) {
//                       images.forEach(img => {
//                         if (img.url?.startsWith('blob:')) {
//                           URL.revokeObjectURL(img.url);
//                         }
//                       });
//                       setImages([]);
//                     }
//                   }}
//                   className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 ml-auto"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Clear All Images
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Verification Notice */}
//         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//           <div className="flex items-start gap-3">
//             <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
//             <div>
//               <p className="text-sm font-medium text-green-900">Verified Purchase</p>
//               <p className="text-sm text-green-700">
//                 Your review will be marked as "Verified Purchase" since you bought this product.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Submit Buttons */}
//         <div className="flex flex-wrap gap-4">
//           <button
//             type="submit"
//             disabled={isSubmitting || rating === 0 || !comment.trim()}
//             className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 {isEditMode ? 'Updating Review...' : 'Submitting Review...'}
//               </div>
//             ) : (
//               isEditMode ? 'Update Review' : 'Submit Review'
//             )}
//           </button>
          
//           {onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ReviewForm;


import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  X, 
  AlertCircle, 
  Edit2, 
  Upload, 
  Link, 
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  Info
} from 'lucide-react';

const ReviewForm = ({ 
  onSubmit, 
  onCancel, 
  productName, 
  isSubmitting = false,
  initialData = null,
  isEditMode = false 
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [comment, setComment] = useState(initialData?.comment || '');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  // Backend URL (same as ReviewList)
  const BACKEND_URL = 'http://localhost:5000';

  // Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL
    if (
      imagePath.startsWith('http://') || 
      imagePath.startsWith('https://') || 
      imagePath.startsWith('blob:') ||
      imagePath.startsWith('data:')
    ) {
      return imagePath;
    }
    
    // If it's a relative path starting with /uploads
    if (imagePath.startsWith('/uploads/')) {
      return `${BACKEND_URL}${imagePath}`;
    }
    
    // If it's just a filename
    if (imagePath.includes('.png') || imagePath.includes('.jpg') || imagePath.includes('.jpeg') || imagePath.includes('.webp') || imagePath.includes('.gif')) {
      return `${BACKEND_URL}/uploads/reviews/${imagePath}`;
    }
    
    return imagePath;
  };

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 0);
      setTitle(initialData.title || '');
      setComment(initialData.comment || '');
      
      // Process images when in edit mode
      if (initialData.images && Array.isArray(initialData.images)) {
        const processedImages = initialData.images.map(image => {
          if (typeof image === 'string') {
            return {
              url: getFullImageUrl(image),
              originalUrl: image,
              type: 'url',
              id: Date.now() + Math.random()
            };
          } else if (image && typeof image === 'object') {
            return {
              ...image,
              url: image.url ? getFullImageUrl(image.url) : image.file ? URL.createObjectURL(image.file) : null,
              type: image.type || 'url',
              id: image.id || Date.now() + Math.random()
            };
          }
          return image;
        });
        setImages(processedImages);
      }
    }
  }, [initialData]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image?.url?.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  const validateImageUrl = (url) => {
    try {
      new URL(url);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
      const hasValidExtension = imageExtensions.some(ext => 
        url.toLowerCase().endsWith(ext)
      );
      return hasValidExtension;
    } catch {
      return false;
    }
  };

  const showError = (message, type = 'upload') => {
    if (type === 'url') {
      setImageUrlError(message);
      setTimeout(() => setImageUrlError(''), 3000);
    } else {
      setUploadError(message);
      setTimeout(() => setUploadError(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    } else if (comment.trim().length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }

    if (title && title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[data-field="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Create FormData for submission
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment.trim());
    
    if (title.trim()) {
      formData.append('title', title.trim());
    }

    // Add uploaded files
    const existingUrls = [];

    images.forEach((image) => {
      if (image.file) {
        formData.append('images', image.file);
      } else if (image.url && !image.file) {
        if (image.originalUrl) {
          existingUrls.push(image.originalUrl);
        } else {
          existingUrls.push(image.url);
        }
      }
    });

    // Add existing image URLs as JSON
    if (existingUrls.length > 0) {
      formData.append('existingImages', JSON.stringify(existingUrls));
    }

    // Add to let backend know if we're in edit mode
    if (isEditMode && initialData?._id) {
      formData.append('reviewId', initialData._id);
    }

    onSubmit(formData);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors({ ...errors, title: '' });
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors({ ...errors, comment: '' });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;
    
    if (totalImages > 4) {
      showError(`Maximum 4 images allowed. You already have ${images.length} images.`);
      return;
    }

    // Validate and process files
    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        showError(`${file.name} is not a valid image type.`);
        return;
      }
      
      if (!isValidSize) {
        showError(`${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const imageObject = {
        url: URL.createObjectURL(file),
        file: file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
        type: 'upload',
        id: Date.now() + Math.random()
      };
      
      setImages(prev => [...prev, imageObject]);
      setUploadError('');
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    const url = imageUrlInput.trim();
    setImageUrlError('');
    
    if (!url) {
      showError('Please enter an image URL', 'url');
      urlInputRef.current?.focus();
      return;
    }

    if (!validateImageUrl(url)) {
      showError('Please enter a valid image URL ending with .jpg, .png, .gif, etc.', 'url');
      urlInputRef.current?.focus();
      return;
    }

    if (images.length >= 4) {
      showError('Maximum 4 images allowed.', 'url');
      return;
    }

    if (images.some(img => img.url === url || img.originalUrl === url)) {
      showError('This URL is already added', 'url');
      return;
    }

    const imageObject = {
      url: url,
      originalUrl: url,
      type: 'url',
      id: Date.now() + Math.random()
    };
    
    setImages(prev => [...prev, imageObject]);
    setImageUrlInput('');
    setImageUrlError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const removeImage = (id) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-pink-400', 'bg-pink-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-pink-400', 'bg-pink-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-pink-400', 'bg-pink-50');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileUpload({ target: { files: dataTransfer.files } });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-lg border border-gray-200 mx-2 md:mx-0">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 md:gap-3">
            {isEditMode && (
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-full">
                <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
            )}
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Your Review' : 'Write a Review'}
            </h3>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
              aria-label="Close"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
            </button>
          )}
        </div>
        {productName && (
          <p className="text-sm md:text-base text-gray-600">
            {isEditMode ? 'Update your review for ' : 'Share your thoughts about '}
            <span className="font-semibold text-gray-900">{productName}</span>
          </p>
        )}
        {initialData?.isEdited && (
          <div className="mt-2 text-xs md:text-sm text-gray-500">
            Last edited: {new Date(initialData.lastEdited).toLocaleDateString()}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6">
        {/* Rating Section */}
        <div className="mb-6" data-field="rating">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate this product? *
          </label>
          
          <div className="flex items-center gap-0.5 md:gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 md:p-1 focus:outline-none hover:scale-110 transition-transform"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 md:ml-4 text-base md:text-lg font-semibold text-gray-900">
              {rating > 0 ? `${rating}.0` : '0.0'} / 5.0
            </span>
          </div>

          <div className="flex justify-between text-xs md:text-sm text-gray-500 px-0.5">
            <span className="text-center">Poor</span>
            <span className="text-center">Average</span>
            <span className="text-center">Good</span>
            <span className="text-center">Very Good</span>
            <span className="text-center">Excellent</span>
          </div>

          {errors.rating && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.rating}
            </div>
          )}
        </div>

        {/* Review Title */}
        <div className="mb-6" data-field="title">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Summarize your experience (optional)"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
            maxLength={100}
            aria-label="Review title"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title && (
              <div className="flex items-center gap-2 text-red-600 text-sm animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.title}
              </div>
            )}
            <div className="text-xs text-gray-500">
              {title.length}/100 characters
            </div>
          </div>
        </div>

        {/* Review Comment */}
        <div className="mb-6" data-field="comment">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Share details of your experience with this product..."
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent min-h-[100px] md:min-h-[120px] resize-y text-sm md:text-base"
            rows={3}
            maxLength={1000}
            aria-label="Review comment"
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-1">
            <div>
              {errors.comment && (
                <div className="flex items-center gap-2 text-red-600 text-sm animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.comment}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 self-end md:self-auto">
              {comment.length}/1000 characters
            </div>
          </div>

          {!isEditMode && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium mb-1">Tips for a great review:</p>
              <ul className="list-disc pl-4 md:pl-5 space-y-0.5 md:space-y-1">
                <li>Describe the quality and freshness</li>
                <li>Mention delivery and packaging</li>
                <li>Share how you used the flowers</li>
                <li>Include photos if possible</li>
              </ul>
            </div>
          )}
        </div>

        {/* Photo Upload Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Add Photos (Optional)
            </label>
            <span className="text-sm text-gray-500">
              {images.length} of 4 images
            </span>
          </div>
          
          {/* Error Messages */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {uploadError}
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 px-3 md:px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'upload' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              aria-label="Upload files tab"
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden xs:inline">Upload Files</span>
                <span className="xs:hidden">Upload</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 px-3 md:px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'url' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              aria-label="Add URL tab"
            >
              <div className="flex items-center justify-center gap-2">
                <Link className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden xs:inline">Add URL</span>
                <span className="xs:hidden">URL</span>
              </div>
            </button>
          </div>

          {/* Upload Tab Content */}
          {activeTab === 'upload' && (
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-colors cursor-pointer mb-4"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                aria-label="Click or drag and drop to upload images"
              >
                <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                <p className="text-gray-700 font-medium mb-1.5 md:mb-2 text-sm md:text-base">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  PNG, JPG, WebP, GIF up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload image files"
                />
              </div>
            </div>
          )}

          {/* URL Tab Content */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    ref={urlInputRef}
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      setImageUrlError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
                    aria-label="Image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!imageUrlInput.trim() || images.length >= 4}
                  className="bg-gray-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
                  aria-label="Add image URL"
                >
                  Add URL
                </button>
              </div>
              
              {imageUrlError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {imageUrlError}
                </div>
              )}
              
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Enter direct image URLs ending with .jpg, .png, .gif, etc.</span>
              </div>
            </div>
          )}

          {/* Image Thumbnails */}
          {images.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt="Review"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                <div class="text-center p-2">
                                  <svg class="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p class="text-xs text-gray-500">Image not available</p>
                                </div>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Remove image ${image.name || ''}`}
                    >
                      <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    </button>
                    {(image.type === 'upload' || image.name) && (
                      <div className="mt-1 text-xs text-gray-500 truncate px-1">
                        {image.name ? image.name.substring(0, 20) + (image.name.length > 20 ? '...' : '') : 'Uploaded Image'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Clear All Button */}
              {images.length > 1 && (
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 ml-auto transition-colors"
                    aria-label="Clear all images"
                  >
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Clear All Images
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Verification Notice */}
        <div className="mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2 md:gap-3">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Verified Purchase</p>
              <p className="text-xs md:text-sm text-green-700">
                Your review will be marked as "Verified Purchase" since you bought this product.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            aria-label={isEditMode ? 'Update review' : 'Submit review'}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditMode ? 'Updating...' : 'Submitting...'}
              </div>
            ) : (
              isEditMode ? 'Update Review' : 'Submit Review'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 md:px-8 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
              aria-label="Cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (max-width: 480px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewForm;