// components/admin/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    occasion: [],
    isFeatured: '',
    isAvailable: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });


const fetchProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await adminService.getProducts(filters);
    
    // Check the response structure and handle accordingly
    if (response.data && Array.isArray(response.data.data)) {
      // New structure: response.data.data is the array
      setProducts(response.data.data || []);
    } else if (Array.isArray(response.data)) {
      // Old structure: response.data is the array
      setProducts(response.data || []);
    } else if (Array.isArray(response)) {
      // If response itself is the array
      setProducts(response || []);
    } else {
      console.error('Unexpected response structure:', response);
      setProducts([]);
      throw new Error('Unexpected response format from server');
    }
  } catch (err) {
    setError(err.message || 'Failed to fetch products');
    toast.error(err.message || 'Failed to fetch products');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Create product
  const handleCreateProduct = async (productData) => {
    try {
      const response = await adminService.createProduct(productData);
      toast.success('Product created successfully');
      setShowForm(false);
      fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
      throw error;
    }
  };

  // Update product
  const handleUpdateProduct = async (productData) => {
    try {
      const response = await adminService.updateProduct(editingProduct._id, productData);
      toast.success('Product updated successfully');
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
      throw error;
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.warning('Please select products to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      return;
    }

    try {
      await adminService.bulkDeleteProducts(selectedProducts);
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete products');
    }
  };

  // Toggle product selection
  const toggleProductSelection = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id)
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  };

  // Select all products
  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      occasion: [],
      isFeatured: '',
      isAvailable: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            className="btn-secondary"
          >
            Back to Products
          </button>
        </div>
        
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn-danger"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={fetchProducts}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new product.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 btn-primary"
              >
                Add Product
              </button>
            </div>
          ) : (
            <>
              {/* Bulk selection */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={selectAllProducts}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Select all ({products.length} products)
                  </span>
                </label>
                
                {selectedProducts.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} product(s) selected
                  </span>
                )}
              </div>

              {/* Products list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isSelected={selectedProducts.includes(product._id)}
                    onSelect={() => toggleProductSelection(product._id)}
                    onEdit={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    onDelete={() => handleDeleteProduct(product._id)}
                  />
                ))}
              </div>

              {/* Pagination (if implemented) */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{products.length}</span> products
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={filters.page === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;