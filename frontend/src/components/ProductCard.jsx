import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye,
  TrendingUp,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ 
  product, 
  viewMode = 'grid',
  onAddToCart,
  onAddToWishlist,
  showQuickView = true,
  showBadges = true,
  showActions = true
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    _id,
    name,
    price,
    discountPrice,
    ratings,
    numOfReviews,
    images,
    occasion = [],
    tags = [],
    isAvailable = true,
    stock = 0,
    isFeatured = false,
    isNew = false,
    category,
    description
  } = product;

  // Calculate discount percentage
  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Check if product is low stock
  const isLowStock = stock > 0 && stock <= 5;
  
  // Check if product is out of stock
  const isOutOfStock = !isAvailable || stock === 0;

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      // Remove from wishlist
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      wishlist = wishlist.filter(id => id !== _id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      // Add to wishlist
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      wishlist.push(_id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast.success('Added to wishlist!');
    }

    // Notify parent component
    if (onAddToWishlist) {
      onAddToWishlist(_id);
    }

    // Dispatch event for other components
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    if (onAddToCart) {
      onAddToCart(_id);
    } else {
      // Default cart functionality
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.productId === _id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId: _id,
          quantity: 1,
          addedAt: Date.now(),
          price: discountPrice || price
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('Added to cart!');
      
      // Notify other components
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // Handle quick view
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would open a modal or redirect
    toast.success('Quick view feature coming soon!');
  };

  // Get primary image URL
  const primaryImage = images?.[0]?.url || '';
  
  // Get product color based on category or tags
  const getCategoryColor = () => {
    const categoryColors = {
      'roses': 'bg-red-100 text-red-600',
      'lilies': 'bg-pink-100 text-pink-600',
      'tulips': 'bg-yellow-100 text-yellow-600',
      'orchids': 'bg-purple-100 text-purple-600',
      'sunflowers': 'bg-orange-100 text-orange-600',
      'seasonal': 'bg-green-100 text-green-600',
      'bouquets': 'bg-blue-100 text-blue-600',
      'mixed': 'bg-indigo-100 text-indigo-600'
    };
    
    return categoryColors[category?.toLowerCase()] || 'bg-gray-100 text-gray-600';
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/product/${_id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="flex gap-6 p-6">
            {/* Product Image */}
            <div className="relative w-64 h-64 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    💐
                  </div>
                )}
              </div>

              {/* Badges */}
              {showBadges && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      -{discountPercentage}%
                    </span>
                  )}
                  {isFeatured && (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Featured
                    </span>
                  )}
                  {isNew && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <Zap className="w-3 h-3 inline mr-1" />
                      New
                    </span>
                  )}
                  {isLowStock && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Low Stock
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              {showActions && (
                <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full shadow-lg transition-all ${
                      isWishlisted 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-pink-500 hover:text-white'
                    }`}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  
                  {showQuickView && (
                    <button
                      onClick={handleQuickView}
                      className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
                      title="Quick view"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor()}`}>
                      {category || 'Flowers'}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{ratings || 0}</span>
                      <span className="ml-1 text-gray-500">({numOfReviews || 0})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                    {name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {description || 'Beautifully arranged flowers perfect for any occasion.'}
                  </p>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${discountPrice || price}
                    {discountPrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ${price}
                      </span>
                    )}
                  </div>
                  
                  {discountPrice && (
                    <div className="text-sm text-green-600 font-medium mb-4">
                      Save ${(price - discountPrice).toFixed(2)}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {stock > 0 ? (
                      <span className="text-green-600 font-medium">
                        <Check className="w-4 h-4 inline mr-1" />
                        In Stock ({stock} available)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Occasion Tags */}
              {occasion.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Perfect For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {occasion.slice(0, 3).map((occ, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium"
                      >
                        {occ}
                      </span>
                    ))}
                    {occasion.length > 3 && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
                        +{occasion.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-pink-500 hover:bg-pink-600 text-white'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <Link
                  to={`/product/${_id}`}
                  className="px-8 py-4 border-2 border-pink-500 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View Layout (Default)
  return (
    <Link 
      to={`/product/${_id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square">
          <div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">
                💐
              </div>
            )}
          </div>

          {/* Badges */}
          {showBadges && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  -{discountPercentage}%
                </span>
              )}
              {isFeatured && (
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Featured
                </span>
              )}
              {isNew && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  <Zap className="w-3 h-3 inline mr-1" />
                  New
                </span>
              )}
              {isLowStock && (
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Low Stock
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Out of Stock
                </span>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {showActions && (
            <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-full shadow-lg transition-all ${
                  isWishlisted 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-pink-500 hover:text-white'
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="p-3 bg-white rounded-full shadow-lg text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
                  title="Quick view"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Add to Cart Button (Hover) */}
          {showActions && (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } ${
                isOutOfStock 
                  ? 'bg-gray-500 text-white cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600 text-white'
              } px-8 py-3 rounded-full font-semibold shadow-lg`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category and Rating */}
          <div className="flex justify-between items-center mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
              {category || 'Flowers'}
            </span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-semibold">{ratings || 0}</span>
              <span className="ml-1 text-xs text-gray-500">({numOfReviews || 0})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {name}
          </h3>

          {/* Occasion Tags */}
          {occasion.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {occasion.slice(0, 2).map((occ, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-pink-50 text-pink-600 rounded text-xs"
                  >
                    {occ}
                  </span>
                ))}
                {occasion.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{occasion.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price and Stock */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ${discountPrice || price}
                </span>
                {discountPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${price}
                  </span>
                )}
              </div>
              
              {isLowStock && !isOutOfStock && (
                <span className="text-xs text-amber-600 font-medium">
                  Only {stock} left
                </span>
              )}
            </div>

            {/* Stock Status */}
            {isOutOfStock ? (
              <div className="text-sm text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Out of Stock
              </div>
            ) : (
              <div className="text-sm text-green-600 font-medium">
                <Check className="w-4 h-4 inline mr-1" />
                In Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Default props
ProductCard.defaultProps = {
  viewMode: 'grid',
  showQuickView: true,
  showBadges: true,
  showActions: true
};

export default ProductCard;