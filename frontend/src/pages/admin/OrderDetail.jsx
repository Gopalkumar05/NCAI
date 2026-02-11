

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  formatDate, 
  formatCurrency,
  truncateText 
} from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { adminService } from '../../services/adminService';
import {
  ArrowLeftIcon,
  PrinterIcon,
  EnvelopeIcon,
  XCircleIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await adminService.getOrderById(id);
      setOrder(response.data);
      setStatus(response.data.orderStatus);
      setTrackingNumber(response.data.trackingNumber || '');
    } catch (error) {
      showAlert('error', 'Failed to fetch order details');
      setTimeout(() => navigate('/admin/orders'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!status) return;
    
    setIsUpdating(true);
    try {
      const data = { status };
      if (trackingNumber) data.trackingNumber = trackingNumber;
      
      const response = await adminService.updateOrderStatus(id, data);
      setOrder(response.data);
      showAlert('success', 'Order status updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await adminService.cancelOrder(id);
      fetchOrderDetail();
      showAlert('success', 'Order cancelled successfully');
    } catch (error) {
      showAlert('error', 'Failed to cancel order');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handlePrintInvoice = () => {
    // In a real app, you would generate a PDF invoice
    window.print();
    showAlert('info', 'Opening print dialog...');
  };

  const handleEmailCustomer = () => {
    if (order?.user?.email) {
      window.location.href = `mailto:${order.user.email}?subject=Regarding your order #${order._id?.slice(-8)}`;
    }
  };

  const statusColors = {
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: ClockIcon
    },
    processing: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: ClockIcon
    },
    shipped: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: TruckIcon
    },
    delivered: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircleIcon
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircleIcon
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: ClockIcon },
    { value: 'processing', label: 'Processing', icon: ClockIcon },
    { value: 'shipped', label: 'Shipped', icon: TruckIcon },
    { value: 'delivered', label: 'Delivered', icon: CheckCircleIcon },
    { value: 'cancelled', label: 'Cancelled', icon: XCircleIcon },
  ];

  if (loading) return <Loader fullScreen />;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const currentStatus = statusColors[order.orderStatus] || statusColors.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-4 md:space-y-6">
      {alert.show && (
        <div className="animate-slide-down">
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate('/admin/orders')}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Orders
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus.bg} ${currentStatus.text} border ${currentStatus.border}`}>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintInvoice}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Mobile Tabs for Order Sections */}
      <div className="lg:hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 overflow-x-auto">
            {['items', 'shipping', 'status'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'items' && 'Order Items'}
                {tab === 'shipping' && 'Shipping'}
                {tab === 'status' && 'Status'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Mobile: Show active tab content */}
          <div className="lg:hidden">
            {activeTab === 'items' && (
              <OrderItemsSection order={order} />
            )}
            {activeTab === 'shipping' && (
              <ShippingSection order={order} />
            )}
            {activeTab === 'status' && (
              <StatusSection 
                order={order}
                status={status}
                setStatus={setStatus}
                trackingNumber={trackingNumber}
                setTrackingNumber={setTrackingNumber}
                handleStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
                statusOptions={statusOptions}
              />
            )}
          </div>

          {/* Desktop: Show all sections */}
          <div className="hidden lg:block space-y-6">
            {/* Order Items */}
            <OrderItemsSection order={order} />

            {/* Shipping Information */}
            <ShippingSection order={order} />

            {/* Payment Information */}
            <PaymentSection order={order} />
          </div>
        </div>

        {/* Right Column - Sidebar Actions */}
        <div className="space-y-4 md:space-y-6">
          {/* Desktop Status Update */}
          <div className="hidden lg:block">
            <StatusSection 
              order={order}
              status={status}
              setStatus={setStatus}
              trackingNumber={trackingNumber}
              setTrackingNumber={setTrackingNumber}
              handleStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
              statusOptions={statusOptions}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(order.subtotal || (order.totalPrice - (order.shippingPrice || 0) - (order.taxPrice || 0)))}
                  </span>
                </div>
                
                {order.shippingPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(order.shippingPrice)}
                    </span>
                  </div>
                )}
                
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(order.taxPrice)}
                    </span>
                  </div>
                )}
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Customer</h3>
                <UserCircleIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                  <p className="text-sm text-gray-600">{order.user?.email}</p>
                </div>
                {order.user?.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{order.user.phone}</p>
                  </div>
                )}
                <button
                  onClick={handleEmailCustomer}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Email Customer
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              <button
                onClick={handlePrintInvoice}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
              
              <button
                onClick={handleEmailCustomer}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Resend Confirmation
              </button>
              
              {order.orderStatus !== 'cancelled' && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for better organization

const OrderItemsSection = ({ order }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
        <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        {order.items?.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center flex-1 min-w-0">
              {item.image && (
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
                    loading="lazy"
                  />
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
              )}
              <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                {item.variant && (
                  <p className="text-xs text-gray-500 truncate">Variant: {item.variant}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-600">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
            </div>
            <div className="ml-2 sm:ml-4 text-right flex-shrink-0">
              <p className="text-sm sm:text-base font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ShippingSection = ({ order }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
        <MapPinIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
              {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Method</h4>
            <p className="text-sm text-gray-600">{order.shippingMethod || 'Standard Shipping'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Tracking Number</h4>
            <p className="text-sm text-gray-600 font-mono">
              {order.trackingNumber || 'Not yet shipped'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PaymentSection = ({ order }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        <CreditCardIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Payment Status</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.isPaid 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Payment Method</h4>
            <p className="text-sm text-gray-600">{order.paymentMethod || 'Credit Card'}</p>
          </div>
        </div>
        
        {order.isPaid && order.paidAt && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Payment Date</h4>
            <p className="text-sm text-gray-600">{formatDate(order.paidAt)}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const StatusSection = ({ 
  order, 
  status, 
  setStatus, 
  trackingNumber, 
  setTrackingNumber,
  handleStatusUpdate,
  isUpdating,
  statusOptions 
}) => {
  const currentStatus = statusColors[order.orderStatus] || statusColors.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
          <StatusIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Current Status</p>
              <p className={`text-sm font-medium mt-1 ${currentStatus.text}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${currentStatus.bg}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update to
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const optionColor = statusColors[option.value];
              const isSelected = status === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? `${optionColor.border} ${optionColor.bg} ring-2 ring-offset-1 ring-primary-500`
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isSelected ? optionColor.text : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium ${
                    isSelected ? optionColor.text : 'text-gray-600'
                  }`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number
          </label>
          <div className="relative">
            <TruckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="Enter tracking number"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Required when status is changed to "Shipped"
          </p>
        </div>

        <button
          onClick={handleStatusUpdate}
          disabled={isUpdating || !status}
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            'Update Order Status'
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;