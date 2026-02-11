
// import React, { useState, useCallback, useEffect } from 'react';
// import { 
//   Star, ThumbsUp, Flag, CheckCircle, Edit2, Trash2, MoreVertical,
//   Image as ImageIcon, AlertCircle
// } from 'lucide-react';

// const ReviewList = ({ 
//   reviews = [], 
//   onHelpfulClick, 
//   onReportClick,
//   onEditClick,
//   onDeleteClick,
//   currentUserId,
//   isLoading = false
// }) => {
//   const [helpfulReviews, setHelpfulReviews] = useState({});
//   const [reportedReviews, setReportedReviews] = useState({});
//   const [showMenu, setShowMenu] = useState(null);
//   const [expandedReviews, setExpandedReviews] = useState({});
//   const [imageErrors, setImageErrors] = useState({});

//   // Your backend base URL
//   const BACKEND_URL = 'http://localhost:5000';
  
//   // Function to get full image URL
//   const getFullImageUrl = useCallback((imagePath) => {
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
//     if (imagePath.includes('.png') || imagePath.includes('.jpg') || imagePath.includes('.jpeg')) {
//       return `${BACKEND_URL}/uploads/reviews/${imagePath}`;
//     }
    
//     return imagePath;
//   }, [BACKEND_URL]);

//   const handleHelpfulClick = useCallback((reviewId) => {
//     setHelpfulReviews(prev => ({
//       ...prev,
//       [reviewId]: !prev[reviewId]
//     }));
//     if (onHelpfulClick) {
//       onHelpfulClick(reviewId);
//     }
//   }, [onHelpfulClick]);

//   const handleReportClick = useCallback((reviewId) => {
//     setReportedReviews(prev => ({
//       ...prev,
//       [reviewId]: !prev[reviewId]
//     }));
//     if (onReportClick) {
//       onReportClick(reviewId);
//     }
//   }, [onReportClick]);

//   const handleEditClick = useCallback((review) => {
//     setShowMenu(null);
//     if (onEditClick) {
//       onEditClick(review);
//     }
//   }, [onEditClick]);

//   const handleDeleteClick = useCallback((reviewId) => {
//     setShowMenu(null);
//     if (onDeleteClick) {
//       onDeleteClick(reviewId);
//     }
//   }, [onDeleteClick]);

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return 'Recently';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Recently';
      
//       const now = new Date();
//       const diffTime = Math.abs(now - date);
//       const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//       if (diffDays === 0) {
//         const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//         if (diffHours < 1) {
//           const diffMinutes = Math.floor(diffTime / (1000 * 60));
//           return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
//         }
//         return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
//       } else if (diffDays === 1) {
//         return 'Yesterday';
//       } else if (diffDays < 7) {
//         return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
//       } else if (diffDays < 30) {
//         const weeks = Math.floor(diffDays / 7);
//         return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
//       } else if (diffDays < 365) {
//         const months = Math.floor(diffDays / 30);
//         return `${months} month${months !== 1 ? 's' : ''} ago`;
//       } else {
//         const years = Math.floor(diffDays / 365);
//         return `${years} year${years !== 1 ? 's' : ''} ago`;
//       }
//     } catch {
//       return 'Recently';
//     }
//   }, []);

//   const toggleReviewExpansion = useCallback((reviewId) => {
//     setExpandedReviews(prev => ({
//       ...prev,
//       [reviewId]: !prev[reviewId]
//     }));
//   }, []);

//   const handleImageError = useCallback((reviewId, imageIndex) => {
//     setImageErrors(prev => ({
//       ...prev,
//       [`${reviewId}-${imageIndex}`]: true
//     }));
//   }, []);

//   const shouldTruncateText = (text, maxLength = 300) => {
//     return text && text.length > maxLength;
//   };

//   const getInitials = (name) => {
//     if (!name) return 'U';
//     const nameParts = name.trim().split(' ');
//     if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
//     return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         {[1, 2, 3].map((skeleton) => (
//           <div key={skeleton} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
//                   <div className="flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-32"></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="flex items-center gap-1 mb-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <div key={star} className="w-5 h-5 bg-gray-200 rounded"></div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//             <div className="h-3 bg-gray-200 rounded w-24"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (!reviews || reviews.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-6xl mb-4">📝</div>
//         <h3 className="text-xl font-bold text-gray-900 mb-2">
//           No reviews yet
//         </h3>
//         <p className="text-gray-600">Be the first to share your thoughts!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {reviews.map((review) => {
//         const reviewId = review._id || review.id;
//         const images = Array.isArray(review.images) ? review.images : [];
        
//         return (
//           <div 
//             key={reviewId} 
//             className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
//           >
//             {/* Review Header */}
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-lg font-semibold text-pink-600">
//                     {getInitials(review.user?.name)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h4 className="font-bold text-gray-900">
//                           {review.user?.name || 'Anonymous'}
//                         </h4>
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                           <span>{formatDate(review.createdAt || review.date)}</span>
//                           {review.isEdited && (
//                             <>
//                               <span className="text-gray-300">•</span>
//                               <span className="text-gray-400">(Edited)</span>
//                             </>
//                           )}
//                           {review.isVerifiedPurchase && (
//                             <>
//                               <span className="text-gray-300">•</span>
//                               <span className="flex items-center gap-1 text-green-600">
//                                 <CheckCircle className="w-4 h-4" />
//                                 Verified Purchase
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       </div>
                      
//                       {/* Edit/Delete Menu */}
//                       {currentUserId && review.user?._id === currentUserId && (
//                         <div className="relative">
//                           <button
//                             onClick={() => setShowMenu(showMenu === reviewId ? null : reviewId)}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             aria-label="Review options"
//                           >
//                             <MoreVertical className="w-5 h-5 text-gray-500" />
//                           </button>
                          
//                           {showMenu === reviewId && (
//                             <>
//                               <div 
//                                 className="fixed inset-0 z-40"
//                                 onClick={() => setShowMenu(null)}
//                               />
//                               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
//                                 <button
//                                   onClick={() => handleEditClick(review)}
//                                   className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
//                                 >
//                                   <Edit2 className="w-4 h-4 text-gray-600" />
//                                   Edit Review
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
//                                       handleDeleteClick(reviewId);
//                                     }
//                                   }}
//                                   className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 transition-colors"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                   Delete Review
//                                 </button>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="text-right">
//                 <div className="flex items-center gap-1 mb-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`w-5 h-5 ${
//                         star <= (review.rating || 0)
//                           ? 'text-yellow-400 fill-current'
//                           : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <div className="text-lg font-bold text-gray-900">
//                   {(review.rating || 0).toFixed(1)}
//                 </div>
//               </div>
//             </div>

//             {/* Review Title */}
//             {review.title && (
//               <h5 className="font-semibold text-gray-900 mb-3 text-lg">
//                 {review.title}
//               </h5>
//             )}

//             {/* Review Comment */}
//             <div className="mb-4">
//               <p className="text-gray-700 leading-relaxed">
//                 {expandedReviews[reviewId] || !shouldTruncateText(review.comment) 
//                   ? review.comment 
//                   : `${review.comment?.substring(0, 300)}...`
//                 }
//               </p>
//               {shouldTruncateText(review.comment) && (
//                 <button
//                   onClick={() => toggleReviewExpansion(reviewId)}
//                   className="text-pink-600 hover:text-pink-700 text-sm font-medium mt-2"
//                 >
//                   {expandedReviews[reviewId] ? 'Show less' : 'Read more'}
//                 </button>
//               )}
//             </div>

//             {/* Review Images */}
//             {images.length > 0 && (
//               <div className="mb-4">
//                 <div className="flex items-center gap-2 mb-3">
//                   <ImageIcon className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-600">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
//                 </div>
//                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
//                   {images.map((image, idx) => {
//                     const imageKey = `${reviewId}-${idx}`;
//                     const hasError = imageErrors[imageKey];
//                     const imageUrl = getFullImageUrl(image.url);
                    
//                     return (
//                       <div
//                         key={imageKey}
//                         className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
//                       >
//                         {imageUrl && !hasError ? (
//                           <img
//                             src={imageUrl}
//                             alt={`Review image ${idx + 1}`}
//                             className="w-full h-full object-cover"
//                             loading="lazy"
//                             onError={() => handleImageError(reviewId, idx)}
//                           />
//                         ) : (
//                           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-2">
//                             <AlertCircle className="w-6 h-6 mb-1" />
//                             <span className="text-xs">Failed to load</span>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Review Meta */}
//             <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//               <div className="flex items-center gap-4 text-sm text-gray-500">
//                 <button
//                   onClick={() => handleHelpfulClick(reviewId)}
//                   className={`flex items-center gap-2 hover:text-pink-600 transition-colors ${
//                     helpfulReviews[reviewId] ? 'text-pink-600' : ''
//                   }`}
//                   aria-label={`Mark review as helpful (${review.helpfulCount || 0} helpful votes)`}
//                 >
//                   <ThumbsUp className="w-4 h-4" />
//                   Helpful ({review.helpfulCount || 0})
//                 </button>
                
//                 <button
//                   onClick={() => handleReportClick(reviewId)}
//                   className={`flex items-center gap-2 hover:text-red-600 transition-colors ${
//                     reportedReviews[reviewId] ? 'text-red-600' : ''
//                   }`}
//                   aria-label="Report this review"
//                 >
//                   <Flag className="w-4 h-4" />
//                   Report
//                 </button>
//               </div>
              
//               <div className="text-sm text-gray-500">
//                 {review.response && (
//                   <button className="text-blue-600 hover:text-blue-800 transition-colors">
//                     View merchant response
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       <style>{`
//         .scrollbar-thin::-webkit-scrollbar {
//           height: 6px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ReviewList;


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Star, ThumbsUp, Flag, CheckCircle, Edit2, Trash2, MoreVertical,
  Image as ImageIcon, AlertCircle, X
} from 'lucide-react';

const ReviewList = ({ 
  reviews = [], 
  onHelpfulClick, 
  onReportClick,
  onEditClick,
  onDeleteClick,
  currentUserId,
  isLoading = false
}) => {
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [reportedReviews, setReportedReviews] = useState({});
  const [showMenu, setShowMenu] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const menuRefs = useRef({});

  // Your backend base URL
  const BACKEND_URL = 'http://localhost:5000';
  
  // Function to get full image URL
  const getFullImageUrl = useCallback((imagePath) => {
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
  }, [BACKEND_URL]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(menuRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setShowMenu(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close delete confirmation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const deleteModal = document.getElementById(`delete-modal-${showDeleteConfirm}`);
      if (deleteModal && !deleteModal.contains(event.target)) {
        setShowDeleteConfirm(null);
      }
    };

    if (showDeleteConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDeleteConfirm]);

  const handleHelpfulClick = useCallback((reviewId) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
    if (onHelpfulClick) {
      onHelpfulClick(reviewId);
    }
  }, [onHelpfulClick]);

  const handleReportClick = useCallback((reviewId) => {
    setReportedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
    if (onReportClick) {
      onReportClick(reviewId);
    }
  }, [onReportClick]);

  const handleEditClick = useCallback((review) => {
    setShowMenu(null);
    if (onEditClick) {
      onEditClick(review);
    }
  }, [onEditClick]);

  const handleDeleteConfirm = useCallback((reviewId) => {
    setShowDeleteConfirm(reviewId);
    setShowMenu(null);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  const handleDeleteConfirmSubmit = useCallback((reviewId) => {
    setShowDeleteConfirm(null);
    if (onDeleteClick) {
      onDeleteClick(reviewId);
    }
  }, [onDeleteClick]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours < 1) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months !== 1 ? 's' : ''} ago`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years !== 1 ? 's' : ''} ago`;
      }
    } catch {
      return 'Recently';
    }
  }, []);

  const toggleReviewExpansion = useCallback((reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  }, []);

  const handleImageError = useCallback((reviewId, imageIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [`${reviewId}-${imageIndex}`]: true
    }));
  }, []);

  const shouldTruncateText = (text, maxLength = 300) => {
    return text && text.length > maxLength;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        {[1, 2, 3].map((skeleton) => (
          <div key={skeleton} className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 animate-pulse">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 md:h-4 bg-gray-200 rounded w-20 md:w-24 mb-1.5 md:mb-2"></div>
                    <div className="h-2.5 md:h-3 bg-gray-200 rounded w-24 md:w-32"></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-3 h-3 md:w-5 md:h-5 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-4 md:h-6 w-8 md:w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-3 md:h-4 bg-gray-200 rounded w-full mb-1.5 md:mb-2"></div>
            <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 mb-3 md:mb-4"></div>
            <div className="h-2.5 md:h-3 bg-gray-200 rounded w-16 md:w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="text-4xl md:text-6xl mb-3 md:mb-4">📝</div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">
          No reviews yet
        </h3>
        <p className="text-sm md:text-base text-gray-600">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {reviews.map((review) => {
        const reviewId = review._id || review.id;
        const images = Array.isArray(review.images) ? review.images : [];
        
        return (
          <div 
            key={reviewId} 
            className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            {/* Review Header */}
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-base md:text-lg font-semibold text-pink-600 flex-shrink-0">
                    {getInitials(review.user?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start md:items-center">
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">
                          {review.user?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 flex-wrap">
                          <span>{formatDate(review.createdAt || review.date)}</span>
                          {review.isEdited && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-400">(Edited)</span>
                            </>
                          )}
                          {review.isVerifiedPurchase && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="hidden xs:inline">Verified Purchase</span>
                                <span className="xs:hidden">Verified</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Edit/Delete Menu */}
                      {currentUserId && review.user?._id === currentUserId && (
                        <div className="relative" ref={el => menuRefs.current[reviewId] = el}>
                          <button
                            onClick={() => setShowMenu(showMenu === reviewId ? null : reviewId)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            aria-label="Review options"
                          >
                            <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                          </button>
                          
                          {showMenu === reviewId && (
                            <div className="absolute right-0 mt-1 md:mt-2 w-36 md:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                              <button
                                onClick={() => handleEditClick(review)}
                                className="w-full px-3 md:px-4 py-2 md:py-3 text-left hover:bg-gray-50 flex items-center gap-2 md:gap-3 transition-colors text-sm md:text-base"
                              >
                                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 flex-shrink-0" />
                                <span>Edit Review</span>
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(reviewId)}
                                className="w-full px-3 md:px-4 py-2 md:py-3 text-left hover:bg-gray-50 flex items-center gap-2 md:gap-3 text-red-600 transition-colors text-sm md:text-base"
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                <span>Delete Review</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-2 md:ml-0">
                <div className="flex items-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 md:w-5 md:h-5 ${
                        star <= (review.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-base md:text-lg font-bold text-gray-900">
                  {(review.rating || 0).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Review Title */}
            {review.title && (
              <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-base md:text-lg">
                {review.title}
              </h5>
            )}

            {/* Review Comment */}
            <div className="mb-3 md:mb-4">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {expandedReviews[reviewId] || !shouldTruncateText(review.comment) 
                  ? review.comment 
                  : `${review.comment?.substring(0, 300)}...`
                }
              </p>
              {shouldTruncateText(review.comment) && (
                <button
                  onClick={() => toggleReviewExpansion(reviewId)}
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium mt-1 md:mt-2 transition-colors"
                >
                  {expandedReviews[reviewId] ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Review Images */}
            {images.length > 0 && (
              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                  <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-gray-600">
                    {images.length} photo{images.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1.5 md:pb-2 scrollbar-thin">
                  {images.map((image, idx) => {
                    const imageKey = `${reviewId}-${idx}`;
                    const hasError = imageErrors[imageKey];
                    const imageUrl = getFullImageUrl(image.url);
                    
                    return (
                      <div
                        key={imageKey}
                        className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-gray-200"
                      >
                        {imageUrl && !hasError ? (
                          <img
                            src={imageUrl}
                            alt={`Review image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={() => handleImageError(reviewId, idx)}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-1.5 md:p-2">
                            <AlertCircle className="w-4 h-4 md:w-6 md:h-6 mb-0.5 md:mb-1 flex-shrink-0" />
                            <span className="text-xs">Failed to load</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Review Meta */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center pt-3 md:pt-4 border-t border-gray-100 gap-2 xs:gap-0">
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                <button
                  onClick={() => handleHelpfulClick(reviewId)}
                  className={`flex items-center gap-1.5 md:gap-2 hover:text-pink-600 transition-colors ${
                    helpfulReviews[reviewId] ? 'text-pink-600' : ''
                  }`}
                  aria-label={`Mark review as helpful (${review.helpfulCount || 0} helpful votes)`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span>Helpful ({review.helpfulCount || 0})</span>
                </button>
                
                <button
                  onClick={() => handleReportClick(reviewId)}
                  className={`flex items-center gap-1.5 md:gap-2 hover:text-red-600 transition-colors ${
                    reportedReviews[reviewId] ? 'text-red-600' : ''
                  }`}
                  aria-label="Report this review"
                >
                  <Flag className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span>Report</span>
                </button>
              </div>
              
              {review.response && (
                <div className="text-xs md:text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    View merchant response
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            id={`delete-modal-${showDeleteConfirm}`}
            className="bg-white rounded-xl max-w-md w-full p-4 md:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Delete Review</h3>
              <button
                onClick={handleDeleteCancel}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmSubmit(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReviewList;