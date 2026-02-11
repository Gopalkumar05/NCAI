

import api from './api';
import categoriesData from '../utils/categories'; // Import static data

export const productService = {
  // Products
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getTopRatedProducts: () => api.get('/products/top-rated'),
  getDiscountedProducts: () => api.get('/products/discounted'),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
  searchProducts: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
  
  // Categories - Return static data
  getCategories: () => Promise.resolve({ data: categoriesData }),
  getCategoryBySlug: (slug) => Promise.resolve({ 
    data: categoriesData.find(cat => cat.slug === slug) 
  }),
  getCategoryProducts: (slug, params = {}) => api.get(`/products?category=${slug}`, { params }),
  



  getProductReviews: (productId, params = {}) => 
    api.get(`/products/${productId}/reviews`, { params }),
  
  getReview: (productId, reviewId) => 
    api.get(`/products/${productId}/reviews/${reviewId}`),
  
  addReview: (productId, data) => {
    // Check if data contains files (FormData)
    const isFormData = data instanceof FormData;
    
    if (isFormData) {
      return api.post(`/products/${productId}/reviews`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return api.post(`/products/${productId}/reviews`, data);
    }
  },
  
  updateReview: (productId, reviewId, data) => {
    // Check if data contains files (FormData)
    const isFormData = data instanceof FormData;
    
    if (isFormData) {
      return api.put(`/products/${productId}/reviews/${reviewId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return api.put(`/products/${productId}/reviews/${reviewId}`, data);
    }
  },
  
  deleteReview: (productId, reviewId) => 
    api.delete(`/products/${productId}/reviews/${reviewId}`),
  
  markReviewHelpful: (productId, reviewId) => 
    api.post(`/products/${productId}/reviews/${reviewId}/helpful`),
  
  reportReview: (productId, reviewId, data) => 
    api.post(`/products/${productId}/reviews/${reviewId}/report`, data),

  // Image-specific methods
  uploadReviewImages: (productId, reviewId, formData) => 
    api.post(`/products/${productId}/reviews/${reviewId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteReviewImage: (productId, reviewId, imageIndex) => 
    api.delete(`/products/${productId}/reviews/${reviewId}/images/${imageIndex}`),

  // Wishlist (for non-authenticated users via localStorage)
  getWishlistItems: (ids) => api.post('/products/wishlist-items', { ids }),
  
  // Compare Products
  compareProducts: (ids) => api.post('/products/compare', { ids }),
  
  // Products by Tags
  getProductsByTag: (tag, params = {}) => api.get(`/products/tag/${tag}`, { params }),
  getPopularTags: () => api.get('/products/tags/popular'),
  
  // Products by Occasion
  getProductsByOccasion: (occasion) => api.get(`/products/occasion/${occasion}`),
};

export default productService;
