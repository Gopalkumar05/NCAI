import { useState, useEffect } from 'react';
import ProductForm from '../../components/admin/ProductForm';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { adminService } from '../../services/adminService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminService.getProducts();
      setProducts(response.data);
    } catch (error) {
      showAlert('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
        showAlert('success', 'Product deleted successfully');
      } catch (error) {
        showAlert('error', 'Failed to delete product');
      }
    }
  };

  const handleSave = async (productData) => {
    try {
      if (editingProduct?._id) {
        const response = await adminService.updateProduct(editingProduct._id, productData);
        setProducts(products.map(product => 
          product._id === editingProduct._id ? response.data : product
        ));
        showAlert('success', 'Product updated successfully');
      } else {
        const response = await adminService.createProduct(productData);
        setProducts([response.data, ...products]);
        showAlert('success', 'Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to save product');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  if (loading) return <Loader />;

  return (
    <div>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button onClick={handleCreate} className="btn-primary">
          Add New Product
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${product.price}
                    {product.discountPrice && (
                      <span className="ml-2 text-xs text-green-600 line-through">
                        ${product.discountPrice}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isAvailable ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Products;

// import { useState, useEffect } from 'react';
// import ProductForm from '../../components/admin/ProductForm';
// import Modal from '../../components/common/Modal';
// import Loader from '../../components/common/Loader';
// import Alert from '../../components/common/Alert';
// import SearchInput from '../../components/common/SearchInput';
// import FilterBar from '../../components/common/FilterBar';
// import { adminService } from '../../services/adminService';
// import {
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   ArrowUpTrayIcon,
//   FunnelIcon,
//   ArrowsUpDownIcon,
//   ChartBarIcon,
//   TagIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ShoppingBagIcon,
//   CurrencyDollarIcon,
// } from '@heroicons/react/24/outline';
// import {
//   SparklesIcon,
//   FireIcon,
//   StarIcon,
//   BoltIcon,
// } from '@heroicons/react/24/solid';
// import { formatCurrency, capitalize } from '../../utils/formatters';

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     category: 'all',
//     status: 'all',
//     sortBy: 'newest',
//     stock: 'all',
//   });
//   const [stats, setStats] = useState(null);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [isBulkUpdating, setIsBulkUpdating] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     filterAndSortProducts();
//     calculateStats();
//   }, [products, searchTerm, filters]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await adminService.getProducts();
//       setProducts(response.data);
//       setFilteredProducts(response.data);
//     } catch (error) {
//       showAlert('error', 'Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterAndSortProducts = () => {
//     let result = [...products];

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(product =>
//         product.name?.toLowerCase().includes(term) ||
//         product.description?.toLowerCase().includes(term) ||
//         product.category?.toLowerCase().includes(term) ||
//         product.sku?.toLowerCase().includes(term)
//       );
//     }

//     // Apply category filter
//     if (filters.category !== 'all') {
//       result = result.filter(product => product.category === filters.category);
//     }

//     // Apply status filter
//     if (filters.status !== 'all') {
//       if (filters.status === 'active') {
//         result = result.filter(product => product.isAvailable);
//       } else if (filters.status === 'inactive') {
//         result = result.filter(product => !product.isAvailable);
//       } else if (filters.status === 'low-stock') {
//         result = result.filter(product => product.stock < 10);
//       } else if (filters.status === 'out-of-stock') {
//         result = result.filter(product => product.stock === 0);
//       }
//     }

//     // Apply stock filter
//     if (filters.stock !== 'all') {
//       if (filters.stock === 'in-stock') {
//         result = result.filter(product => product.stock > 0);
//       } else if (filters.stock === 'low-stock') {
//         result = result.filter(product => product.stock > 0 && product.stock < 10);
//       } else if (filters.stock === 'out-of-stock') {
//         result = result.filter(product => product.stock === 0);
//       }
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       switch (filters.sortBy) {
//         case 'newest':
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case 'oldest':
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case 'price-high':
//           return b.price - a.price;
//         case 'price-low':
//           return a.price - b.price;
//         case 'name-asc':
//           return a.name.localeCompare(b.name);
//         case 'name-desc':
//           return b.name.localeCompare(a.name);
//         case 'stock-high':
//           return b.stock - a.stock;
//         case 'stock-low':
//           return a.stock - b.stock;
//         default:
//           return 0;
//       }
//     });

//     setFilteredProducts(result);
//   };

//   const calculateStats = () => {
//     const total = products.length;
//     const active = products.filter(p => p.isAvailable).length;
//     const lowStock = products.filter(p => p.stock < 10 && p.stock > 0).length;
//     const outOfStock = products.filter(p => p.stock === 0).length;
//     const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
//     const avgPrice = total > 0 ? products.reduce((sum, product) => sum + product.price, 0) / total : 0;
//     const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

//     setStats({
//       total,
//       active,
//       lowStock,
//       outOfStock,
//       totalValue,
//       avgPrice,
//       categories: categories.length,
//     });
//   };

//   const handleCreate = () => {
//     setEditingProduct(null);
//     setShowModal(true);
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setShowModal(true);
//   };

//   const handleDelete = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await adminService.deleteProduct(productId);
//         setProducts(products.filter(product => product._id !== productId));
//         showAlert('success', 'Product deleted successfully');
//         setSelectedProducts(selectedProducts.filter(id => id !== productId));
//       } catch (error) {
//         showAlert('error', 'Failed to delete product');
//       }
//     }
//   };

//   const handleSave = async (productData) => {
//     try {
//       if (editingProduct?._id) {
//         const response = await adminService.updateProduct(editingProduct._id, productData);
//         setProducts(products.map(product =>
//           product._id === editingProduct._id ? response.data : product
//         ));
//         showAlert('success', 'Product updated successfully');
//       } else {
//         const response = await adminService.createProduct(productData);
//         setProducts([response.data, ...products]);
//         showAlert('success', 'Product created successfully');
//       }
//       setShowModal(false);
//       setEditingProduct(null);
//     } catch (error) {
//       showAlert('error', error.response?.data?.message || 'Failed to save product');
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedProducts.length === 0) {
//       showAlert('warning', 'Please select products first');
//       return;
//     }

//     setIsBulkUpdating(true);
//     try {
//       switch (action) {
//         case 'activate':
//           await handleBulkStatusUpdate(true);
//           break;
//         case 'deactivate':
//           await handleBulkStatusUpdate(false);
//           break;
//         case 'delete':
//           await handleBulkDelete();
//           break;
//         case 'export':
//           handleExportProducts();
//           break;
//         default:
//           break;
//       }
//     } finally {
//       setIsBulkUpdating(false);
//     }
//   };

//   const handleBulkStatusUpdate = async (status) => {
//     try {
//       const promises = selectedProducts.map(productId =>
//         adminService.updateProduct(productId, { isAvailable: status })
//       );
//       await Promise.all(promises);

//       const updatedProducts = products.map(product =>
//         selectedProducts.includes(product._id)
//           ? { ...product, isAvailable: status }
//           : product
//       );

//       setProducts(updatedProducts);
//       showAlert('success', `${selectedProducts.length} products ${status ? 'activated' : 'deactivated'}`);
//       setSelectedProducts([]);
//     } catch (error) {
//       showAlert('error', 'Failed to update products');
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
//       return;
//     }

//     try {
//       const promises = selectedProducts.map(productId =>
//         adminService.deleteProduct(productId)
//       );
//       await Promise.all(promises);

//       setProducts(products.filter(product => !selectedProducts.includes(product._id)));
//       showAlert('success', `${selectedProducts.length} products deleted`);
//       setSelectedProducts([]);
//     } catch (error) {
//       showAlert('error', 'Failed to delete products');
//     }
//   };

//   const handleExportProducts = () => {
//     const exportData = filteredProducts.map(product => ({
//       'Name': product.name,
//       'SKU': product.sku || 'N/A',
//       'Category': product.category,
//       'Price': product.price,
//       'Stock': product.stock,
//       'Status': product.isAvailable ? 'Active' : 'Inactive',
//       'Description': product.description,
//       'Created': new Date(product.createdAt).toLocaleDateString(),
//     }));

//     console.log('Export data:', exportData);
//     showAlert('success', `Exported ${exportData.length} products`);
//   };

//   const handleSelectProduct = (productId) => {
//     setSelectedProducts(prev =>
//       prev.includes(productId)
//         ? prev.filter(id => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedProducts.length === filteredProducts.length) {
//       setSelectedProducts([]);
//     } else {
//       setSelectedProducts(filteredProducts.map(product => product._id));
//     }
//   };

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const categoryOptions = [
//     { value: 'all', label: 'All Categories' },
//     ...(stats?.categories ? [...new Set(products.map(p => p.category).filter(Boolean))]
//       .map(category => ({ value: category, label: capitalize(category) })) : []),
//   ];

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'active', label: 'Active', icon: CheckCircleIcon },
//     { value: 'inactive', label: 'Inactive', icon: XCircleIcon },
//     { value: 'low-stock', label: 'Low Stock', icon: TagIcon },
//     { value: 'out-of-stock', label: 'Out of Stock', icon: TagIcon },
//   ];

//   const stockOptions = [
//     { value: 'all', label: 'All Stock' },
//     { value: 'in-stock', label: 'In Stock' },
//     { value: 'low-stock', label: 'Low Stock (< 10)' },
//     { value: 'out-of-stock', label: 'Out of Stock' },
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Newest' },
//     { value: 'oldest', label: 'Oldest' },
//     { value: 'price-high', label: 'Price: High to Low' },
//     { value: 'price-low', label: 'Price: Low to High' },
//     { value: 'name-asc', label: 'Name: A to Z' },
//     { value: 'name-desc', label: 'Name: Z to A' },
//     { value: 'stock-high', label: 'Stock: High to Low' },
//     { value: 'stock-low', label: 'Stock: Low to High' },
//   ];

//   const bulkActions = [
//     { value: 'activate', label: 'Activate Selected', icon: CheckCircleIcon },
//     { value: 'deactivate', label: 'Deactivate Selected', icon: XCircleIcon },
//     { value: 'delete', label: 'Delete Selected', icon: TrashIcon },
//     { value: 'export', label: 'Export Selected', icon: ArrowUpTrayIcon },
//   ];

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="space-y-4 md:space-y-6">
//       {alert.show && (
//         <div className="animate-slide-down">
//           <Alert
//             type={alert.type}
//             message={alert.message}
//             onClose={() => setAlert({ show: false, type: '', message: '' })}
//           />
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Management</h1>
//           <p className="text-gray-600 mt-1">
//             Manage your product catalog, inventory, and pricing
//           </p>
//         </div>
//         <button
//           onClick={handleCreate}
//           className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
//         >
//           <PlusIcon className="w-5 h-5 mr-2" />
//           Add Product
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
//         <StatCard
//           title="Total Products"
//           value={stats?.total || 0}
//           icon={ShoppingBagIcon}
//           color="blue"
//           trend={5}
//           trendLabel="this month"
//         />
//         <StatCard
//           title="Active"
//           value={stats?.active || 0}
//           icon={CheckCircleIcon}
//           color="green"
//           subtitle={`${Math.round((stats?.active / stats?.total) * 100) || 0}% of total`}
//         />
//         <StatCard
//           title="Low Stock"
//           value={stats?.lowStock || 0}
//           icon={TagIcon}
//           color="yellow"
//           subtitle="< 10 units"
//         />
//         <StatCard
//           title="Out of Stock"
//           value={stats?.outOfStock || 0}
//           icon={XCircleIcon}
//           color="red"
//           subtitle="Needs restocking"
//         />
//         <StatCard
//           title="Avg. Price"
//           value={formatCurrency(stats?.avgPrice || 0)}
//           icon={CurrencyDollarIcon}
//           color="purple"
//           subtitle="per product"
//         />
//         <StatCard
//           title="Total Value"
//           value={formatCurrency(stats?.totalValue || 0)}
//           icon={ChartBarIcon}
//           color="indigo"
//           subtitle="inventory value"
//         />
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           <div className="flex-1">
//             <SearchInput
//               value={searchTerm}
//               onChange={setSearchTerm}
//               placeholder="Search products by name, SKU, or description..."
//               withFilters
//               filterCount={Object.values(filters).filter(f => f !== 'all' && f !== 'newest').length}
//               onFilterClick={() => console.log('Show advanced filters')}
//             />
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <FilterBar
//               label="Category"
//               value={filters.category}
//               onChange={(value) => setFilters({ ...filters, category: value })}
//               options={categoryOptions}
//               searchable
//             />
//             <FilterBar
//               label="Status"
//               value={filters.status}
//               onChange={(value) => setFilters({ ...filters, status: value })}
//               options={statusOptions}
//             />
//             <FilterBar
//               label="Sort By"
//               value={filters.sortBy}
//               onChange={(value) => setFilters({ ...filters, sortBy: value })}
//               options={sortOptions}
//               icon={ArrowsUpDownIcon}
//             />
//           </div>
//         </div>

//         {/* Mobile Filters */}
//         <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Stock Status
//               </label>
//               <select
//                 value={filters.stock}
//                 onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
//               >
//                 {stockOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bulk Actions Bar */}
//       {selectedProducts.length > 0 && (
//         <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex items-center">
//               <span className="text-sm font-medium text-primary-800">
//                 {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
//               </span>
//               <button
//                 onClick={() => setSelectedProducts([])}
//                 className="ml-4 text-sm text-primary-600 hover:text-primary-700"
//               >
//                 Clear selection
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {bulkActions.map(action => (
//                 <button
//                   key={action.value}
//                   onClick={() => handleBulkAction(action.value)}
//                   disabled={isBulkUpdating}
//                   className="inline-flex items-center px-3 py-2 border border-primary-300 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                 >
//                   <action.icon className="w-4 h-4 mr-2" />
//                   <span className="hidden sm:inline">{action.label}</span>
//                   <span className="sm:hidden">{action.label.split(' ')[0]}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Products Table/List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Products</h3>
//               <p className="text-sm text-gray-600 mt-1">
//                 Showing {filteredProducts.length} of {products.length} products
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleSelectAll}
//                 className="text-sm font-medium text-primary-600 hover:text-primary-700"
//               >
//                 {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
//               </button>
//               <span className="text-sm text-gray-500">|</span>
//               <FilterBar
//                 label="Stock"
//                 value={filters.stock}
//                 onChange={(value) => setFilters({ ...filters, stock: value })}
//                 options={stockOptions}
//                 icon={TagIcon}
//                 size="small"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Mobile Product List */}
//         <div className="lg:hidden divide-y divide-gray-200">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map(product => (
//               <ProductMobileCard
//                 key={product._id}
//                 product={product}
//                 isSelected={selectedProducts.includes(product._id)}
//                 onSelect={handleSelectProduct}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))
//           ) : (
//             <div className="text-center py-12">
//               <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto" />
//               <p className="mt-4 text-gray-500">No products found</p>
//               {searchTerm && (
//                 <p className="text-sm text-gray-400 mt-2">
//                   Try adjusting your search or filters
//                 </p>
//               )}
//               <button
//                 onClick={handleCreate}
//                 className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
//               >
//                 <PlusIcon className="w-4 h-4 mr-2" />
//                 Add First Product
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Desktop Product Table */}
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
//                     onChange={handleSelectAll}
//                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                   />
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stock
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map(product => (
//                   <ProductTableRow
//                     key={product._id}
//                     product={product}
//                     isSelected={selectedProducts.includes(product._id)}
//                     onSelect={handleSelectProduct}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
//                   />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-12 text-center">
//                     <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto" />
//                     <p className="mt-4 text-gray-500">No products found</p>
//                     {searchTerm && (
//                       <p className="text-sm text-gray-400 mt-2">
//                         Try adjusting your search or filters
//                       </p>
//                     )}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         {filteredProducts.length > 0 && (
//           <div className="px-4 py-3 sm:px-6 border-t border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{Math.min(filteredProducts.length, 10)}</span> of{' '}
//                 <span className="font-medium">{filteredProducts.length}</span> products
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => console.log('Previous page')}
//                   className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
//                   disabled
//                 >
//                   Previous
//                 </button>
//                 <span className="text-sm text-gray-700">Page 1 of 1</span>
//                 <button
//                   onClick={() => console.log('Next page')}
//                   className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
//                   disabled
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditingProduct(null);
//         }}
//         title={editingProduct ? 'Edit Product' : 'Add New Product'}
//         size="xl"
//       >
//         <ProductForm
//           product={editingProduct}
//           onSubmit={handleSave}
//           onCancel={() => {
//             setShowModal(false);
//             setEditingProduct(null);
//           }}
//         />
//       </Modal>
//     </div>
//   );
// };

// // Sub-components

// const StatCard = ({ title, value, icon: Icon, color, trend, trendLabel, subtitle }) => {
//   const colorClasses = {
//     blue: 'bg-blue-50 text-blue-700 border-blue-200',
//     green: 'bg-green-50 text-green-700 border-green-200',
//     yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
//     red: 'bg-red-50 text-red-700 border-red-200',
//     purple: 'bg-purple-50 text-purple-700 border-purple-200',
//     indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
//   };

//   return (
//     <div className={`rounded-lg border p-3 sm:p-4 ${colorClasses[color]}`}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <p className="text-xs sm:text-sm font-medium opacity-90 truncate">{title}</p>
//           <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 truncate">{value}</p>
          
//           {subtitle && (
//             <p className="text-xs opacity-75 mt-1 truncate">{subtitle}</p>
//           )}
          
//           {trend !== undefined && (
//             <div className="flex items-center mt-2">
//               <span className="text-xs font-medium">
//                 {trend > 0 ? '+' : ''}{trend} {trendLabel}
//               </span>
//             </div>
//           )}
//         </div>
//         <div className={`p-2 rounded-lg bg-white/50 ${colorClasses[color].replace('bg-', 'bg-opacity-30')} ml-2 flex-shrink-0`}>
//           <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductMobileCard = ({ product, isSelected, onSelect, onEdit, onDelete }) => {
//   const stockStatus = product.stock === 0 
//     ? 'bg-red-100 text-red-800'
//     : product.stock < 10
//     ? 'bg-yellow-100 text-yellow-800'
//     : 'bg-green-100 text-green-800';

//   return (
//     <div className="p-4">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             checked={isSelected}
//             onChange={() => onSelect(product._id)}
//             className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//           />
//           {product.images?.[0] && (
//             <img
//               src={product.images[0].url}
//               alt={product.name}
//               className="w-12 h-12 rounded-lg object-cover border border-gray-200"
//             />
//           )}
//           <div className="min-w-0 flex-1">
//             <p className="font-medium text-gray-900 truncate">{product.name}</p>
//             {product.sku && (
//               <p className="text-xs text-gray-500 font-mono truncate">{product.sku}</p>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div>
//           <p className="text-xs text-gray-500">Category</p>
//           <p className="text-sm font-medium text-gray-900 truncate">
//             {product.category || 'Uncategorized'}
//           </p>
//         </div>
//         <div>
//           <p className="text-xs text-gray-500">Price</p>
//           <p className="text-sm font-medium text-gray-900">
//             {formatCurrency(product.price)}
//           </p>
//         </div>
//       </div>
      
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus}`}>
//             {product.stock} in stock
//           </span>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//             product.isAvailable
//               ? 'bg-green-100 text-green-800'
//               : 'bg-gray-100 text-gray-800'
//           }`}>
//             {product.isAvailable ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => onEdit(product)}
//             className="p-2 text-gray-400 hover:text-blue-600"
//             aria-label="Edit"
//           >
//             <PencilIcon className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => onDelete(product._id)}
//             className="p-2 text-gray-400 hover:text-red-600"
//             aria-label="Delete"
//           >
//             <TrashIcon className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductTableRow = ({ product, isSelected, onSelect, onEdit, onDelete }) => {
//   const stockStatus = product.stock === 0 
//     ? 'bg-red-100 text-red-800'
//     : product.stock < 10
//     ? 'bg-yellow-100 text-yellow-800'
//     : 'bg-green-100 text-green-800';

//   return (
//     <tr className="hover:bg-gray-50 transition-colors duration-150">
//       <td className="px-6 py-4 whitespace-nowrap">
//         <input
//           type="checkbox"
//           checked={isSelected}
//           onChange={() => onSelect(product._id)}
//           className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//         />
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           {product.images?.[0] && (
//             <img
//               src={product.images[0].url}
//               alt={product.name}
//               className="w-10 h-10 rounded-lg object-cover mr-3 border border-gray-200"
//             />
//           )}
//           <div className="min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
//               {product.name}
//             </p>
//             {product.sku && (
//               <p className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
//                 SKU: {product.sku}
//               </p>
//             )}
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
//           {product.category || 'Uncategorized'}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="text-sm text-gray-900">
//           {formatCurrency(product.price)}
//           {product.discountPrice && (
//             <span className="ml-2 text-xs text-green-600 line-through">
//               {formatCurrency(product.discountPrice)}
//             </span>
//           )}
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus}`}>
//             {product.stock}
//           </span>
//           {product.stock < 10 && product.stock > 0 && (
//             <span className="ml-2 text-xs text-yellow-600">
//               Low stock
//             </span>
//           )}
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//           product.isAvailable
//             ? 'bg-green-100 text-green-800'
//             : 'bg-gray-100 text-gray-800'
//         }`}>
//           {product.isAvailable ? 'Active' : 'Inactive'}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => onEdit(product)}
//             className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(product._id)}
//             className="text-red-600 hover:text-red-900 transition-colors duration-200"
//           >
//             Delete
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default Products;