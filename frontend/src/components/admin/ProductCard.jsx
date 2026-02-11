// // components/admin/ProductCard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product, isSelected, onSelect, onEdit, onDelete }) => {
//   return (
//     <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${isSelected ? 'border-primary-500' : 'border-transparent'}`}>
//       {/* Selection checkbox */}
//       <div className="absolute top-2 left-2 z-10">
//         <input
//           type="checkbox"
//           checked={isSelected}
//           onChange={onSelect}
//           className="h-5 w-5 text-primary-600 border-gray-300 rounded"
//         />
//       </div>

//       {/* Product image */}
//       <div className="relative h-48 overflow-hidden">
//         {product.images && product.images[0] ? (
//           <img
//             src={product.images[0].url}
//             alt={product.name}
//             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//           </div>
//         )}
        
//         {/* Badges */}
//         <div className="absolute top-2 right-2 flex flex-col gap-1">
//           {product.isFeatured && (
//             <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
//               Featured
//             </span>
//           )}
//           {!product.isAvailable && (
//             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//               Unavailable
//             </span>
//           )}
//           {product.stock === 0 && (
//             <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//               Out of Stock
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Product info */}
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold text-gray-900 truncate">
//             {product.name}
//           </h3>
//           <div className="flex items-center gap-1">
//             <span className="text-lg font-bold text-gray-900">
//               ${product.price.toFixed(2)}
//             </span>
//             {product.discountPrice && (
//               <span className="text-sm text-gray-500 line-through">
//                 ${product.discountPrice.toFixed(2)}
//               </span>
//             )}
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//           {product.description}
//         </p>

//         {/* Tags and categories */}
//         <div className="flex flex-wrap gap-1 mb-3">
//           <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
//             {product.category}
//           </span>
//           {product.occasion?.slice(0, 2).map((occ, idx) => (
//             <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//               {occ}
//             </span>
//           ))}
//           {product.occasion?.length > 2 && (
//             <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
//               +{product.occasion.length - 2} more
//             </span>
//           )}
//         </div>

//         {/* Stock and rating */}
//         <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
//           <div>
//             Stock: <span className="font-medium">{product.stock}</span>
//           </div>
//           <div className="flex items-center">
//             <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//             <span className="ml-1">{product.ratings?.toFixed(1) || '0.0'}</span>
//             <span className="text-gray-400 mx-1">•</span>
//             <span>{product.numOfReviews || 0} reviews</span>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2">
//           <button
//             onClick={onEdit}
//             className="flex-1 btn-secondary text-sm py-2"
//           >
//             Edit
//           </button>
//           <button
//             onClick={onDelete}
//             className="flex-1 btn-danger text-sm py-2"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

// components/admin/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  TagIcon,
  CheckBadgeIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

const ProductCard = ({ product, isSelected, onSelect, onEdit, onDelete, onView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200', icon: ExclamationCircleIcon };
    if (stock < 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: ExclamationCircleIcon };
    return { text: `In Stock (${stock})`, color: 'bg-green-100 text-green-800 border-green-200', icon: CheckBadgeIcon };
  };

  const stockStatus = getStockStatus(product.stock);

  const toggleDescription = (e) => {
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-primary-500 ring-2 ring-primary-100' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection checkbox - Show on hover and when selected */}
      <div className={`absolute top-3 left-3 z-10 transition-opacity duration-200 ${
        isSelected || isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
          aria-label={`Select ${product.name}`}
        />
      </div>

      {/* Product image with overlay actions */}
      <div className="relative h-48 sm:h-56 md:h-48 lg:h-52 overflow-hidden group">
        {product.images && product.images[0] ? (
          <>
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Image overlay on hover */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-200 flex items-center justify-center ${
              isHovered ? 'opacity-40' : 'opacity-0'
            }`}>
              <div className="flex space-x-3">
                {onView && (
                  <button
                    onClick={onView}
                    className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-transform hover:scale-110"
                    title="Quick View"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                <button
                  onClick={onEdit}
                  className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-transform hover:scale-110"
                  title="Edit Product"
                >
                  <PencilIcon className="w-5 h-5 text-primary-600" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges - Top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
              <StarIconSolid className="w-3 h-3" />
              Featured
            </span>
          )}
          {product.discountPrice && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </span>
          )}
        </div>
        
        {/* Stock badge - Bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color} shadow-sm`}>
            <stockStatus.icon className="w-3 h-3" />
            {stockStatus.text}
          </span>
        </div>
        
        {/* Image count badge */}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {product.images.length} photos
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        {/* Product name and price */}
        <div className="flex justify-between items-start mb-3">
          <Link 
            to={`/admin/products/${product._id}`}
            className="group flex-1 min-w-0"
          >
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end ml-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Description with expand/collapse */}
        <div className="mb-3">
          <p className={`text-sm text-gray-600 ${showFullDescription ? '' : 'line-clamp-2'}`}>
            {product.description || 'No description available'}
          </p>
          {product.description && product.description.length > 100 && (
            <button
              onClick={toggleDescription}
              className="mt-1 text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Categories and tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg">
            <TagIcon className="w-3 h-3" />
            {product.category}
          </span>
          {product.occasion?.slice(0, 2).map((occ, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg">
              <HeartIcon className="w-3 h-3" />
              {occ}
            </span>
          ))}
          {product.occasion?.length > 2 && (
            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-lg">
              +{product.occasion.length - 2} more
            </span>
          )}
        </div>

        {/* Rating and metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIconSolid
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(product.ratings || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1.5 font-medium text-gray-900">
                {product.ratings?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="ml-1.5">{product.numOfReviews || 0} reviews</span>
          </div>
          {product.sold && (
            <div className="hidden sm:flex items-center text-gray-500">
              <ArchiveBoxIcon className="w-4 h-4 mr-1" />
              {product.sold} sold
            </div>
          )}
        </div>

        {/* Action buttons - Mobile optimized */}
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <EyeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        {/* Quick stats - Mobile only */}
        <div className="sm:hidden flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center">
            <ArchiveBoxIcon className="w-3.5 h-3.5 mr-1" />
            {product.stock} in stock
          </div>
          {product.sold && (
            <div className="flex items-center">
              <CheckBadgeIcon className="w-3.5 h-3.5 mr-1" />
              {product.sold} sold
            </div>
          )}
          <div className="flex items-center">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
            {product.numOfReviews || 0}
          </div>
        </div>
      </div>

      {/* Favorite button - Top right corner */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Handle favorite toggle
        }}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
          product.isFeatured ? 'bg-white/90' : 'bg-white/70 hover:bg-white/90'
        } ${isHovered || product.isFeatured ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}
        aria-label={product.isFeatured ? "Remove from favorites" : "Add to favorites"}
      >
        {product.isFeatured ? (
          <HeartIconSolid className="w-5 h-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );
};

// Optional: Add a skeleton loader for loading states
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 sm:h-56 md:h-48 lg:h-52 bg-gray-300"></div>
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-gray-300 rounded w-2/3"></div>
        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="h-3 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-6 bg-gray-300 rounded w-16"></div>
        <div className="h-6 bg-gray-300 rounded w-12"></div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-300 rounded"></div>
        <div className="flex-1 h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

export default ProductCard;