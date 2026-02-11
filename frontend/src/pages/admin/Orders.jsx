import { useState, useEffect } from 'react';
import OrderTable from '../../components/admin/OrderTable';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { adminService } from '../../services/adminService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminService.getOrders();
      setOrders(response.data);
    } catch (error) {
      showAlert('error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, data) => {
    try {
      const response = await adminService.updateOrderStatus(orderId, data);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
      showAlert('success', 'Order status updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    // Navigate to order detail page or show modal
    console.log('View order:', order);
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  // Calculate stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.isPaid)
      .reduce((sum, order) => sum + order.totalPrice, 0)
  };

  if (loading) return <Loader />;

  return (
    <div>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">
          Manage and track customer orders, update status, and process refunds.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900">{orderStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600">{orderStats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Processing</p>
          <p className="text-2xl font-semibold text-blue-600">{orderStats.processing}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-semibold text-green-600">{orderStats.delivered}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-2xl font-semibold text-red-600">{orderStats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${orderStats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      
      <OrderTable 
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
        onView={handleViewOrder}
      />
    </div>
  );
};

export default Orders;

// import { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import OrderTable from '../../components/admin/OrderTable';
// import Loader from '../../components/common/Loader';
// import Alert from '../../components/common/Alert';
// import FilterBar from '../../components/common/FilterBar';
// import SearchInput from '../../components/common/SearchInput';
// import { adminService } from '../../services/adminService';
// import {
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   ArrowPathIcon,
//   EyeIcon,
//   DocumentArrowDownIcon,
//   CalendarIcon,
//   ChevronDownIcon,
// } from '@heroicons/react/24/outline';
// import {
//   ChartBarIcon,
//   ShoppingCartIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   XCircleIcon,
//   TruckIcon,
// } from '@heroicons/react/24/solid';
// import { formatDate, formatCurrency } from '../../utils/formatters';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     status: 'all',
//     dateRange: 'all',
//     sortBy: 'newest',
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [stats, setStats] = useState(null);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [isExporting, setIsExporting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     filterAndSortOrders();
//   }, [orders, searchTerm, filters]);

//   const fetchOrders = async () => {
//     try {
//       const response = await adminService.getOrders();
//       setOrders(response.data);
//       setFilteredOrders(response.data);
//       calculateStats(response.data);
//     } catch (error) {
//       showAlert('error', 'Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (orderList) => {
//     const stats = {
//       total: orderList.length,
//       pending: orderList.filter(o => o.orderStatus === 'pending').length,
//       processing: orderList.filter(o => o.orderStatus === 'processing').length,
//       shipped: orderList.filter(o => o.orderStatus === 'shipped').length,
//       delivered: orderList.filter(o => o.orderStatus === 'delivered').length,
//       cancelled: orderList.filter(o => o.orderStatus === 'cancelled').length,
//       totalRevenue: orderList
//         .filter(o => o.isPaid)
//         .reduce((sum, order) => sum + order.totalPrice, 0),
//       avgOrderValue: 0,
//       todayOrders: orderList.filter(o => 
//         new Date(o.createdAt).toDateString() === new Date().toDateString()
//       ).length
//     };

//     if (stats.total > 0) {
//       stats.avgOrderValue = stats.totalRevenue / stats.total;
//     }

//     setStats(stats);
//   };

//   const filterAndSortOrders = () => {
//     let result = [...orders];

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(order => 
//         order._id?.toLowerCase().includes(term) ||
//         order.user?.name?.toLowerCase().includes(term) ||
//         order.user?.email?.toLowerCase().includes(term)
//       );
//     }

//     // Apply status filter
//     if (filters.status !== 'all') {
//       result = result.filter(order => order.orderStatus === filters.status);
//     }

//     // Apply date range filter
//     if (filters.dateRange !== 'all') {
//       const now = new Date();
//       const filterDate = new Date();
      
//       switch (filters.dateRange) {
//         case 'today':
//           filterDate.setDate(now.getDate() - 1);
//           break;
//         case 'week':
//           filterDate.setDate(now.getDate() - 7);
//           break;
//         case 'month':
//           filterDate.setMonth(now.getMonth() - 1);
//           break;
//         case 'quarter':
//           filterDate.setMonth(now.getMonth() - 3);
//           break;
//         case 'year':
//           filterDate.setFullYear(now.getFullYear() - 1);
//           break;
//       }

//       result = result.filter(order => new Date(order.createdAt) > filterDate);
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       switch (filters.sortBy) {
//         case 'newest':
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case 'oldest':
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case 'highest':
//           return b.totalPrice - a.totalPrice;
//         case 'lowest':
//           return a.totalPrice - b.totalPrice;
//         default:
//           return 0;
//       }
//     });

//     setFilteredOrders(result);
//   };

//   const handleStatusUpdate = async (orderId, data) => {
//     try {
//       const response = await adminService.updateOrderStatus(orderId, data);
//       const updatedOrders = orders.map(order => 
//         order._id === orderId ? response.data : order
//       );
//       setOrders(updatedOrders);
//       calculateStats(updatedOrders);
//       showAlert('success', 'Order status updated successfully');
//     } catch (error) {
//       showAlert('error', 'Failed to update order status');
//     }
//   };

//   const handleViewOrder = (orderId) => {
//     navigate(`/admin/orders/${orderId}`);
//   };

//   const handleBulkAction = (action) => {
//     if (selectedOrders.length === 0) {
//       showAlert('warning', 'Please select orders first');
//       return;
//     }

//     switch (action) {
//       case 'export':
//         handleExportOrders();
//         break;
//       case 'mark-processing':
//         handleBulkStatusUpdate('processing');
//         break;
//       case 'mark-shipped':
//         handleBulkStatusUpdate('shipped');
//         break;
//       case 'mark-delivered':
//         handleBulkStatusUpdate('delivered');
//         break;
//       default:
//         break;
//     }
//   };

//   const handleBulkStatusUpdate = async (status) => {
//     try {
//       const promises = selectedOrders.map(orderId => 
//         adminService.updateOrderStatus(orderId, { status })
//       );
//       await Promise.all(promises);
      
//       const updatedOrders = orders.map(order => 
//         selectedOrders.includes(order._id) 
//           ? { ...order, orderStatus: status }
//           : order
//       );
      
//       setOrders(updatedOrders);
//       calculateStats(updatedOrders);
//       setSelectedOrders([]);
//       showAlert('success', `${selectedOrders.length} orders updated to ${status}`);
//     } catch (error) {
//       showAlert('error', 'Failed to update orders');
//     }
//   };

//   const handleExportOrders = async () => {
//     setIsExporting(true);
//     try {
//       const exportData = filteredOrders.map(order => ({
//         'Order ID': order._id,
//         'Date': formatDate(order.createdAt),
//         'Customer': order.user?.name,
//         'Email': order.user?.email,
//         'Status': order.orderStatus,
//         'Amount': order.totalPrice,
//         'Payment Status': order.isPaid ? 'Paid' : 'Pending',
//         'Shipping Method': order.shippingMethod,
//         'Tracking Number': order.trackingNumber || 'N/A'
//       }));

//       // In a real app, generate CSV or call export API
//       console.log('Export data:', exportData);
//       showAlert('success', `Exported ${exportData.length} orders`);
//     } catch (error) {
//       showAlert('error', 'Failed to export orders');
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const handleSelectOrder = (orderId) => {
//     setSelectedOrders(prev =>
//       prev.includes(orderId)
//         ? prev.filter(id => id !== orderId)
//         : [...prev, orderId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedOrders.length === filteredOrders.length) {
//       setSelectedOrders([]);
//     } else {
//       setSelectedOrders(filteredOrders.map(order => order._id));
//     }
//   };

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const statusOptions = [
//     { value: 'all', label: 'All Status', icon: ChartBarIcon },
//     { value: 'pending', label: 'Pending', icon: ClockIcon },
//     { value: 'processing', label: 'Processing', icon: ShoppingCartIcon },
//     { value: 'shipped', label: 'Shipped', icon: TruckIcon },
//     { value: 'delivered', label: 'Delivered', icon: CheckCircleIcon },
//     { value: 'cancelled', label: 'Cancelled', icon: XCircleIcon },
//   ];

//   const dateOptions = [
//     { value: 'all', label: 'All Time' },
//     { value: 'today', label: 'Today' },
//     { value: 'week', label: 'Last 7 Days' },
//     { value: 'month', label: 'Last 30 Days' },
//     { value: 'quarter', label: 'Last 3 Months' },
//     { value: 'year', label: 'Last Year' },
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Newest First' },
//     { value: 'oldest', label: 'Oldest First' },
//     { value: 'highest', label: 'Highest Amount' },
//     { value: 'lowest', label: 'Lowest Amount' },
//   ];

//   const bulkActions = [
//     { value: 'export', label: 'Export Selected', icon: DocumentArrowDownIcon },
//     { value: 'mark-processing', label: 'Mark as Processing', icon: ShoppingCartIcon },
//     { value: 'mark-shipped', label: 'Mark as Shipped', icon: TruckIcon },
//     { value: 'mark-delivered', label: 'Mark as Delivered', icon: CheckCircleIcon },
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
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
//           <p className="text-gray-600 mt-1">
//             Manage and track customer orders, update status, and process refunds.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={fetchOrders}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
//           >
//             <ArrowPathIcon className="w-4 h-4 mr-2" />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards - Responsive Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
//         <StatCard
//           title="Total Orders"
//           value={stats.total}
//           icon={ChartBarIcon}
//           color="gray"
//           trend={stats.todayOrders}
//           trendLabel="today"
//         />
//         <StatCard
//           title="Pending"
//           value={stats.pending}
//           icon={ClockIcon}
//           color="yellow"
//           subtitle="Awaiting processing"
//         />
//         <StatCard
//           title="Processing"
//           value={stats.processing}
//           icon={ShoppingCartIcon}
//           color="blue"
//           subtitle="In fulfillment"
//         />
//         <StatCard
//           title="Delivered"
//           value={stats.delivered}
//           icon={CheckCircleIcon}
//           color="green"
//           subtitle="Completed orders"
//         />
//         <StatCard
//           title="Cancelled"
//           value={stats.cancelled}
//           icon={XCircleIcon}
//           color="red"
//           subtitle="Refunded/Returned"
//         />
//         <StatCard
//           title="Revenue"
//           value={`$${formatCurrency(stats.totalRevenue)}`}
//           icon={ChartBarIcon}
//           color="purple"
//           subtitle={`Avg: $${stats.avgOrderValue.toFixed(2)}`}
//         />
//       </div>

//       {/* Filters and Search Bar */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           {/* Search Input */}
//           <div className="flex-1">
//             <SearchInput
//               value={searchTerm}
//               onChange={setSearchTerm}
//               placeholder="Search by order ID, customer name, or email..."
//             />
//           </div>

//           {/* Filter Controls */}
//           <div className="flex flex-wrap items-center gap-3">
//             {/* Mobile Filter Toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
//             >
//               <FunnelIcon className="w-4 h-4 mr-2" />
//               Filters
//               {Object.values(filters).some(f => f !== 'all' && f !== 'newest') && (
//                 <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
//                   •
//                 </span>
//               )}
//             </button>

//             {/* Desktop Filters */}
//             <div className="hidden lg:flex items-center gap-3">
//               <FilterBar
//                 label="Status"
//                 value={filters.status}
//                 onChange={(value) => setFilters({ ...filters, status: value })}
//                 options={statusOptions}
//                 icon={FunnelIcon}
//               />
//               <FilterBar
//                 label="Date"
//                 value={filters.dateRange}
//                 onChange={(value) => setFilters({ ...filters, dateRange: value })}
//                 options={dateOptions}
//                 icon={CalendarIcon}
//               />
//               <FilterBar
//                 label="Sort"
//                 value={filters.sortBy}
//                 onChange={(value) => setFilters({ ...filters, sortBy: value })}
//                 options={sortOptions}
//                 icon={ChevronDownIcon}
//               />
//             </div>

//             {/* Export Button */}
//             <button
//               onClick={() => handleBulkAction('export')}
//               disabled={isExporting}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//             >
//               <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
//               <span className="hidden sm:inline">Export</span>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Filters Dropdown */}
//         {showFilters && (
//           <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
//                 >
//                   {statusOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date Range
//                 </label>
//                 <select
//                   value={filters.dateRange}
//                   onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
//                 >
//                   {dateOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sort By
//                 </label>
//                 <select
//                   value={filters.sortBy}
//                   onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
//                 >
//                   {sortOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Bulk Actions Bar */}
//       {selectedOrders.length > 0 && (
//         <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex items-center">
//               <span className="text-sm font-medium text-primary-800">
//                 {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {bulkActions.map(action => (
//                 <button
//                   key={action.value}
//                   onClick={() => handleBulkAction(action.value)}
//                   className="inline-flex items-center px-3 py-2 border border-primary-300 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
//                 >
//                   <action.icon className="w-4 h-4 mr-2" />
//                   <span className="hidden sm:inline">{action.label}</span>
//                   <span className="sm:hidden">{action.label.split(' ')[0]}</span>
//                 </button>
//               ))}
//               <button
//                 onClick={() => setSelectedOrders([])}
//                 className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Orders Table/List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
//               <p className="text-sm text-gray-600 mt-1">
//                 Showing {filteredOrders.length} of {orders.length} orders
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleSelectAll}
//                 className="text-sm font-medium text-primary-600 hover:text-primary-700"
//               >
//                 {selectedOrders.length === filteredOrders.length ? 'Deselect All' : 'Select All'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Order List */}
//         <div className="lg:hidden divide-y divide-gray-200">
//           {filteredOrders.length > 0 ? (
//             filteredOrders.map(order => (
//               <OrderMobileCard
//                 key={order._id}
//                 order={order}
//                 isSelected={selectedOrders.includes(order._id)}
//                 onSelect={handleSelectOrder}
//                 onView={handleViewOrder}
//                 onStatusUpdate={handleStatusUpdate}
//               />
//             ))
//           ) : (
//             <div className="text-center py-12">
//               <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto" />
//               <p className="mt-4 text-gray-500">No orders found</p>
//               {searchTerm && (
//                 <p className="text-sm text-gray-400 mt-2">
//                   Try adjusting your search or filters
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Desktop Order Table */}
//         <div className="hidden lg:block overflow-x-auto">
//           <OrderTable
//             orders={filteredOrders}
//             selectedOrders={selectedOrders}
//             onSelect={handleSelectOrder}
//             onSelectAll={handleSelectAll}
//             onStatusUpdate={handleStatusUpdate}
//             onView={handleViewOrder}
//           />
//         </div>

//         {/* Footer */}
//         {filteredOrders.length > 0 && (
//           <div className="px-4 py-3 sm:px-6 border-t border-gray-200 bg-gray-50">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{Math.min(filteredOrders.length, 10)}</span> of{' '}
//                 <span className="font-medium">{filteredOrders.length}</span> orders
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-700">Page 1 of 1</span>
//                 {/* Add pagination buttons here */}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Sub-components

// const StatCard = ({ title, value, icon: Icon, color, trend, trendLabel, subtitle }) => {
//   const colorClasses = {
//     gray: 'bg-gray-50 text-gray-700 border-gray-200',
//     yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
//     blue: 'bg-blue-50 text-blue-700 border-blue-200',
//     green: 'bg-green-50 text-green-700 border-green-200',
//     red: 'bg-red-50 text-red-700 border-red-200',
//     purple: 'bg-purple-50 text-purple-700 border-purple-200',
//   };

//   return (
//     <div className={`rounded-lg border p-3 sm:p-4 ${colorClasses[color]}`}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-xs sm:text-sm font-medium opacity-90">{title}</p>
//           <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 truncate">{value}</p>
          
//           {subtitle && (
//             <p className="text-xs opacity-75 mt-1 truncate">{subtitle}</p>
//           )}
          
//           {trend !== undefined && trend !== 0 && (
//             <div className="flex items-center mt-2">
//               <span className="text-xs font-medium">
//                 {trend > 0 ? '+' : ''}{trend} {trendLabel}
//               </span>
//             </div>
//           )}
//         </div>
//         <div className={`p-2 rounded-lg bg-white/50 ${colorClasses[color].replace('bg-', 'bg-opacity-30')} ml-2`}>
//           <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
//         </div>
//       </div>
//     </div>
//   );
// };

// const OrderMobileCard = ({ order, isSelected, onSelect, onView, onStatusUpdate }) => {
//   const statusColors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     processing: 'bg-blue-100 text-blue-800',
//     shipped: 'bg-purple-100 text-purple-800',
//     delivered: 'bg-green-100 text-green-800',
//     cancelled: 'bg-red-100 text-red-800',
//   };

//   return (
//     <div className="p-4">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             checked={isSelected}
//             onChange={() => onSelect(order._id)}
//             className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//           />
//           <div>
//             <p className="font-medium text-gray-900">Order #{order._id?.slice(-8)}</p>
//             <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
//           </div>
//         </div>
//         <button
//           onClick={() => onView(order._id)}
//           className="p-2 text-gray-400 hover:text-gray-600"
//           aria-label="View order"
//         >
//           <EyeIcon className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div>
//           <p className="text-xs text-gray-500">Customer</p>
//           <p className="text-sm font-medium text-gray-900 truncate">
//             {order.user?.name || 'Guest'}
//           </p>
//         </div>
//         <div>
//           <p className="text-xs text-gray-500">Amount</p>
//           <p className="text-sm font-medium text-gray-900">
//             ${order.totalPrice?.toFixed(2)}
//           </p>
//         </div>
//       </div>
      
//       <div className="flex items-center justify-between">
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
//           {order.orderStatus}
//         </span>
//         <div className="flex items-center space-x-2">
//           <StatusDropdown
//             currentStatus={order.orderStatus}
//             onUpdate={(status) => onStatusUpdate(order._id, { status })}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatusDropdown = ({ currentStatus, onUpdate }) => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   const statusOptions = [
//     { value: 'processing', label: 'Processing', color: 'blue' },
//     { value: 'shipped', label: 'Shipped', color: 'purple' },
//     { value: 'delivered', label: 'Delivered', color: 'green' },
//     { value: 'cancelled', label: 'Cancel', color: 'red' },
//   ];

//   const currentColor = {
//     pending: 'yellow',
//     processing: 'blue',
//     shipped: 'purple',
//     delivered: 'green',
//     cancelled: 'red',
//   }[currentStatus];

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-xs font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
//       >
//         Update
//         <ChevronDownIcon className="w-3 h-3 ml-1" />
//       </button>
      
//       {isOpen && (
//         <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//           <div className="py-1">
//             {statusOptions.map(option => (
//               <button
//                 key={option.value}
//                 onClick={() => {
//                   onUpdate(option.value);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
//                   currentStatus === option.value ? 'font-medium' : ''
//                 }`}
//               >
//                 <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-${option.color}-500`}></span>
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;