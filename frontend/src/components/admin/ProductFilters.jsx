
// // components/admin/ProductFilters.jsx


// import React, { useState, useEffect } from 'react';
// import {
//   FunnelIcon,
//   XMarkIcon,
//   MagnifyingGlassIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   AdjustmentsHorizontalIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/outline';

// const ProductFilters = ({ filters, onChange, onReset }) => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//     return () => window.removeEventListener('resize', checkIfMobile);
//   }, []);

//   const categories = [
//     { value: 'roses', label: 'Roses', color: 'bg-red-100 text-red-800' },
//     { value: 'lilies', label: 'Lilies', color: 'bg-pink-100 text-pink-800' },
//     { value: 'tulips', label: 'Tulips', color: 'bg-purple-100 text-purple-800' },
//     { value: 'orchids', label: 'Orchids', color: 'bg-blue-100 text-blue-800' },
//     { value: 'mixed', label: 'Mixed Bouquets', color: 'bg-green-100 text-green-800' },
//     { value: 'seasonal', label: 'Seasonal', color: 'bg-yellow-100 text-yellow-800' },
//     { value: 'bouquets', label: 'Bouquets', color: 'bg-indigo-100 text-indigo-800' },
//   ];

//   const occasions = [
//     { value: 'birthday', label: 'Birthday', icon: '🎂' },
//     { value: 'anniversary', label: 'Anniversary', icon: '💝' },
//     { value: 'wedding', label: 'Wedding', icon: '💒' },
//     { value: 'valentine', label: "Valentine's", icon: '💘' },
//     { value: 'sympathy', label: 'Sympathy', icon: '🤍' },
//     { value: 'congratulations', label: 'Congratulations', icon: '🎉' },
//     { value: 'get-well', label: 'Get Well', icon: '💊' },
//     { value: 'thank-you', label: 'Thank You', icon: '🙏' },
//   ];

//   const sortOptions = [
//     { value: 'createdAt', label: 'Date Created' },
//     { value: 'updatedAt', label: 'Last Updated' },
//     { value: 'price', label: 'Price' },
//     { value: 'name', label: 'Name' },
//     { value: 'stock', label: 'Stock Level' },
//     { value: 'popularity', label: 'Popularity' },
//     { value: 'ratings', label: 'Rating' },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     onChange({
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleOccasionChange = (occasion) => {
//     const newOccasions = filters.occasion.includes(occasion)
//       ? filters.occasion.filter(o => o !== occasion)
//       : [...filters.occasion, occasion];
    
//     onChange({ occasion: newOccasions });
//   };

//   const handleCategoryChange = (category) => {
//     onChange({ category: filters.category === category ? '' : category });
//   };

//   const handleStatusChange = (status) => {
//     let newStatus = '';
//     if (filters.isAvailable === '') newStatus = 'true';
//     else if (filters.isAvailable === 'true') newStatus = 'false';
//     onChange({ isAvailable: newStatus });
//   };

//   const handleStockFilter = (filter) => {
//     const stockFilters = {
//       'in-stock': { minStock: 1 },
//       'low-stock': { minStock: 1, maxStock: 10 },
//       'out-of-stock': { minStock: 0, maxStock: 0 },
//       'all-stock': { minStock: '', maxStock: '' }
//     };
//     onChange(stockFilters[filter]);
//   };

//   const getStatusLabel = () => {
//     if (filters.isAvailable === 'true') return 'Available';
//     if (filters.isAvailable === 'false') return 'Unavailable';
//     return 'All Status';
//   };

//   const getStockFilterLabel = () => {
//     if (filters.minStock === 1 && !filters.maxStock) return 'In Stock';
//     if (filters.minStock === 1 && filters.maxStock === 10) return 'Low Stock';
//     if (filters.minStock === 0 && filters.maxStock === 0) return 'Out of Stock';
//     return 'All Stock';
//   };

//   // Mobile Filters Component
//   const MobileFilters = () => (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
//           {/* Header */}
//           <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-700" />
//                 <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={onReset}
//                   className="text-sm text-primary-600 hover:text-primary-700"
//                 >
//                   Reset All
//                 </button>
//                 <button
//                   onClick={() => setShowMobileFilters(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Filters Content */}
//           <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
//             <div className="space-y-6">
//               {/* Search */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search Products
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="search"
//                     value={filters.search}
//                     onChange={handleInputChange}
//                     placeholder="Search by name, description..."
//                     className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Categories */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Categories
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {categories.map(cat => (
//                     <button
//                       key={cat.value}
//                       type="button"
//                       onClick={() => handleCategoryChange(cat.value)}
//                       className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
//                         filters.category === cat.value
//                           ? `${cat.color} ring-2 ring-offset-1 ring-opacity-50`
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       {cat.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Price Range
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <input
//                       type="number"
//                       name="minPrice"
//                       value={filters.minPrice}
//                       onChange={handleInputChange}
//                       placeholder="Min Price"
//                       min="0"
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="number"
//                       name="maxPrice"
//                       value={filters.maxPrice}
//                       onChange={handleInputChange}
//                       placeholder="Max Price"
//                       min="0"
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Occasions */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Occasions
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {occasions.map(occasion => (
//                     <button
//                       key={occasion.value}
//                       type="button"
//                       onClick={() => handleOccasionChange(occasion.value)}
//                       className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
//                         filters.occasion.includes(occasion.value)
//                           ? 'bg-primary-600 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       <span className="mr-2">{occasion.icon}</span>
//                       {occasion.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Status & Stock */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Availability
//                   </label>
//                   <button
//                     onClick={() => handleStatusChange()}
//                     className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                       filters.isAvailable === 'true'
//                         ? 'bg-green-100 text-green-800'
//                         : filters.isAvailable === 'false'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-gray-100 text-gray-700'
//                     }`}
//                   >
//                     {getStatusLabel()}
//                   </button>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock Level
//                   </label>
//                   <select
//                     onChange={(e) => handleStockFilter(e.target.value)}
//                     value={getStockFilterLabel().toLowerCase().replace(' ', '-')}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     <option value="all-stock">All Stock</option>
//                     <option value="in-stock">In Stock</option>
//                     <option value="low-stock">Low Stock</option>
//                     <option value="out-of-stock">Out of Stock</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Featured Filter */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                     <span className="text-yellow-600 font-bold">★</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Featured Products</p>
//                     <p className="text-xs text-gray-500">Show only featured items</p>
//                   </div>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={filters.isFeatured === 'true'}
//                     onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                 </label>
//               </div>

//               {/* Sort */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sort By
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <select
//                     name="sortBy"
//                     value={filters.sortBy}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     {sortOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <select
//                     name="sortOrder"
//                     value={filters.sortOrder}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     <option value="desc">Descending</option>
//                     <option value="asc">Ascending</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
//             <button
//               onClick={() => {
//                 onChange({});
//                 onReset();
//               }}
//               className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//             >
//               <ArrowPathIcon className="h-4 w-4 mr-2" />
//               Clear All Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Desktop Filters Component
//   const DesktopFilters = () => (
//     <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${
//       isCollapsed ? 'pb-0' : ''
//     }`}>
//       {/* Header */}
//       <div 
//         className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
//         onClick={() => !isMobile && setIsCollapsed(!isCollapsed)}
//       >
//         <div className="flex items-center space-x-3">
//           <FunnelIcon className="h-5 w-5 text-gray-700" />
//           <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
//           {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.occasion.length > 0) && (
//             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
//               Active
//             </span>
//           )}
//         </div>
//         <div className="flex items-center space-x-3">
//           {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.occasion.length > 0) && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onReset();
//               }}
//               className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
//             >
//               <ArrowPathIcon className="h-4 w-4 mr-1" />
//               Reset
//             </button>
//           )}
//           {!isMobile && (
//             <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
//           )}
//         </div>
//       </div>

//       {/* Filters Content - Hidden when collapsed */}
//       {(!isCollapsed || isMobile) && (
//         <div className="p-4 space-y-4">
//           {/* Search Bar */}
//           <div>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="search"
//                 value={filters.search}
//                 onChange={handleInputChange}
//                 placeholder="Search products by name or description..."
//                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Main Filters Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Categories - Enhanced with colors */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <div className="relative">
//                 <select
//                   name="category"
//                   value={filters.category}
//                   onChange={handleInputChange}
//                   className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.value} value={cat.value}>{cat.label}</option>
//                   ))}
//                 </select>
//                 <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Price Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Min Price
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   name="minPrice"
//                   value={filters.minPrice}
//                   onChange={handleInputChange}
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                   className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Max Price
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   name="maxPrice"
//                   value={filters.maxPrice}
//                   onChange={handleInputChange}
//                   placeholder="999.99"
//                   min="0"
//                   step="0.01"
//                   className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Availability
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 <button
//                   onClick={() => onChange({ isAvailable: '' })}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === ''
//                       ? 'bg-gray-200 text-gray-900'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   All
//                 </button>
//                 <button
//                   onClick={() => onChange({ isAvailable: 'true' })}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === 'true'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Available
//                 </button>
//                 <button
//                   onClick={() => onChange({ isAvailable: 'false' })}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === 'false'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Unavailable
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Occasions */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Occasions
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {occasions.map(occasion => (
//                 <button
//                   key={occasion.value}
//                   type="button"
//                   onClick={() => handleOccasionChange(occasion.value)}
//                   className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
//                     filters.occasion.includes(occasion.value)
//                       ? 'bg-primary-600 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <span className="mr-2">{occasion.icon}</span>
//                   {occasion.label}
//                   {filters.occasion.includes(occasion.value) && (
//                     <XMarkIcon className="ml-2 h-3 w-3" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Featured & Stock Filters */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isFeatured"
//                   checked={filters.isFeatured === 'true'}
//                   onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                   className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Featured Products</span>
//               </label>
//             </div>

//             {/* Sort Controls */}
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-700">Sort by:</span>
//                 <select
//                   name="sortBy"
//                   value={filters.sortBy}
//                   onChange={handleInputChange}
//                   className="border-0 text-sm font-medium text-primary-600 focus:ring-0 focus:outline-none"
//                 >
//                   {sortOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
//                 className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
//               >
//                 {filters.sortOrder === 'asc' ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
//               </button>
//             </div>
//           </div>

//           {/* Active Filters Display */}
//           {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.occasion.length > 0 || filters.isFeatured === 'true') && (
//             <div className="pt-4 border-t border-gray-200">
//               <div className="flex items-center flex-wrap gap-2">
//                 <span className="text-sm text-gray-500">Active filters:</span>
//                 {filters.search && (
//                   <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                     Search: "{filters.search}"
//                     <button
//                       onClick={() => onChange({ search: '' })}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.category && (
//                   <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
//                     {categories.find(c => c.value === filters.category)?.label}
//                     <button
//                       onClick={() => onChange({ category: '' })}
//                       className="ml-2 text-purple-600 hover:text-purple-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.minPrice && (
//                   <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                     Min: ${filters.minPrice}
//                     <button
//                       onClick={() => onChange({ minPrice: '' })}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.maxPrice && (
//                   <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                     Max: ${filters.maxPrice}
//                     <button
//                       onClick={() => onChange({ maxPrice: '' })}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.occasion.map(occasion => (
//                   <span key={occasion} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                     {occasions.find(o => o.value === occasion)?.label}
//                     <button
//                       onClick={() => handleOccasionChange(occasion)}
//                       className="ml-2 text-yellow-600 hover:text-yellow-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 ))}
//                 {filters.isFeatured === 'true' && (
//                   <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                     Featured Only
//                     <button
//                       onClick={() => onChange({ isFeatured: '' })}
//                       className="ml-2 text-yellow-600 hover:text-yellow-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Mobile Filter Toggle Button */}
//       {isMobile && (
//         <button
//           onClick={() => setShowMobileFilters(true)}
//           className="w-full md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           <FunnelIcon className="h-5 w-5" />
//           Filters & Sorting
//           {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.occasion.length > 0) && (
//             <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
//               Active
//             </span>
//           )}
//         </button>
//       )}

//       {/* Desktop Filters */}
//       {!isMobile && <DesktopFilters />}

//       {/* Mobile Filters Modal */}
//       {showMobileFilters && <MobileFilters />}
//     </>
//   );
// };

// export default ProductFilters;


// import React, { useState, useEffect } from 'react';
// import {
//   FunnelIcon,
//   XMarkIcon,
//   MagnifyingGlassIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   AdjustmentsHorizontalIcon,
//   ArrowPathIcon,
//   StarIcon
// } from '@heroicons/react/24/outline';

// const ProductFilters = ({ filters, onChange, onReset }) => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activeFilterCount, setActiveFilterCount] = useState(0);

//   // Calculate active filter count
//   useEffect(() => {
//     let count = 0;
//     if (filters.search) count++;
//     if (filters.category) count++;
//     if (filters.minPrice) count++;
//     if (filters.maxPrice) count++;
//     if (filters.occasion?.length > 0) count += filters.occasion.length;
//     if (filters.isAvailable) count++;
//     if (filters.isFeatured === 'true') count++;
//     if (filters.minStock || filters.maxStock) count++;
//     setActiveFilterCount(count);
//   }, [filters]);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//     return () => window.removeEventListener('resize', checkIfMobile);
//   }, []);

//   const categories = [
//     { value: 'roses', label: 'Roses', color: 'bg-red-100 text-red-800' },
//     { value: 'lilies', label: 'Lilies', color: 'bg-pink-100 text-pink-800' },
//     { value: 'tulips', label: 'Tulips', color: 'bg-purple-100 text-purple-800' },
//     { value: 'orchids', label: 'Orchids', color: 'bg-blue-100 text-blue-800' },
//     { value: 'mixed', label: 'Mixed Bouquets', color: 'bg-green-100 text-green-800' },
//     { value: 'seasonal', label: 'Seasonal', color: 'bg-yellow-100 text-yellow-800' },
//     { value: 'bouquets', label: 'Bouquets', color: 'bg-indigo-100 text-indigo-800' },
//   ];

//   const occasions = [
//     { value: 'birthday', label: 'Birthday', icon: '🎂' },
//     { value: 'anniversary', label: 'Anniversary', icon: '💝' },
//     { value: 'wedding', label: 'Wedding', icon: '💒' },
//     { value: 'valentine', label: "Valentine's", icon: '💘' },
//     { value: 'sympathy', label: 'Sympathy', icon: '🤍' },
//     { value: 'congratulations', label: 'Congratulations', icon: '🎉' },
//     { value: 'get-well', label: 'Get Well', icon: '💊' },
//     { value: 'thank-you', label: 'Thank You', icon: '🙏' },
//   ];

//   const sortOptions = [
//     { value: 'createdAt', label: 'Date Created' },
//     { value: 'updatedAt', label: 'Last Updated' },
//     { value: 'price', label: 'Price' },
//     { value: 'name', label: 'Name' },
//     { value: 'stock', label: 'Stock Level' },
//     { value: 'popularity', label: 'Popularity' },
//     { value: 'ratings', label: 'Rating' },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     onChange({
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleOccasionChange = (occasion) => {
//     const newOccasions = filters.occasion.includes(occasion)
//       ? filters.occasion.filter(o => o !== occasion)
//       : [...filters.occasion, occasion];
    
//     onChange({ occasion: newOccasions });
//   };

//   const handleCategoryChange = (category) => {
//     onChange({ category: filters.category === category ? '' : category });
//   };

//   const handleStatusChange = () => {
//     let newStatus = '';
//     if (filters.isAvailable === '') newStatus = 'true';
//     else if (filters.isAvailable === 'true') newStatus = 'false';
//     onChange({ isAvailable: newStatus });
//   };

//   const handleStockFilter = (filter) => {
//     const stockFilters = {
//       'in-stock': { minStock: 1 },
//       'low-stock': { minStock: 1, maxStock: 10 },
//       'out-of-stock': { minStock: 0, maxStock: 0 },
//       'all-stock': { minStock: '', maxStock: '' }
//     };
//     onChange(stockFilters[filter]);
//   };

//   const getStatusLabel = () => {
//     if (filters.isAvailable === 'true') return 'Available';
//     if (filters.isAvailable === 'false') return 'Unavailable';
//     return 'All Status';
//   };

//   const getStockFilterLabel = () => {
//     if (filters.minStock === 1 && !filters.maxStock) return 'In Stock';
//     if (filters.minStock === 1 && filters.maxStock === 10) return 'Low Stock';
//     if (filters.minStock === 0 && filters.maxStock === 0) return 'Out of Stock';
//     return 'All Stock';
//   };

//   const handleClearAll = () => {
//     onChange({
//       search: '',
//       category: '',
//       minPrice: '',
//       maxPrice: '',
//       occasion: [],
//       isAvailable: '',
//       isFeatured: '',
//       minStock: '',
//       maxStock: '',
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     });
//     onReset();
//   };

//   // Mobile Filters Component
//   const MobileFilters = () => (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
//       <div className="flex min-h-full items-end justify-center p-0 sm:p-4">
//         <div className="relative w-full max-w-md transform rounded-t-2xl sm:rounded-2xl bg-white shadow-xl transition-all sm:my-8">
//           {/* Header */}
//           <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200 rounded-t-2xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
//                 <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//                 {activeFilterCount > 0 && (
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//                     {activeFilterCount}
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center space-x-3">
//                 {activeFilterCount > 0 && (
//                   <button
//                     onClick={handleClearAll}
//                     className="text-sm text-pink-600 hover:text-pink-700"
//                   >
//                     Clear All
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setShowMobileFilters(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Filters Content */}
//           <div className="max-h-[70vh] overflow-y-auto px-4 sm:px-6 py-4">
//             <div className="space-y-4 sm:space-y-6">
//               {/* Search */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Search Products
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="search"
//                     value={filters.search}
//                     onChange={handleInputChange}
//                     placeholder="Search by name, description..."
//                     className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Categories */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Categories
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {categories.map(cat => (
//                     <button
//                       key={cat.value}
//                       type="button"
//                       onClick={() => handleCategoryChange(cat.value)}
//                       className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
//                         filters.category === cat.value
//                           ? `${cat.color} ring-2 ring-offset-1 ring-current ring-opacity-30`
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       {cat.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price Range
//                 </label>
//                 <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                   <div>
//                     <div className="relative">
//                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//                       <input
//                         type="number"
//                         name="minPrice"
//                         value={filters.minPrice}
//                         onChange={handleInputChange}
//                         placeholder="Min"
//                         min="0"
//                         step="0.01"
//                         className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="relative">
//                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//                       <input
//                         type="number"
//                         name="maxPrice"
//                         value={filters.maxPrice}
//                         onChange={handleInputChange}
//                         placeholder="Max"
//                         min="0"
//                         step="0.01"
//                         className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Occasions */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Occasions
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {occasions.map(occasion => (
//                     <button
//                       key={occasion.value}
//                       type="button"
//                       onClick={() => handleOccasionChange(occasion.value)}
//                       className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
//                         filters.occasion.includes(occasion.value)
//                           ? 'bg-pink-600 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       <span className="mr-2">{occasion.icon}</span>
//                       {occasion.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Status & Stock */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Availability
//                   </label>
//                   <button
//                     onClick={handleStatusChange}
//                     className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                       filters.isAvailable === 'true'
//                         ? 'bg-green-100 text-green-800'
//                         : filters.isAvailable === 'false'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-gray-100 text-gray-700'
//                     }`}
//                   >
//                     {getStatusLabel()}
//                   </button>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock Level
//                   </label>
//                   <select
//                     onChange={(e) => handleStockFilter(e.target.value)}
//                     value={getStockFilterLabel().toLowerCase().replace(' ', '-')}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                   >
//                     <option value="all-stock">All Stock</option>
//                     <option value="in-stock">In Stock</option>
//                     <option value="low-stock">Low Stock</option>
//                     <option value="out-of-stock">Out of Stock</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Featured Filter */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                     <StarIcon className="h-4 w-4 text-yellow-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Featured Only</p>
//                     <p className="text-xs text-gray-500">Show featured items</p>
//                   </div>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={filters.isFeatured === 'true'}
//                     onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
//                 </label>
//               </div>

//               {/* Sort */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sort By
//                 </label>
//                 <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                   <select
//                     name="sortBy"
//                     value={filters.sortBy}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                   >
//                     {sortOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <select
//                     name="sortOrder"
//                     value={filters.sortOrder}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                   >
//                     <option value="desc">Descending</option>
//                     <option value="asc">Ascending</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-4 border-t border-gray-200">
//             <button
//               onClick={() => {
//                 handleClearAll();
//                 setShowMobileFilters(false);
//               }}
//               className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               <ArrowPathIcon className="h-4 w-4 mr-2" />
//               Clear All Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Desktop Filters Component
//   const DesktopFilters = () => (
//     <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${
//       isCollapsed ? 'pb-0' : ''
//     }`}>
//       {/* Header */}
//       <div 
//         className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         <div className="flex items-center space-x-3">
//           <FunnelIcon className="h-5 w-5 text-gray-700" />
//           <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
//           {activeFilterCount > 0 && (
//             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//               {activeFilterCount} active
//             </span>
//           )}
//         </div>
//         <div className="flex items-center space-x-3">
//           {activeFilterCount > 0 && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleClearAll();
//               }}
//               className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors"
//             >
//               <ArrowPathIcon className="h-4 w-4 mr-1" />
//               Clear All
//             </button>
//           )}
//           <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
//         </div>
//       </div>

//       {/* Filters Content - Hidden when collapsed */}
//       {!isCollapsed && (
//         <div className="p-4 space-y-4">
//           {/* Search Bar */}
//           <div>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="search"
//                 value={filters.search}
//                 onChange={handleInputChange}
//                 placeholder="Search products by name or description..."
//                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Main Filters Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Categories */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <div className="relative">
//                 <select
//                   name="category"
//                   value={filters.category}
//                   onChange={handleInputChange}
//                   className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white"
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.value} value={cat.value}>{cat.label}</option>
//                   ))}
//                 </select>
//                 <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Min Price */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Min Price
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   name="minPrice"
//                   value={filters.minPrice}
//                   onChange={handleInputChange}
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                   className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Max Price */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Max Price
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   name="maxPrice"
//                   value={filters.maxPrice}
//                   onChange={handleInputChange}
//                   placeholder="999.99"
//                   min="0"
//                   step="0.01"
//                   className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Availability
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 <button
//                   onClick={() => onChange({ isAvailable: '' })}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === ''
//                       ? 'bg-gray-200 text-gray-900'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   All
//                 </button>
//                 <button
//                   onClick={() => onChange({ isAvailable: 'true' })}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === 'true'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Available
//                 </button>
//                 <button
//                   onClick={() => onChange({ isAvailable: 'false' })}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === 'false'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Unavailable
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Occasions */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Occasions
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {occasions.map(occasion => (
//                 <button
//                   key={occasion.value}
//                   type="button"
//                   onClick={() => handleOccasionChange(occasion.value)}
//                   className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
//                     filters.occasion.includes(occasion.value)
//                       ? 'bg-pink-600 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <span className="mr-2">{occasion.icon}</span>
//                   {occasion.label}
//                   {filters.occasion.includes(occasion.value) && (
//                     <XMarkIcon className="ml-2 h-3 w-3" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Featured & Stock Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Featured Filter */}
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                   <StarIcon className="h-4 w-4 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Featured Only</p>
//                   <p className="text-xs text-gray-500">Show featured items</p>
//                 </div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filters.isFeatured === 'true'}
//                   onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
//               </label>
//             </div>

//             {/* Stock Filter */}
//             <div className="flex flex-col">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Stock Level
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   onClick={() => handleStockFilter('in-stock')}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.minStock === 1 && !filters.maxStock
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   In Stock
//                 </button>
//                 <button
//                   onClick={() => handleStockFilter('low-stock')}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.minStock === 1 && filters.maxStock === 10
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Low Stock
//                 </button>
//                 <button
//                   onClick={() => handleStockFilter('out-of-stock')}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     filters.minStock === 0 && filters.maxStock === 0
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Out of Stock
//                 </button>
//                 <button
//                   onClick={() => handleStockFilter('all-stock')}
//                   className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     !filters.minStock && !filters.maxStock
//                       ? 'bg-gray-200 text-gray-900'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   All Stock
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Sort Controls */}
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-700">Sort by:</span>
//               <select
//                 name="sortBy"
//                 value={filters.sortBy}
//                 onChange={handleInputChange}
//                 className="border-0 text-sm font-medium text-pink-600 focus:ring-0 focus:outline-none bg-transparent"
//               >
//                 {sortOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
//                 className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 {filters.sortOrder === 'asc' ? 
//                   <ChevronUpIcon className="h-5 w-5" /> : 
//                   <ChevronDownIcon className="h-5 w-5" />
//                 }
//               </button>
//             </div>
//           </div>

//           {/* Active Filters Display */}
//           {activeFilterCount > 0 && (
//             <div className="pt-4 border-t border-gray-200">
//               <div className="flex items-center flex-wrap gap-2">
//                 <span className="text-sm text-gray-500">Active filters:</span>
//                 {filters.search && (
//                   <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                     Search: "{filters.search}"
//                     <button
//                       onClick={() => onChange({ search: '' })}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.category && (
//                   <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
//                     {categories.find(c => c.value === filters.category)?.label}
//                     <button
//                       onClick={() => onChange({ category: '' })}
//                       className="ml-2 text-purple-600 hover:text-purple-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.minPrice && (
//                   <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                     Min: ${filters.minPrice}
//                     <button
//                       onClick={() => onChange({ minPrice: '' })}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.maxPrice && (
//                   <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                     Max: ${filters.maxPrice}
//                     <button
//                       onClick={() => onChange({ maxPrice: '' })}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.occasion.map(occasion => (
//                   <span key={occasion} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                     {occasions.find(o => o.value === occasion)?.label}
//                     <button
//                       onClick={() => handleOccasionChange(occasion)}
//                       className="ml-2 text-yellow-600 hover:text-yellow-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 ))}
//                 {filters.isAvailable && (
//                   <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                     {filters.isAvailable === 'true' ? 'Available' : 'Unavailable'}
//                     <button
//                       onClick={() => onChange({ isAvailable: '' })}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//                 {filters.isFeatured === 'true' && (
//                   <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                     Featured
//                     <button
//                       onClick={() => onChange({ isFeatured: '' })}
//                       className="ml-2 text-yellow-600 hover:text-yellow-800"
//                     >
//                       <XMarkIcon className="h-3 w-3" />
//                     </button>
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Mobile Filter Toggle Button */}
//       {isMobile && (
//         <button
//           onClick={() => setShowMobileFilters(true)}
//           className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           <FunnelIcon className="h-5 w-5" />
//           Filters & Sorting
//           {activeFilterCount > 0 && (
//             <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//               {activeFilterCount}
//             </span>
//           )}
//         </button>
//       )}

//       {/* Desktop Filters */}
//       {!isMobile && <DesktopFilters />}

//       {/* Mobile Filters Modal */}
//       {showMobileFilters && <MobileFilters />}
//     </>
//   );
// };

// export default ProductFilters;


// import React, { useState, useEffect } from 'react';
// import {
//   FunnelIcon,
//   XMarkIcon,
//   MagnifyingGlassIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   AdjustmentsHorizontalIcon,
//   ArrowPathIcon,
//   StarIcon
// } from '@heroicons/react/24/outline';

// // Move these arrays outside the component since they don't depend on props/state
// const categories = [
//   { value: 'roses', label: 'Roses', color: 'bg-red-100 text-red-800' },
//   { value: 'lilies', label: 'Lilies', color: 'bg-pink-100 text-pink-800' },
//   { value: 'tulips', label: 'Tulips', color: 'bg-purple-100 text-purple-800' },
//   { value: 'orchids', label: 'Orchids', color: 'bg-blue-100 text-blue-800' },
//   { value: 'mixed', label: 'Mixed Bouquets', color: 'bg-green-100 text-green-800' },
//   { value: 'seasonal', label: 'Seasonal', color: 'bg-yellow-100 text-yellow-800' },
//   { value: 'bouquets', label: 'Bouquets', color: 'bg-indigo-100 text-indigo-800' },
// ];

// const occasions = [
//   { value: 'birthday', label: 'Birthday', icon: '🎂' },
//   { value: 'anniversary', label: 'Anniversary', icon: '💝' },
//   { value: 'wedding', label: 'Wedding', icon: '💒' },
//   { value: 'valentine', label: "Valentine's", icon: '💘' },
//   { value: 'sympathy', label: 'Sympathy', icon: '🤍' },
//   { value: 'congratulations', label: 'Congratulations', icon: '🎉' },
//   { value: 'get-well', label: 'Get Well', icon: '💊' },
//   { value: 'thank-you', label: 'Thank You', icon: '🙏' },
// ];

// const sortOptions = [
//   { value: 'createdAt', label: 'Date Created' },
//   { value: 'updatedAt', label: 'Last Updated' },
//   { value: 'price', label: 'Price' },
//   { value: 'name', label: 'Name' },
//   { value: 'stock', label: 'Stock Level' },
//   { value: 'popularity', label: 'Popularity' },
//   { value: 'ratings', label: 'Rating' },
// ];

// // Mobile Filters Component (moved outside)
// const MobileFilters = ({ 
//   filters, 
//   onChange, 
//   onClose, 
//   activeFilterCount, 
//   handleClearAll,
//   handleInputChange,
//   handleCategoryChange,
//   handleOccasionChange,
//   handleStatusChange,
//   handleStockFilter,
//   getStatusLabel,
//   getStockFilterLabel
// }) => (
//   <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
//     <div className="flex min-h-full items-end justify-center p-0 sm:p-4">
//       <div className="relative w-full max-w-md transform rounded-t-2xl sm:rounded-2xl bg-white shadow-xl transition-all sm:my-8 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200 rounded-t-2xl z-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
//               <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//               {activeFilterCount > 0 && (
//                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//                   {activeFilterCount}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center space-x-3">
//               {activeFilterCount > 0 && (
//                 <button
//                   onClick={handleClearAll}
//                   className="text-sm text-pink-600 hover:text-pink-700"
//                 >
//                   Clear All
//                 </button>
//               )}
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters Content */}
//         <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
//           <div className="space-y-4 sm:space-y-6">
//             {/* Search */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search Products
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleInputChange}
//                   placeholder="Search by name, description..."
//                   className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Categories */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Categories
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {categories.map(cat => (
//                   <button
//                     key={cat.value}
//                     type="button"
//                     onClick={() => handleCategoryChange(cat.value)}
//                     className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
//                       filters.category === cat.value
//                         ? `${cat.color} ring-2 ring-offset-1 ring-current ring-opacity-30`
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {cat.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price Range
//               </label>
//               <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                 <div>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//                     <input
//                       type="number"
//                       name="minPrice"
//                       value={filters.minPrice}
//                       onChange={handleInputChange}
//                       placeholder="Min"
//                       min="0"
//                       step="0.01"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//                     <input
//                       type="number"
//                       name="maxPrice"
//                       value={filters.maxPrice}
//                       onChange={handleInputChange}
//                       placeholder="Max"
//                       min="0"
//                       step="0.01"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Occasions */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Occasions
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                 {occasions.map(occasion => (
//                   <button
//                     key={occasion.value}
//                     type="button"
//                     onClick={() => handleOccasionChange(occasion.value)}
//                     className={`flex flex-col items-center justify-center px-2 py-3 text-sm rounded-lg transition-colors min-h-[60px] ${
//                       filters.occasion.includes(occasion.value)
//                         ? 'bg-pink-600 text-white'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     <span className="text-lg mb-1">{occasion.icon}</span>
//                     <span className="text-xs text-center">{occasion.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Status & Stock */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Availability
//                 </label>
//                 <button
//                   onClick={handleStatusChange}
//                   className={`w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === 'true'
//                       ? 'bg-green-100 text-green-800'
//                       : filters.isAvailable === 'false'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-700'
//                   }`}
//                 >
//                   {getStatusLabel()}
//                 </button>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Stock Level
//                 </label>
//                 <select
//                   onChange={(e) => handleStockFilter(e.target.value)}
//                   value={getStockFilterLabel().toLowerCase().replace(' ', '-')}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 >
//                   <option value="all-stock">All Stock</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="low-stock">Low Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                 </select>
//               </div>
//             </div>

//             {/* Featured Filter */}
//             <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                   <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm sm:text-base font-medium text-gray-900">Featured Only</p>
//                   <p className="text-xs sm:text-sm text-gray-500">Show featured items</p>
//                 </div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filters.isFeatured === 'true'}
//                   onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
//               </label>
//             </div>

//             {/* Sort */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Sort By
//               </label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//                 <select
//                   name="sortBy"
//                   value={filters.sortBy}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 >
//                   {sortOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   name="sortOrder"
//                   value={filters.sortOrder}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 >
//                   <option value="desc">Descending</option>
//                   <option value="asc">Ascending</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-4 border-t border-gray-200">
//           <button
//             onClick={() => {
//               handleClearAll();
//               onClose();
//             }}
//             className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             <ArrowPathIcon className="h-4 w-4 mr-2" />
//             Clear All Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Desktop Filters Component (moved outside)
// const DesktopFilters = ({
//   filters,
//   onChange,
//   isCollapsed,
//   setIsCollapsed,
//   activeFilterCount,
//   handleClearAll,
//   handleInputChange,
//   handleOccasionChange,
//   handleStockFilter,
//   handleCategoryChange
// }) => (
//   <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${
//     isCollapsed ? 'pb-0' : ''
//   }`}>
//     {/* Header */}
//     <div 
//       className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
//       onClick={() => setIsCollapsed(!isCollapsed)}
//     >
//       <div className="flex items-center space-x-3">
//         <FunnelIcon className="h-5 w-5 text-gray-700" />
//         <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
//         {activeFilterCount > 0 && (
//           <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//             {activeFilterCount} active
//           </span>
//         )}
//       </div>
//       <div className="flex items-center space-x-3">
//         {activeFilterCount > 0 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleClearAll();
//             }}
//             className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors"
//           >
//             <ArrowPathIcon className="h-4 w-4 mr-1" />
//             Clear All
//           </button>
//         )}
//         <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
//           isCollapsed ? 'rotate-0' : 'rotate-180'
//         }`} />
//       </div>
//     </div>

//     {/* Filters Content - Hidden when collapsed */}
//     {!isCollapsed && (
//       <div className="p-4 space-y-4">
//         {/* Search Bar */}
//         <div>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               name="search"
//               value={filters.search}
//               onChange={handleInputChange}
//               placeholder="Search products by name or description..."
//               className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Main Filters Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//           {/* Categories */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Category
//             </label>
//             <div className="relative">
//               <select
//                 name="category"
//                 value={filters.category}
//                 onChange={handleInputChange}
//                 className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(cat => (
//                   <option key={cat.value} value={cat.value}>{cat.label}</option>
//                 ))}
//               </select>
//               <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {/* Min Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Min Price
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//               <input
//                 type="number"
//                 name="minPrice"
//                 value={filters.minPrice}
//                 onChange={handleInputChange}
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Max Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Max Price
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//               <input
//                 type="number"
//                 name="maxPrice"
//                 value={filters.maxPrice}
//                 onChange={handleInputChange}
//                 placeholder="999.99"
//                 min="0"
//                 step="0.01"
//                 className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Availability
//             </label>
//             <div className="grid grid-cols-3 gap-2">
//               <button
//                 onClick={() => onChange({ isAvailable: '' })}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.isAvailable === ''
//                     ? 'bg-gray-200 text-gray-900'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => onChange({ isAvailable: 'true' })}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.isAvailable === 'true'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Available
//               </button>
//               <button
//                 onClick={() => onChange({ isAvailable: 'false' })}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.isAvailable === 'false'
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Unavailable
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Occasions */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Occasions
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {occasions.map(occasion => (
//               <button
//                 key={occasion.value}
//                 type="button"
//                 onClick={() => handleOccasionChange(occasion.value)}
//                 className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
//                   filters.occasion.includes(occasion.value)
//                     ? 'bg-pink-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span className="mr-2">{occasion.icon}</span>
//                 {occasion.label}
//                 {filters.occasion.includes(occasion.value) && (
//                   <XMarkIcon className="ml-2 h-3 w-3" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Featured & Stock Filters */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* Featured Filter */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                 <StarIcon className="h-5 w-5 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">Featured Only</p>
//                 <p className="text-xs text-gray-500">Show featured items</p>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={filters.isFeatured === 'true'}
//                 onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
//             </label>
//           </div>

//           {/* Stock Filter */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Stock Level
//             </label>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//               <button
//                 onClick={() => handleStockFilter('in-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.minStock === 1 && !filters.maxStock
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 In Stock
//               </button>
//               <button
//                 onClick={() => handleStockFilter('low-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.minStock === 1 && filters.maxStock === 10
//                     ? 'bg-yellow-100 text-yellow-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Low Stock
//               </button>
//               <button
//                 onClick={() => handleStockFilter('out-of-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.minStock === 0 && filters.maxStock === 0
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Out of Stock
//               </button>
//               <button
//                 onClick={() => handleStockFilter('all-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   !filters.minStock && !filters.maxStock
//                     ? 'bg-gray-200 text-gray-900'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 All Stock
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sort Controls */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-700">Sort by:</span>
//             <select
//               name="sortBy"
//               value={filters.sortBy}
//               onChange={handleInputChange}
//               className="border-0 text-sm font-medium text-pink-600 focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
//             >
//               {sortOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
//               className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               aria-label={filters.sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
//             >
//               {filters.sortOrder === 'asc' ? 
//                 <ChevronUpIcon className="h-5 w-5" /> : 
//                 <ChevronDownIcon className="h-5 w-5" />
//               }
//             </button>
//           </div>
//         </div>

//         {/* Active Filters Display */}
//      // In the DesktopFilters component, find the active filters display section and fix the button closure:

// {/* Active Filters Display */}
// {activeFilterCount > 0 && (
//   <div className="pt-4 border-t border-gray-200">
//     <div className="flex flex-wrap items-center gap-2">
//       <span className="text-sm text-gray-500">Active filters:</span>
//       {filters.search && (
//         <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//           Search: "{filters.search}"
//           <button
//             onClick={() => onChange({ search: '' })}
//             className="ml-2 text-blue-600 hover:text-blue-800"
//             aria-label="Remove search filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       )}
//       {filters.category && (
//         <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
//           {categories.find(c => c.value === filters.category)?.label}
//           <button
//             onClick={() => onChange({ category: '' })}
//             className="ml-2 text-purple-600 hover:text-purple-800"
//             aria-label="Remove category filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       )}
//       {filters.minPrice && (
//         <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//           Min: ${filters.minPrice}
//           <button
//             onClick={() => onChange({ minPrice: '' })}
//             className="ml-2 text-green-600 hover:text-green-800"
//             aria-label="Remove minimum price filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       )}
//       {filters.maxPrice && (
//         <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//           Max: ${filters.maxPrice}
//           <button
//             onClick={() => onChange({ maxPrice: '' })}
//             className="ml-2 text-green-600 hover:text-green-800"
//             aria-label="Remove maximum price filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       )}
//       {filters.occasion.map(occasion => (
//         <span key={occasion} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//           {occasions.find(o => o.value === occasion)?.label}
//           <button
//             onClick={() => handleOccasionChange(occasion)}
//             className="ml-2 text-yellow-600 hover:text-yellow-800"
//             aria-label="Remove occasion filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       ))}
//       {filters.isAvailable && (
//         <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//           {filters.isAvailable === 'true' ? 'Available' : 'Unavailable'}
//           <button
//             onClick={() => onChange({ isAvailable: '' })}
//             className="ml-2 text-green-600 hover:text-green-800"
//             aria-label="Remove availability filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       )}
//       {filters.isFeatured === 'true' && (
//         <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//           Featured
//           <button
//             onClick={() => onChange({ isFeatured: '' })}
//             className="ml-2 text-yellow-600 hover:text-yellow-800"
//             aria-label="Remove featured filter"
//           >
//             <XMarkIcon className="h-3 w-3" />
//           </button>
//         </span>
//       )}
//     </div>
//   </div>
// )}
//       </div>
//     )}
//   </div>
// );

// const ProductFilters = ({ filters, onChange, onReset }) => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activeFilterCount, setActiveFilterCount] = useState(0);

//   // Calculate active filter count
//   useEffect(() => {
//     let count = 0;
//     if (filters.search) count++;
//     if (filters.category) count++;
//     if (filters.minPrice) count++;
//     if (filters.maxPrice) count++;
//     if (filters.occasion?.length > 0) count += filters.occasion.length;
//     if (filters.isAvailable) count++;
//     if (filters.isFeatured === 'true') count++;
//     if (filters.minStock || filters.maxStock) count++;
//     setActiveFilterCount(count);
//   }, [filters]);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//     return () => window.removeEventListener('resize', checkIfMobile);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     onChange({
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleOccasionChange = (occasion) => {
//     const newOccasions = filters.occasion.includes(occasion)
//       ? filters.occasion.filter(o => o !== occasion)
//       : [...filters.occasion, occasion];
    
//     onChange({ occasion: newOccasions });
//   };

//   const handleCategoryChange = (category) => {
//     onChange({ category: filters.category === category ? '' : category });
//   };

//   const handleStatusChange = () => {
//     let newStatus = '';
//     if (filters.isAvailable === '') newStatus = 'true';
//     else if (filters.isAvailable === 'true') newStatus = 'false';
//     onChange({ isAvailable: newStatus });
//   };

//   const handleStockFilter = (filter) => {
//     const stockFilters = {
//       'in-stock': { minStock: 1 },
//       'low-stock': { minStock: 1, maxStock: 10 },
//       'out-of-stock': { minStock: 0, maxStock: 0 },
//       'all-stock': { minStock: '', maxStock: '' }
//     };
//     onChange(stockFilters[filter]);
//   };

//   const getStatusLabel = () => {
//     if (filters.isAvailable === 'true') return 'Available';
//     if (filters.isAvailable === 'false') return 'Unavailable';
//     return 'All Status';
//   };

//   const getStockFilterLabel = () => {
//     if (filters.minStock === 1 && !filters.maxStock) return 'In Stock';
//     if (filters.minStock === 1 && filters.maxStock === 10) return 'Low Stock';
//     if (filters.minStock === 0 && filters.maxStock === 0) return 'Out of Stock';
//     return 'All Stock';
//   };

//   const handleClearAll = () => {
//     onChange({
//       search: '',
//       category: '',
//       minPrice: '',
//       maxPrice: '',
//       occasion: [],
//       isAvailable: '',
//       isFeatured: '',
//       minStock: '',
//       maxStock: '',
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     });
//     onReset && onReset();
//   };

//   // Tablet Filter Toggle Button
//   const TabletFilterButton = () => (
//     <button
//       onClick={() => setShowMobileFilters(true)}
//       className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//     >
//       <FunnelIcon className="h-5 w-5" />
//       Filters & Sorting
//       {activeFilterCount > 0 && (
//         <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//           {activeFilterCount}
//         </span>
//       )}
//     </button>
//   );

//   return (
//     <>
//       {/* Tablet & Mobile Filter Toggle Button */}
//       <TabletFilterButton />

//       {/* Desktop Filters */}
//       <div className="hidden md:block">
//         <DesktopFilters
//           filters={filters}
//           onChange={onChange}
//           isCollapsed={isCollapsed}
//           setIsCollapsed={setIsCollapsed}
//           activeFilterCount={activeFilterCount}
//           handleClearAll={handleClearAll}
//           handleInputChange={handleInputChange}
//           handleOccasionChange={handleOccasionChange}
//           handleStockFilter={handleStockFilter}
//           handleCategoryChange={handleCategoryChange}
//         />
//       </div>

//       {/* Mobile & Tablet Filters Modal */}
//       {showMobileFilters && (
//         <MobileFilters
//           filters={filters}
//           onChange={onChange}
//           onClose={() => setShowMobileFilters(false)}
//           activeFilterCount={activeFilterCount}
//           handleClearAll={handleClearAll}
//           handleInputChange={handleInputChange}
//           handleCategoryChange={handleCategoryChange}
//           handleOccasionChange={handleOccasionChange}
//           handleStatusChange={handleStatusChange}
//           handleStockFilter={handleStockFilter}
//           getStatusLabel={getStatusLabel}
//           getStockFilterLabel={getStockFilterLabel}
//         />
//       )}
//     </>
//   );
// };

// export default ProductFilters;

// import React, { useState, useEffect } from 'react';
// import {
//   FunnelIcon,
//   XMarkIcon,
//   MagnifyingGlassIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   AdjustmentsHorizontalIcon,
//   ArrowPathIcon,
//   StarIcon
// } from '@heroicons/react/24/outline';

// // Move these arrays outside the component since they don't depend on props/state
// const categories = [
//   { value: 'roses', label: 'Roses', color: 'bg-red-100 text-red-800' },
//   { value: 'lilies', label: 'Lilies', color: 'bg-pink-100 text-pink-800' },
//   { value: 'tulips', label: 'Tulips', color: 'bg-purple-100 text-purple-800' },
//   { value: 'orchids', label: 'Orchids', color: 'bg-blue-100 text-blue-800' },
//   { value: 'mixed', label: 'Mixed Bouquets', color: 'bg-green-100 text-green-800' },
//   { value: 'seasonal', label: 'Seasonal', color: 'bg-yellow-100 text-yellow-800' },
//   { value: 'bouquets', label: 'Bouquets', color: 'bg-indigo-100 text-indigo-800' },
// ];

// const occasions = [
//   { value: 'birthday', label: 'Birthday', icon: '🎂' },
//   { value: 'anniversary', label: 'Anniversary', icon: '💝' },
//   { value: 'wedding', label: 'Wedding', icon: '💒' },
//   { value: 'valentine', label: "Valentine's", icon: '💘' },
//   { value: 'sympathy', label: 'Sympathy', icon: '🤍' },
//   { value: 'congratulations', label: 'Congratulations', icon: '🎉' },
//   { value: 'get-well', label: 'Get Well', icon: '💊' },
//   { value: 'thank-you', label: 'Thank You', icon: '🙏' },
// ];

// const sortOptions = [
//   { value: 'createdAt', label: 'Date Created' },
//   { value: 'updatedAt', label: 'Last Updated' },
//   { value: 'price', label: 'Price' },
//   { value: 'name', label: 'Name' },
//   { value: 'stock', label: 'Stock Level' },
//   { value: 'popularity', label: 'Popularity' },
//   { value: 'ratings', label: 'Rating' },
// ];

// // Tablet Filter Toggle Button (moved outside)
// const TabletFilterButton = ({ setShowMobileFilters, activeFilterCount }) => (
//   <button
//     onClick={() => setShowMobileFilters(true)}
//     className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//   >
//     <FunnelIcon className="h-5 w-5" />
//     Filters & Sorting
//     {activeFilterCount > 0 && (
//       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//         {activeFilterCount}
//       </span>
//     )}
//   </button>
// );

// // Mobile Filters Component (moved outside)
// const MobileFilters = ({ 
//   filters, 
//   onChange, 
//   onClose, 
//   activeFilterCount, 
//   handleClearAll,
//   handleInputChange,
//   handleCategoryChange,
//   handleOccasionChange,
//   handleStatusChange,
//   handleStockFilter,
//   getStatusLabel,
//   getStockFilterLabel
// }) => (
//   <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
//     <div className="flex min-h-full items-end justify-center p-0 sm:p-4">
//       <div className="relative w-full max-w-md transform rounded-t-2xl sm:rounded-2xl bg-white shadow-xl transition-all sm:my-8 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200 rounded-t-2xl z-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
//               <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//               {activeFilterCount > 0 && (
//                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//                   {activeFilterCount}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center space-x-3">
//               {activeFilterCount > 0 && (
//                 <button
//                   onClick={handleClearAll}
//                   className="text-sm text-pink-600 hover:text-pink-700"
//                 >
//                   Clear All
//                 </button>
//               )}
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters Content */}
//         <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
//           <div className="space-y-4 sm:space-y-6">
//             {/* Search */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search Products
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleInputChange}
//                   placeholder="Search by name, description..."
//                   className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Categories */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Categories
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {categories.map(cat => (
//                   <button
//                     key={cat.value}
//                     type="button"
//                     onClick={() => handleCategoryChange(cat.value)}
//                     className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
//                       filters.category === cat.value
//                         ? `${cat.color} ring-2 ring-offset-1 ring-current ring-opacity-30`
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {cat.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price Range
//               </label>
//               <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                 <div>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//                     <input
//                       type="number"
//                       name="minPrice"
//                       value={filters.minPrice}
//                       onChange={handleInputChange}
//                       placeholder="Min"
//                       min="0"
//                       step="0.01"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//                     <input
//                       type="number"
//                       name="maxPrice"
//                       value={filters.maxPrice}
//                       onChange={handleInputChange}
//                       placeholder="Max"
//                       min="0"
//                       step="0.01"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Occasions */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Occasions
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                 {occasions.map(occasion => (
//                   <button
//                     key={occasion.value}
//                     type="button"
//                     onClick={() => handleOccasionChange(occasion.value)}
//                     className={`flex flex-col items-center justify-center px-2 py-3 text-sm rounded-lg transition-colors min-h-[60px] ${
//                       filters.occasion.includes(occasion.value)
//                         ? 'bg-pink-600 text-white'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     <span className="text-lg mb-1">{occasion.icon}</span>
//                     <span className="text-xs text-center">{occasion.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Status & Stock */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Availability
//                 </label>
//                 <button
//                   onClick={handleStatusChange}
//                   className={`w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
//                     filters.isAvailable === 'true'
//                       ? 'bg-green-100 text-green-800'
//                       : filters.isAvailable === 'false'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-700'
//                   }`}
//                 >
//                   {getStatusLabel()}
//                 </button>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Stock Level
//                 </label>
//                 <select
//                   onChange={(e) => handleStockFilter(e.target.value)}
//                   value={getStockFilterLabel().toLowerCase().replace(' ', '-')}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 >
//                   <option value="all-stock">All Stock</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="low-stock">Low Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                 </select>
//               </div>
//             </div>

//             {/* Featured Filter */}
//             <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                   <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm sm:text-base font-medium text-gray-900">Featured Only</p>
//                   <p className="text-xs sm:text-sm text-gray-500">Show featured items</p>
//                 </div>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filters.isFeatured === 'true'}
//                   onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
//               </label>
//             </div>

//             {/* Sort */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Sort By
//               </label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//                 <select
//                   name="sortBy"
//                   value={filters.sortBy}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 >
//                   {sortOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   name="sortOrder"
//                   value={filters.sortOrder}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                 >
//                   <option value="desc">Descending</option>
//                   <option value="asc">Ascending</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-4 border-t border-gray-200">
//           <button
//             onClick={() => {
//               handleClearAll();
//               onClose();
//             }}
//             className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             <ArrowPathIcon className="h-4 w-4 mr-2" />
//             Clear All Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Desktop Filters Component (moved outside)
// const DesktopFilters = ({
//   filters,
//   onChange,
//   isCollapsed,
//   setIsCollapsed,
//   activeFilterCount,
//   handleClearAll,
//   handleInputChange,
//   handleOccasionChange,
//   handleStockFilter,
//   handleCategoryChange
// }) => (
//   <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${
//     isCollapsed ? 'pb-0' : ''
//   }`}>
//     {/* Header */}
//     <div 
//       className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
//       onClick={() => setIsCollapsed(!isCollapsed)}
//     >
//       <div className="flex items-center space-x-3">
//         <FunnelIcon className="h-5 w-5 text-gray-700" />
//         <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
//         {activeFilterCount > 0 && (
//           <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
//             {activeFilterCount} active
//           </span>
//         )}
//       </div>
//       <div className="flex items-center space-x-3">
//         {activeFilterCount > 0 && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleClearAll();
//             }}
//             className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors"
//           >
//             <ArrowPathIcon className="h-4 w-4 mr-1" />
//             Clear All
//           </button>
//         )}
//         <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
//           isCollapsed ? 'rotate-0' : 'rotate-180'
//         }`} />
//       </div>
//     </div>

//     {/* Filters Content - Hidden when collapsed */}
//     {!isCollapsed && (
//       <div className="p-4 space-y-4">
//         {/* Search Bar */}
//         <div>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               name="search"
//               value={filters.search}
//               onChange={handleInputChange}
//               placeholder="Search products by name or description..."
//               className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Main Filters Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//           {/* Categories */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Category
//             </label>
//             <div className="relative">
//               <select
//                 name="category"
//                 value={filters.category}
//                 onChange={handleInputChange}
//                 className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(cat => (
//                   <option key={cat.value} value={cat.value}>{cat.label}</option>
//                 ))}
//               </select>
//               <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {/* Min Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Min Price
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//               <input
//                 type="number"
//                 name="minPrice"
//                 value={filters.minPrice}
//                 onChange={handleInputChange}
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Max Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Max Price
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
//               <input
//                 type="number"
//                 name="maxPrice"
//                 value={filters.maxPrice}
//                 onChange={handleInputChange}
//                 placeholder="999.99"
//                 min="0"
//                 step="0.01"
//                 className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Availability
//             </label>
//             <div className="grid grid-cols-3 gap-2">
//               <button
//                 onClick={() => onChange({ isAvailable: '' })}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.isAvailable === ''
//                     ? 'bg-gray-200 text-gray-900'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => onChange({ isAvailable: 'true' })}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.isAvailable === 'true'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Available
//               </button>
//               <button
//                 onClick={() => onChange({ isAvailable: 'false' })}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.isAvailable === 'false'
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Unavailable
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Occasions */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Occasions
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {occasions.map(occasion => (
//               <button
//                 key={occasion.value}
//                 type="button"
//                 onClick={() => handleOccasionChange(occasion.value)}
//                 className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
//                   filters.occasion.includes(occasion.value)
//                     ? 'bg-pink-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span className="mr-2">{occasion.icon}</span>
//                 {occasion.label}
//                 {filters.occasion.includes(occasion.value) && (
//                   <XMarkIcon className="ml-2 h-3 w-3" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Featured & Stock Filters */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* Featured Filter */}
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
//                 <StarIcon className="h-5 w-5 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">Featured Only</p>
//                 <p className="text-xs text-gray-500">Show featured items</p>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={filters.isFeatured === 'true'}
//                 onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
//             </label>
//           </div>

//           {/* Stock Filter */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Stock Level
//             </label>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//               <button
//                 onClick={() => handleStockFilter('in-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.minStock === 1 && !filters.maxStock
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 In Stock
//               </button>
//               <button
//                 onClick={() => handleStockFilter('low-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.minStock === 1 && filters.maxStock === 10
//                     ? 'bg-yellow-100 text-yellow-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Low Stock
//               </button>
//               <button
//                 onClick={() => handleStockFilter('out-of-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   filters.minStock === 0 && filters.maxStock === 0
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Out of Stock
//               </button>
//               <button
//                 onClick={() => handleStockFilter('all-stock')}
//                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                   !filters.minStock && !filters.maxStock
//                     ? 'bg-gray-200 text-gray-900'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 All Stock
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sort Controls */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-700">Sort by:</span>
//             <select
//               name="sortBy"
//               value={filters.sortBy}
//               onChange={handleInputChange}
//               className="border-0 text-sm font-medium text-pink-600 focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
//             >
//               {sortOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
//               className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               aria-label={filters.sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
//             >
//               {filters.sortOrder === 'asc' ? 
//                 <ChevronUpIcon className="h-5 w-5" /> : 
//                 <ChevronDownIcon className="h-5 w-5" />
//               }
//             </button>
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         {activeFilterCount > 0 && (
//           <div className="pt-4 border-t border-gray-200">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-sm text-gray-500">Active filters:</span>
//               {filters.search && (
//                 <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                   Search: "{filters.search}"
//                   <button
//                     onClick={() => onChange({ search: '' })}
//                     className="ml-2 text-blue-600 hover:text-blue-800"
//                     aria-label="Remove search filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.category && (
//                 <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
//                   {categories.find(c => c.value === filters.category)?.label}
//                   <button
//                     onClick={() => onChange({ category: '' })}
//                     className="ml-2 text-purple-600 hover:text-purple-800"
//                     aria-label="Remove category filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.minPrice && (
//                 <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                   Min: ${filters.minPrice}
//                   <button
//                     onClick={() => onChange({ minPrice: '' })}
//                     className="ml-2 text-green-600 hover:text-green-800"
//                     aria-label="Remove minimum price filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.maxPrice && (
//                 <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                   Max: ${filters.maxPrice}
//                   <button
//                     onClick={() => onChange({ maxPrice: '' })}
//                     className="ml-2 text-green-600 hover:text-green-800"
//                     aria-label="Remove maximum price filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.occasion.map(occasion => (
//                 <span key={occasion} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                   {occasions.find(o => o.value === occasion)?.label}
//                   <button
//                     onClick={() => handleOccasionChange(occasion)}
//                     className="ml-2 text-yellow-600 hover:text-yellow-800"
//                     aria-label="Remove occasion filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               ))}
//               {filters.isAvailable && (
//                 <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                   {filters.isAvailable === 'true' ? 'Available' : 'Unavailable'}
//                   <button
//                     onClick={() => onChange({ isAvailable: '' })}
//                     className="ml-2 text-green-600 hover:text-green-800"
//                     aria-label="Remove availability filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               )}
//               {filters.isFeatured === 'true' && (
//                 <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                   Featured
//                   <button
//                     onClick={() => onChange({ isFeatured: '' })}
//                     className="ml-2 text-yellow-600 hover:text-yellow-800"
//                     aria-label="Remove featured filter"
//                   >
//                     <XMarkIcon className="h-3 w-3" />
//                   </button>
//                 </span>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     )}
//   </div>
// );

// const ProductFilters = ({ filters, onChange, onReset }) => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activeFilterCount, setActiveFilterCount] = useState(0);

//   // Calculate active filter count
//   useEffect(() => {
//     let count = 0;
//     if (filters.search) count++;
//     if (filters.category) count++;
//     if (filters.minPrice) count++;
//     if (filters.maxPrice) count++;
//     if (filters.occasion?.length > 0) count += filters.occasion.length;
//     if (filters.isAvailable) count++;
//     if (filters.isFeatured === 'true') count++;
//     if (filters.minStock || filters.maxStock) count++;
//     setActiveFilterCount(count);
//   }, [filters]);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//     return () => window.removeEventListener('resize', checkIfMobile);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     onChange({
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleOccasionChange = (occasion) => {
//     const newOccasions = filters.occasion.includes(occasion)
//       ? filters.occasion.filter(o => o !== occasion)
//       : [...filters.occasion, occasion];
    
//     onChange({ occasion: newOccasions });
//   };

//   const handleCategoryChange = (category) => {
//     onChange({ category: filters.category === category ? '' : category });
//   };

//   const handleStatusChange = () => {
//     let newStatus = '';
//     if (filters.isAvailable === '') newStatus = 'true';
//     else if (filters.isAvailable === 'true') newStatus = 'false';
//     onChange({ isAvailable: newStatus });
//   };

//   const handleStockFilter = (filter) => {
//     const stockFilters = {
//       'in-stock': { minStock: 1 },
//       'low-stock': { minStock: 1, maxStock: 10 },
//       'out-of-stock': { minStock: 0, maxStock: 0 },
//       'all-stock': { minStock: '', maxStock: '' }
//     };
//     onChange(stockFilters[filter]);
//   };

//   const getStatusLabel = () => {
//     if (filters.isAvailable === 'true') return 'Available';
//     if (filters.isAvailable === 'false') return 'Unavailable';
//     return 'All Status';
//   };

//   const getStockFilterLabel = () => {
//     if (filters.minStock === 1 && !filters.maxStock) return 'In Stock';
//     if (filters.minStock === 1 && filters.maxStock === 10) return 'Low Stock';
//     if (filters.minStock === 0 && filters.maxStock === 0) return 'Out of Stock';
//     return 'All Stock';
//   };

//   const handleClearAll = () => {
//     onChange({
//       search: '',
//       category: '',
//       minPrice: '',
//       maxPrice: '',
//       occasion: [],
//       isAvailable: '',
//       isFeatured: '',
//       minStock: '',
//       maxStock: '',
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     });
//     onReset && onReset();
//   };

//   return (
//     <>
//       {/* Tablet & Mobile Filter Toggle Button */}
//       <TabletFilterButton 
//         setShowMobileFilters={setShowMobileFilters}
//         activeFilterCount={activeFilterCount}
//       />

//       {/* Desktop Filters */}
//       <div className="hidden md:block">
//         <DesktopFilters
//           filters={filters}
//           onChange={onChange}
//           isCollapsed={isCollapsed}
//           setIsCollapsed={setIsCollapsed}
//           activeFilterCount={activeFilterCount}
//           handleClearAll={handleClearAll}
//           handleInputChange={handleInputChange}
//           handleOccasionChange={handleOccasionChange}
//           handleStockFilter={handleStockFilter}
//           handleCategoryChange={handleCategoryChange}
//         />
//       </div>

//       {/* Mobile & Tablet Filters Modal */}
//       {showMobileFilters && (
//         <MobileFilters
//           filters={filters}
//           onChange={onChange}
//           onClose={() => setShowMobileFilters(false)}
//           activeFilterCount={activeFilterCount}
//           handleClearAll={handleClearAll}
//           handleInputChange={handleInputChange}
//           handleCategoryChange={handleCategoryChange}
//           handleOccasionChange={handleOccasionChange}
//           handleStatusChange={handleStatusChange}
//           handleStockFilter={handleStockFilter}
//           getStatusLabel={getStatusLabel}
//           getStockFilterLabel={getStockFilterLabel}
//         />
//       )}
//     </>
//   );
// };

// export default ProductFilters;



import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Move these arrays outside the component since they don't depend on props/state
const categories = [
  { value: 'roses', label: 'Roses', color: 'bg-red-100 text-red-800' },
  { value: 'lilies', label: 'Lilies', color: 'bg-pink-100 text-pink-800' },
  { value: 'tulips', label: 'Tulips', color: 'bg-purple-100 text-purple-800' },
  { value: 'orchids', label: 'Orchids', color: 'bg-blue-100 text-blue-800' },
  { value: 'mixed', label: 'Mixed Bouquets', color: 'bg-green-100 text-green-800' },
  { value: 'seasonal', label: 'Seasonal', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'bouquets', label: 'Bouquets', color: 'bg-indigo-100 text-indigo-800' },
];

const occasions = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💝' },
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'valentine', label: "Valentine's", icon: '💘' },
  { value: 'sympathy', label: 'Sympathy', icon: '🤍' },
  { value: 'congratulations', label: 'Congratulations', icon: '🎉' },
  { value: 'get-well', label: 'Get Well', icon: '💊' },
  { value: 'thank-you', label: 'Thank You', icon: '🙏' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'price', label: 'Price' },
  { value: 'name', label: 'Name' },
  { value: 'stock', label: 'Stock Level' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'ratings', label: 'Rating' },
];

// Tablet Filter Toggle Button (moved outside)
const TabletFilterButton = ({ setShowMobileFilters, activeFilterCount }) => (
  <button
    onClick={() => setShowMobileFilters(true)}
    className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
  >
    <FunnelIcon className="h-5 w-5" />
    Filters & Sorting
    {activeFilterCount > 0 && (
      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
        {activeFilterCount}
      </span>
    )}
  </button>
);

// Mobile Filters Component (moved outside)
const MobileFilters = ({ 
  filters, 
  onChange, 
  onClose, 
  activeFilterCount, 
  handleClearAll,
  handleInputChange,
  handleCategoryChange,
  handleOccasionChange,
  handleStatusChange,
  handleStockFilter,
  getStatusLabel,
  getStockFilterLabel
}) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
    <div className="flex min-h-full items-end justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-md transform rounded-t-2xl sm:rounded-2xl bg-white shadow-xl transition-all sm:my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="space-y-4 sm:space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleInputChange}
                  placeholder="Search by name, description..."
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center ${
                      filters.category === cat.value
                        ? `${cat.color} ring-2 ring-offset-1 ring-current ring-opacity-30`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range - FIXED RESPONSIVE LAYOUT */}
            <div  >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleInputChange}
                      placeholder="Min"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleInputChange}
                      placeholder="Max"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              {/* Price Range Slider for better UX */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>${filters.minPrice || 0}</span>
                  <span>${filters.maxPrice || 100}</span>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.minPrice || 0}
                      onChange={(e) => onChange({ minPrice: e.target.value })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="absolute w-full h-1 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occasions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {occasions.map(occasion => (
                  <button
                    key={occasion.value}
                    type="button"
                    onClick={() => handleOccasionChange(occasion.value)}
                    className={`flex flex-col items-center justify-center px-2 py-3 text-sm rounded-lg transition-colors min-h-[60px] ${
                      filters.occasion.includes(occasion.value)
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg mb-1">{occasion.icon}</span>
                    <span className="text-xs text-center">{occasion.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <button
                  onClick={handleStatusChange}
                  className={`w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    filters.isAvailable === 'true'
                      ? 'bg-green-100 text-green-800'
                      : filters.isAvailable === 'false'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {getStatusLabel()}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Level
                </label>
                <select
                  onChange={(e) => handleStockFilter(e.target.value)}
                  value={getStockFilterLabel().toLowerCase().replace(' ', '-')}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all-stock">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Featured Filter */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">Featured Only</p>
                  <p className="text-xs sm:text-sm text-gray-500">Show featured items</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isFeatured === 'true'}
                  onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              handleClearAll();
              onClose();
            }}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Desktop Filters Component (moved outside)
const DesktopFilters = ({
  filters,
  onChange,
  isCollapsed,
  setIsCollapsed,
  activeFilterCount,
  handleClearAll,
  handleInputChange,
  handleOccasionChange,
  handleStockFilter,
  handleCategoryChange
}) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${
    isCollapsed ? 'pb-0' : ''
  }`}>
    {/* Header */}
    <div 
      className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <div className="flex items-center space-x-3">
        <FunnelIcon className="h-5 w-5 text-gray-700" />
        <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            {activeFilterCount} active
          </span>
        )}
      </div>
      <div className="flex items-center space-x-3">
        {activeFilterCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
        <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
          isCollapsed ? 'rotate-0' : 'rotate-180'
        }`} />
      </div>
    </div>

    {/* Filters Content - Hidden when collapsed */}
    {!isCollapsed && (
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search products by name or description..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Main Filters Grid - IMPROVED RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price Range - FIXED RESPONSIVE LAYOUT */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    placeholder="999.99"
                    min="0"
                    step="0.01"
                    className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {/* Optional: Price Range Slider for better UX */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>${filters.minPrice || 0}</span>
                <span>${filters.maxPrice || 100}</span>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.minPrice || 0}
                    onChange={(e) => onChange({ minPrice: e.target.value })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="absolute w-full h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChange({ isAvailable: '' })}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.isAvailable === ''
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onChange({ isAvailable: 'true' })}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.isAvailable === 'true'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => onChange({ isAvailable: 'false' })}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.isAvailable === 'false'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unavailable
              </button>
            </div>
          </div>
        </div>

        {/* Occasions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occasions
          </label>
          <div className="flex flex-wrap gap-2">
            {occasions.map(occasion => (
              <button
                key={occasion.value}
                type="button"
                onClick={() => handleOccasionChange(occasion.value)}
                className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                  filters.occasion.includes(occasion.value)
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{occasion.icon}</span>
                {occasion.label}
                {filters.occasion.includes(occasion.value) && (
                  <XMarkIcon className="ml-2 h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Featured & Stock Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Featured Filter */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <StarIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Featured Only</p>
                <p className="text-xs text-gray-500">Show featured items</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isFeatured === 'true'}
                onChange={(e) => onChange({ isFeatured: e.target.checked ? 'true' : '' })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          {/* Stock Filter */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleStockFilter('in-stock')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.minStock === 1 && !filters.maxStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => handleStockFilter('low-stock')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.minStock === 1 && filters.maxStock === 10
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => handleStockFilter('out-of-stock')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.minStock === 0 && filters.maxStock === 0
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Out of Stock
              </button>
              <button
                onClick={() => handleStockFilter('all-stock')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !filters.minStock && !filters.maxStock
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Stock
              </button>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Sort by:</span>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="border-0 text-sm font-medium text-pink-600 focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={filters.sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
            >
              {filters.sortOrder === 'asc' ? 
                <ChevronUpIcon className="h-5 w-5" /> : 
                <ChevronDownIcon className="h-5 w-5" />
              }
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Search: "{filters.search}"
                  <button
                    onClick={() => onChange({ search: '' })}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    aria-label="Remove search filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {categories.find(c => c.value === filters.category)?.label}
                  <button
                    onClick={() => onChange({ category: '' })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                    aria-label="Remove category filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.minPrice && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Min: ${filters.minPrice}
                  <button
                    onClick={() => onChange({ minPrice: '' })}
                    className="ml-2 text-green-600 hover:text-green-800"
                    aria-label="Remove minimum price filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Max: ${filters.maxPrice}
                  <button
                    onClick={() => onChange({ maxPrice: '' })}
                    className="ml-2 text-green-600 hover:text-green-800"
                    aria-label="Remove maximum price filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.occasion.map(occasion => (
                <span key={occasion} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  {occasions.find(o => o.value === occasion)?.label}
                  <button
                    onClick={() => handleOccasionChange(occasion)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                    aria-label="Remove occasion filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {filters.isAvailable && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {filters.isAvailable === 'true' ? 'Available' : 'Unavailable'}
                  <button
                    onClick={() => onChange({ isAvailable: '' })}
                    className="ml-2 text-green-600 hover:text-green-800"
                    aria-label="Remove availability filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.isFeatured === 'true' && (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  Featured
                  <button
                    onClick={() => onChange({ isFeatured: '' })}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                    aria-label="Remove featured filter"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

const ProductFilters = ({ filters, onChange, onReset }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Calculate active filter count
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.occasion?.length > 0) count += filters.occasion.length;
    if (filters.isAvailable) count++;
    if (filters.isFeatured === 'true') count++;
    if (filters.minStock || filters.maxStock) count++;
    setActiveFilterCount(count);
  }, [filters]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOccasionChange = (occasion) => {
    const newOccasions = filters.occasion.includes(occasion)
      ? filters.occasion.filter(o => o !== occasion)
      : [...filters.occasion, occasion];
    
    onChange({ occasion: newOccasions });
  };

  const handleCategoryChange = (category) => {
    onChange({ category: filters.category === category ? '' : category });
  };

  const handleStatusChange = () => {
    let newStatus = '';
    if (filters.isAvailable === '') newStatus = 'true';
    else if (filters.isAvailable === 'true') newStatus = 'false';
    onChange({ isAvailable: newStatus });
  };

  const handleStockFilter = (filter) => {
    const stockFilters = {
      'in-stock': { minStock: 1 },
      'low-stock': { minStock: 1, maxStock: 10 },
      'out-of-stock': { minStock: 0, maxStock: 0 },
      'all-stock': { minStock: '', maxStock: '' }
    };
    onChange(stockFilters[filter]);
  };

  const getStatusLabel = () => {
    if (filters.isAvailable === 'true') return 'Available';
    if (filters.isAvailable === 'false') return 'Unavailable';
    return 'All Status';
  };

  const getStockFilterLabel = () => {
    if (filters.minStock === 1 && !filters.maxStock) return 'In Stock';
    if (filters.minStock === 1 && filters.maxStock === 10) return 'Low Stock';
    if (filters.minStock === 0 && filters.maxStock === 0) return 'Out of Stock';
    return 'All Stock';
  };

  const handleClearAll = () => {
    onChange({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      occasion: [],
      isAvailable: '',
      isFeatured: '',
      minStock: '',
      maxStock: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    onReset && onReset();
  };

  return (
    <>
      {/* Tablet & Mobile Filter Toggle Button */}
      <TabletFilterButton 
        setShowMobileFilters={setShowMobileFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <DesktopFilters
          filters={filters}
          onChange={onChange}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeFilterCount={activeFilterCount}
          handleClearAll={handleClearAll}
          handleInputChange={handleInputChange}
          handleOccasionChange={handleOccasionChange}
          handleStockFilter={handleStockFilter}
          handleCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Mobile & Tablet Filters Modal */}
      {showMobileFilters && (
        <MobileFilters
          filters={filters}
          onChange={onChange}
          onClose={() => setShowMobileFilters(false)}
          activeFilterCount={activeFilterCount}
          handleClearAll={handleClearAll}
          handleInputChange={handleInputChange}
          handleCategoryChange={handleCategoryChange}
          handleOccasionChange={handleOccasionChange}
          handleStatusChange={handleStatusChange}
          handleStockFilter={handleStockFilter}
          getStatusLabel={getStatusLabel}
          getStockFilterLabel={getStockFilterLabel}
        />
      )}
    </>
  );
};

export default ProductFilters;