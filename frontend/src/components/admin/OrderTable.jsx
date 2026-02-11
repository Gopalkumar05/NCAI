// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { formatDate, formatCurrency } from '../../utils/formatters';
// import {
//   ChevronUpIcon,
//   ChevronDownIcon,
//   EyeIcon,
//   PencilIcon
// } from '@heroicons/react/24/outline';

// const OrderTable = ({ orders, onStatusUpdate, onView }) => {
//   const [sortField, setSortField] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'processing', label: 'Processing' },
//     { value: 'shipped', label: 'Shipped' },
//     { value: 'delivered', label: 'Delivered' },
//     { value: 'cancelled', label: 'Cancelled' }
//   ];

//   const statusColors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     processing: 'bg-blue-100 text-blue-800',
//     shipped: 'bg-purple-100 text-purple-800',
//     delivered: 'bg-green-100 text-green-800',
//     cancelled: 'bg-red-100 text-red-800',
//   };

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const filteredOrders = statusFilter === 'all' 
//     ? orders 
//     : orders.filter(order => order.orderStatus === statusFilter);

//   const sortedOrders = [...filteredOrders].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
//   const paginatedOrders = sortedOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const SortIcon = ({ field }) => {
//     if (sortField !== field) return null;
//     return sortDirection === 'asc' ? 
//       <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
//       <ChevronDownIcon className="w-4 h-4 ml-1" />;
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     if (onStatusUpdate) {
//       await onStatusUpdate(orderId, { status: newStatus });
//     }
//   };

//   const getStatusOptions = (currentStatus) => {
//     const allStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
//     return allStatuses.filter(status => status !== currentStatus);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       {/* Filters */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
//           <div className="flex items-center space-x-4">
//             <select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="input-field w-full md:w-48"
//             >
//               {statusOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="date"
//               className="input-field w-full md:w-48"
//               placeholder="Filter by date"
//             />
//           </div>
//           <div className="flex items-center space-x-3">
//             <button className="text-sm text-gray-600 hover:text-gray-900">
//               Export Orders
//             </button>
//             <button className="btn-primary text-sm">
//               Bulk Actions
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleSort('_id')}
//               >
//                 <div className="flex items-center">
//                   Order ID
//                   <SortIcon field="_id" />
//                 </div>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customer
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleSort('createdAt')}
//               >
//                 <div className="flex items-center">
//                   Date
//                   <SortIcon field="createdAt" />
//                 </div>
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleSort('totalPrice')}
//               >
//                 <div className="flex items-center">
//                   Amount
//                   <SortIcon field="totalPrice" />
//                 </div>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Payment
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginatedOrders.map((order) => (
//               <tr key={order._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     #{order._id.slice(-8)}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {order.items?.length || 0} items
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     {order.user?.name || 'Guest'}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {order.user?.email || 'No email'}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">
//                     {formatDate(order.createdAt)}
//                   </div>
//                   {order.deliveredAt && (
//                     <div className="text-xs text-green-600">
//                       Delivered: {formatDate(order.deliveredAt)}
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {formatCurrency(order.totalPrice)}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                     order.isPaid
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {order.isPaid ? 'Paid' : 'Pending'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
//                       {order.orderStatus}
//                     </span>
//                     <select
//                       value={order.orderStatus}
//                       onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                       className="text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
//                     >
//                       {getStatusOptions(order.orderStatus).map(status => (
//                         <option key={status} value={status}>
//                           Change to {status}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   {order.trackingNumber && (
//                     <div className="text-xs text-gray-500 mt-1">
//                       Track: {order.trackingNumber}
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-3">
//                     {onView && (
//                       <button
//                         onClick={() => onView(order)}
//                         className="text-gray-600 hover:text-gray-900"
//                         title="View Details"
//                       >
//                         <EyeIcon className="w-5 h-5" />
//                       </button>
//                     )}
//                     <Link
//                       to={`/admin/orders/${order._id}`}
//                       className="text-primary-600 hover:text-primary-900"
//                       title="Edit Order"
//                     >
//                       <PencilIcon className="w-5 h-5" />
//                     </Link>
//                     <button
//                       onClick={() => {
//                         if (window.confirm('Are you sure you want to cancel this order?')) {
//                           handleStatusChange(order._id, 'cancelled');
//                         }
//                       }}
//                       className="text-red-600 hover:text-red-900"
//                       title="Cancel Order"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-4 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, sortedOrders.length)}
//               </span>{' '}
//               of <span className="font-medium">{sortedOrders.length}</span> orders
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
//               {[...Array(totalPages)].map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentPage(index + 1)}
//                   className={`px-3 py-1 border rounded-md text-sm font-medium ${
//                     currentPage === index + 1
//                       ? 'bg-primary-600 text-white border-primary-600'
//                       : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderTable;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';

const OrderTable = ({ orders, onStatusUpdate, onView }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Detect mobile screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
    { value: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'processing').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border border-purple-200',
    delivered: 'bg-green-100 text-green-800 border border-green-200',
    cancelled: 'bg-red-100 text-red-800 border border-red-200',
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesSearch = searchQuery === '' || 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate = !dateFilter || new Date(order.createdAt).toISOString().split('T')[0] === dateFilter;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-3 h-3 ml-1" /> : 
      <ChevronDownIcon className="w-3 h-3 ml-1" />;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(orderId, { status: newStatus });
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(order => order._id));
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) return;
    
    switch(action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
          // Handle bulk delete
          setSelectedOrders([]);
        }
        break;
      case 'export':
        // Handle export
        break;
      default:
        break;
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  // Mobile Card View
  const MobileOrderCard = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order._id)}
              onChange={() => handleSelectOrder(order._id)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="font-medium text-gray-900">#{order._id.slice(-8)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {order.items?.length || 0} items • {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <p className="text-sm font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
          <p className="text-xs text-gray-500">{order.user?.email || 'No email'}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(order.totalPrice)}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            order.isPaid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.isPaid ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(order)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/admin/orders/${order._id}`}
            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {getStatusOptions(order.orderStatus).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (window.confirm('Cancel this order?')) {
                handleStatusChange(order._id, 'cancelled');
              }
            }}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header with Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Orders</h2>
              <p className="text-sm text-gray-600 mt-1">
                {orders.length} total orders • {filteredOrders.length} filtered
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="hidden sm:inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => navigate('/admin/orders/new')}
                className="inline-flex items-center px-3 py-2 bg-primary-600 border border-gray-300 text-black rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                + New Order
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer, email, or tracking..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="hidden sm:block px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showMobileFilters && (
            <div className="sm:hidden bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Filters</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.slice(1).map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      statusFilter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {selectedOrders.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedOrders.length} order(s) selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="p-4">
          {paginatedOrders.length > 0 ? (
            <>
              {paginatedOrders.map((order) => (
                <MobileOrderCard key={order._id} order={order} />
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <DocumentDuplicateIcon className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-4 text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                {[
                  { field: '_id', label: 'Order ID' },
                  { field: 'user', label: 'Customer' },
                  { field: 'createdAt', label: 'Date' },
                  { field: 'totalPrice', label: 'Amount' },
                  { label: 'Payment' },
                  { label: 'Status' },
                  { label: 'Actions' }
                ].map((column) => (
                  <th 
                    key={column.label}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.field ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={column.field ? () => handleSort(column.field) : undefined}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.field && <SortIcon field={column.field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.user?.name || 'Guest'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.user?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                    {order.deliveredAt && (
                      <div className="text-xs text-green-600">
                        Delivered: {formatDate(order.deliveredAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      order.isPaid
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={order.orderStatus} />
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {getStatusOptions(order.orderStatus).map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Track: {order.trackingNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {onView && (
                        <button
                          onClick={() => onView(order)}
                          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-900 p-1 hover:bg-primary-50 rounded"
                        title="Edit Order"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Cancel this order?')) {
                            handleStatusChange(order._id, 'cancelled');
                          }
                        }}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Cancel Order"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedOrders.length)}
              </span>{' '}
              of <span className="font-medium">{sortedOrders.length}</span> orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              {/* Desktop Pagination Numbers */}
              <div className="hidden sm:flex items-center space-x-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                  
                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1.5 text-sm rounded-lg ${
                          currentPage === i
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>
              
              {/* Mobile Pagination Info */}
              <div className="sm:hidden text-sm font-medium text-gray-900">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedOrders.length === 0 && !isMobile && (
        <div className="text-center py-16">
          <DocumentDuplicateIcon className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' || dateFilter 
              ? 'Try adjusting your filters or search terms'
              : 'No orders have been placed yet'}
          </p>
          {(searchQuery || statusFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTable;

// // components/admin/OrderTable.jsx
// import { useState } from 'react';
// import { formatDate, formatCurrency } from '../../utils/formatters';
// import {
//   ChevronDownIcon,
//   ChevronUpIcon,
// } from '@heroicons/react/24/outline';

// const OrderTable = ({
//   orders,
//   selectedOrders,
//   onSelect,
//   onSelectAll,
//   onStatusUpdate,
//   onView,
//   sortable = true,
//   className = ''
// }) => {
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

//   const handleSort = (key) => {
//     if (!sortable) return;
    
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const sortedOrders = [...orders].sort((a, b) => {
//     if (sortConfig.key === 'createdAt') {
//       return sortConfig.direction === 'asc' 
//         ? new Date(a.createdAt) - new Date(b.createdAt)
//         : new Date(b.createdAt) - new Date(a.createdAt);
//     }
    
//     if (sortConfig.key === 'totalPrice') {
//       return sortConfig.direction === 'asc'
//         ? a.totalPrice - b.totalPrice
//         : b.totalPrice - a.totalPrice;
//     }
    
//     return 0;
//   });

//   const statusColors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     processing: 'bg-blue-100 text-blue-800',
//     shipped: 'bg-purple-100 text-purple-800',
//     delivered: 'bg-green-100 text-green-800',
//     cancelled: 'bg-red-100 text-red-800',
//   };

//   const statusOptions = [
//     { value: 'processing', label: 'Processing' },
//     { value: 'shipped', label: 'Shipped' },
//     { value: 'delivered', label: 'Delivered' },
//     { value: 'cancelled', label: 'Cancelled' },
//   ];

//   return (
//     <div className={`overflow-x-auto ${className}`}>
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th scope="col" className="px-6 py-3 text-left">
//               <input
//                 type="checkbox"
//                 checked={selectedOrders.length === orders.length && orders.length > 0}
//                 onChange={onSelectAll}
//                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//               />
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
//               onClick={() => handleSort('createdAt')}
//             >
//               <div className="flex items-center">
//                 Order Date
//                 {sortConfig.key === 'createdAt' && (
//                   sortConfig.direction === 'asc' ? 
//                     <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
//                     <ChevronDownIcon className="w-4 h-4 ml-1" />
//                 )}
//               </div>
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Order ID
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Customer
//             </th>
//             <th
//               scope="col"
//               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
//               onClick={() => handleSort('totalPrice')}
//             >
//               <div className="flex items-center">
//                 Amount
//                 {sortConfig.key === 'totalPrice' && (
//                   sortConfig.direction === 'asc' ? 
//                     <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
//                     <ChevronDownIcon className="w-4 h-4 ml-1" />
//                 )}
//               </div>
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Status
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Payment
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {sortedOrders.map(order => (
//             <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <input
//                   type="checkbox"
//                   checked={selectedOrders.includes(order._id)}
//                   onChange={() => onSelect(order._id)}
//                   className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                 />
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                 {formatDate(order.createdAt)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <span className="text-sm font-medium text-gray-900 font-mono">
//                   #{order._id?.slice(-8).toUpperCase()}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div>
//                   <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
//                     {order.user?.name || 'Guest'}
//                   </div>
//                   <div className="text-xs text-gray-500 truncate max-w-[120px]">
//                     {order.user?.email}
//                   </div>
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 ${order.totalPrice?.toFixed(2)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center space-x-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
//                     {order.orderStatus}
//                   </span>
//                   <select
//                     value=""
//                     onChange={(e) => onStatusUpdate(order._id, { status: e.target.value })}
//                     className="block w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent bg-white"
//                   >
//                     <option value="" disabled>Update...</option>
//                     {statusOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   order.isPaid 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {order.isPaid ? 'Paid' : 'Pending'}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <button
//                   onClick={() => onView(order._id)}
//                   className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
//                 >
//                   View Details
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderTable;