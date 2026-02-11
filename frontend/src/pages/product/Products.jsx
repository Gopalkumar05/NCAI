

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, Star, X, AlertCircle, CheckCircle, ShoppingCart } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService'; // Add cart service import
import LoadingSpinner from '../../components/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    occasion: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    keyword: ''
  });
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [addingToCart, setAddingToCart] = useState({}); // Track loading state per product
  const location = useLocation();
  const navigate = useNavigate();

  // Show toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    // Extract query params from URL
    const params = new URLSearchParams(location.search);
    const initialFilters = {
      category: params.get('category') || '',
      occasion: params.get('occasion') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      sortBy: params.get('sortBy') || 'createdAt',
      sortOrder: params.get('sortOrder') || 'desc',
      keyword: params.get('keyword') || ''
    };
    setFilters(initialFilters);
    
    fetchProducts(initialFilters);
    fetchCategories();
    fetchOccasions();
  }, [location.search]);

  const fetchProducts = async (filterParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key]) {
          params[key] = filterParams[key];
        }
      });
      
      const response = await productService.getProducts(params);
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchOccasions = async () => {
    try {
      const occasionsList = [
        'Birthday', 'Anniversary', 'Valentine\'s Day', 'Mother\'s Day',
        'Wedding', 'Graduation', 'Get Well', 'Sympathy', 'Congratulations',
        'Christmas', 'New Year', 'Corporate'
      ];
      setOccasions(occasionsList);
    } catch (err) {
      console.error('Error fetching occasions:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(filterKey => {
      if (newFilters[filterKey]) {
        params.set(filterKey, newFilters[filterKey]);
      }
    });
    
    navigate({ search: params.toString() });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (filters.keyword.trim()) {
      handleFilterChange('keyword', filters.keyword.trim());
      showToast(`Searching for: ${filters.keyword.trim()}`, 'info');
    }
  };

  const handlePriceApply = () => {
    handleFilterChange('minPrice', filters.minPrice);
    handleFilterChange('maxPrice', filters.maxPrice);
    showToast('Price filter applied', 'success');
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      occasion: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      keyword: ''
    });
    navigate('/products');
    showToast('Filters cleared', 'success');
  };

  // Add to cart function
  const handleAddToCart = async (productId, productName) => {
    try {
      // Set loading state for this specific product
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      
      const cartData = {
        productId: productId,
        quantity: 1
      };
      
      const response = await orderService.addToCart(cartData);
      
      showToast(`${productName} added to cart successfully!`, 'success');
      
      // Optionally, you could update local state or trigger a cart refresh
      // You might want to have a global cart context or state management
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast(error.response?.data?.message || 'Failed to add item to cart', 'error');
    } finally {
      // Clear loading state
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Quick view function (optional enhancement)
  const handleQuickView = (product) => {
    showToast(`Viewing details for ${product.name}`, 'info');
    // You could navigate to product detail page or show a modal
    // navigate(`/product/${product._id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchProducts(filters)}
            className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn ${toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 sm:py-4">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Our Flower Collection</h1>
              <p className="text-sm sm:text-base lg:text-lg opacity-90">Find the perfect blooms for every occasion</p>
            </div>
            {/* Cart Icon - Optional */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
              title="View Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {/* You could add cart item count badge here if you have cart state */}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search flowers..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-pink-600 font-semibold text-sm sm:text-base transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Filters Sidebar - Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters Sidebar */}
          {(showFilters || window.innerWidth >= 1024) && (
            <div className="lg:w-64 xl:w-72 mb-6 lg:mb-0">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Occasion Filter */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occasion
                  </label>
                  <select
                    value={filters.occasion}
                    onChange={(e) => handleFilterChange('occasion', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Occasions</option>
                    {occasions.map((occasion) => (
                      <option key={occasion} value={occasion}>
                        {occasion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <span className="text-gray-500">to</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    
                    {/* Price Indicators */}
                    <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                      <span>Min: ${filters.minPrice || '0'}</span>
                      <span>Max: ${filters.maxPrice || '∞'}</span>
                    </div>
                    
                    <button
                      onClick={handlePriceApply}
                      className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm font-medium transition-colors"
                    >
                      Apply Price Filter
                    </button>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="createdAt">Newest</option>
                    <option value="price">Price</option>
                    <option value="ratings">Rating</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2.5 border-2 border-pink-500 text-pink-600 rounded-lg hover:bg-pink-50 font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* View Mode and Product Count */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {products.length} Product{products.length !== 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {products.length} of {products.length} results
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 font-medium hidden xs:inline">View:</span>
                    <div className="flex border rounded-lg p-0.5">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 sm:p-2 rounded ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Grid View"
                      >
                        <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 sm:p-2 rounded ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="List View"
                      >
                        <List className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl shadow-sm">
                <div className="text-6xl mb-4">🌸</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <>
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'space-y-4 sm:space-y-6'} gap-4 sm:gap-6`}>
                  {products.map((product) => (
                    viewMode === 'grid' ? (
                      <ProductCard 
                        key={product._id} 
                        product={product}
                        onAddToCart={() => handleAddToCart(product._id, product.name)}
                        isLoading={addingToCart[product._id]}
                      />
                    ) : (
                      <ProductCardList 
                        key={product._id} 
                        product={product}
                        onAddToCart={() => handleAddToCart(product._id, product.name)}
                        isLoading={addingToCart[product._id]}
                        onQuickView={() => handleQuickView(product)}
                      />
                    )
                  ))}
                </div>

                {/* Pagination - Show only if many products */}
                {products.length > 12 && (
                  <div className="mt-8 sm:mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button className="px-3 sm:px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm sm:text-base transition-colors">
                        Previous
                      </button>
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base transition-colors ${num === 1 ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {num}
                        </button>
                      ))}
                      <button className="px-3 sm:px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm sm:text-base transition-colors">
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        @media (max-width: 640px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

// Updated ProductCardList component with cart functionality
const ProductCardList = ({ product, onAddToCart, isLoading, onQuickView }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-shadow p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <div className="w-full sm:w-40 md:w-48 h-40 sm:h-48 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer" onClick={onQuickView}>
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">💐</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 truncate cursor-pointer hover:text-pink-600 transition-colors"
              onClick={onQuickView}
            >
              {product.name}
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">{product.description}</p>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold text-sm sm:text-base">{product.ratings || '0.0'}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm sm:text-base">{product.numOfReviews || 0} reviews</span>
              <span className="text-gray-400">•</span>
              <span className={`text-sm sm:text-base font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {product.occasion?.slice(0, 3).map((occ) => (
                <span
                  key={occ}
                  className="px-2.5 sm:px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm"
                >
                  {occ}
                </span>
              ))}
              {product.occasion?.length > 3 && (
                <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm">
                  +{product.occasion.length - 3} more
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              ${product.discountPrice || product.price}
              {product.discountPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <div className="text-xs sm:text-sm text-amber-600 mb-2">
                Only {product.stock} left!
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onQuickView}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Quick View
              </button>
              <button
                onClick={onAddToCart}
                disabled={product.stock === 0 || isLoading}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${product.stock === 0 || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Products;