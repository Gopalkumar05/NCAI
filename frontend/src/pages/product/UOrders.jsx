

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Eye,
  Download,
  RefreshCw,
  ChevronRight,
  X,
  AlertCircle,
  Phone,
  Mail,
  Clock as ClockIcon,
  MessageCircle
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [cancelModal, setCancelModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Status options with useMemo to calculate counts
  const statusOptions = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    // Calculate counts from orders
    orders.forEach(order => {
      if (order.orderStatus in counts) {
        counts[order.orderStatus]++;
      }
    });

    return [
      { value: 'all', label: 'All Status', count: counts.all },
      { value: 'pending', label: 'Pending', count: counts.pending },
      { value: 'processing', label: 'Processing', count: counts.processing },
      { value: 'shipped', label: 'Shipped', count: counts.shipped },
      { value: 'delivered', label: 'Delivered', count: counts.delivered },
      { value: 'cancelled', label: 'Cancelled', count: counts.cancelled }
    ];
  }, [orders]);

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Show toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cancelModal && !e.target.closest('.modal-content')) {
        setCancelModal(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cancelModal]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, dateFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    showToast('Orders refreshed successfully', 'success');
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return orderDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return orderDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(query) ||
        order.orderItems.some(item => 
          item.name.toLowerCase().includes(query)
        )
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderItemsPreview = (orderItems) => {
    if (orderItems.length === 0) return '';
    if (orderItems.length === 1) return orderItems[0].name;
    return `${orderItems[0].name} + ${orderItems.length - 1} more`;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await userService.cancelOrder(orderId);
      showToast('Order cancelled successfully', 'success');
      await fetchOrders();
      setCancelModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/orders/${orderId}/track`);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  if (error && orders.length === 0) {
    return (
      <EmptyState
        icon="⚠️"
        title="Unable to Load Orders"
        description={error}
        actionText="Try Again"
        onAction={fetchOrders}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

      {/* Cancel Order Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl sm:rounded-2xl p-6 max-w-md w-full shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => setCancelModal(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order #{cancelModal.slice(-8).toUpperCase()}? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCancelModal(null)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(cancelModal)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                View and manage all your flower orders
              </p>
            </div>
            <button
              onClick={refreshOrders}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Orders'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-center transition-all ${
                  statusFilter === status.value
                    ? 'bg-pink-500 text-white transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1">{status.count}</div>
                <div className="text-xs sm:text-sm font-medium truncate">{status.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Filter by Date
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Orders Found"
            description={
              searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? "Try adjusting your filters"
                : "You haven't placed any orders yet"
            }
            actionText="Start Shopping"
            onAction={() => navigate('/products')}
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      {getStatusIcon(order.orderStatus)}
                      <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                          <span>•</span>
                          <span>{formatTime(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                        ${order.totalPrice.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 justify-end">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{order.isPaid ? 'Paid' : 'Payment Pending'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Items</h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {getOrderItemsPreview(order.orderItems)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                        {order.orderItems.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-100 rounded flex items-center justify-center flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                              ) : (
                                <span className="text-xs sm:text-sm">🌸</span>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[80px] sm:max-w-none">{item.name}</span>
                            <span className="text-xs text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-gray-600">
                            +{order.orderItems.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 md:mt-0">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm sm:text-base transition-colors"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>View Details</span>
                      </button>
                      
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => setCancelModal(order._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm sm:text-base transition-colors"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      
                      {order.orderStatus === 'shipped' && (
                        <button
                          onClick={() => handleTrackOrder(order._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-sm sm:text-base transition-colors"
                        >
                          <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Track</span>
                        </button>
                      )}
                      
                      {/* <button
                        onClick={() => window.print()}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base transition-colors"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Invoice</span>
                      </button> */}

                      <button
  onClick={() => navigate(`/orders/${order._id}/invoice`)}
  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
>
  <Download className="w-4 h-4" />
  View Full Invoice
</button>
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Shipping to: </span>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="text-xs sm:text-sm">
                        <span className="text-gray-600">Tracking: </span>
                        <span className="font-mono font-medium text-gray-900">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Stats Summary */}
        {orders.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {statusOptions.find(opt => opt.value === 'all')?.count || 0}
                </div>
                <div className="text-base sm:text-lg font-medium text-blue-800">Total Orders</div>
                <div className="text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2">All time purchases</div>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                </div>
                <div className="text-base sm:text-lg font-medium text-green-800">Total Spent</div>
                <div className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2">Lifetime value</div>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                  {statusOptions.find(opt => opt.value === 'delivered')?.count || 0}
                </div>
                <div className="text-base sm:text-lg font-medium text-purple-800">Delivered</div>
                <div className="text-xs sm:text-sm text-purple-600 mt-1 sm:mt-2">Successfully received</div>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-1 sm:mb-2">
                  {statusOptions.find(opt => opt.value === 'pending')?.count || 0 +
                   statusOptions.find(opt => opt.value === 'processing')?.count || 0}
                </div>
                <div className="text-base sm:text-lg font-medium text-pink-800">In Progress</div>
                <div className="text-xs sm:text-sm text-pink-600 mt-1 sm:mt-2">Currently being processed</div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Need Help with Your Orders?
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Our customer support team is here to help you with any questions about your orders, shipping, or returns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="bg-pink-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors text-sm sm:text-base text-center"
                >
                  Contact Support
                </Link>
                <Link
                  to="/faq"
                  className="border-2 border-pink-500 text-pink-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors text-sm sm:text-base text-center"
                >
                  View FAQ
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <div className="font-medium text-gray-900 text-sm sm:text-base">Phone Support</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">(555) 123-4567</div>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <div className="font-medium text-gray-900 text-sm sm:text-base">Email</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">support@bloombox.com</div>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center">
                <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <div className="font-medium text-gray-900 text-sm sm:text-base">Hours</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">9AM - 6PM EST</div>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <div className="font-medium text-gray-900 text-sm sm:text-base">Live Chat</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">24/7 Available</div>
              </div>
            </div>
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
      `}</style>
    </div>
  );
};

export default Orders;