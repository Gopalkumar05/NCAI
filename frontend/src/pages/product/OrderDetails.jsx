// components/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  Printer,
  AlertCircle,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  Home,
  ShoppingBag
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    console.log('Order ID from params:', id);
    
    if (id && id !== 'undefined' && id.length >= 10) {
      fetchOrderDetails();
    } else {
      setError('Invalid order ID');
      setLoading(false);
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching order with ID:', id);
      
      const response = await orderService.getOrderById(id);
      console.log('Order response:', response.data);
      setOrder(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to fetch order details';
      setError(errorMessage);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!id || !order) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(id);
      setToast({
        type: 'success',
        message: 'Order cancelled successfully'
      });
      fetchOrderDetails();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel order'
      });
      console.error('Error cancelling order:', err);
    } finally {
      setCancelling(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    if (!order || !order._id) return;
    
    setToast({
      type: 'info',
      message: 'Invoice download will be available soon'
    });
    
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { id: 'pending', label: 'Order Placed', description: 'Order has been placed' },
      { id: 'processing', label: 'Processing', description: 'Preparing your order' },
      { id: 'shipped', label: 'Shipped', description: 'Order is on the way' },
      { id: 'delivered', label: 'Delivered', description: 'Order delivered' },
    ];

    const currentIndex = steps.findIndex(step => step.id === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index < currentIndex || index === currentIndex,
      current: index === currentIndex
    }));
  };

  const canCancelOrder = () => {
    if (!order) return false;
    return order.orderStatus === 'pending' || order.orderStatus === 'processing';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Order not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ? 'Unable to load order details' : 'The order you are looking for does not exist.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Back to Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 print:bg-white">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn max-w-xs ${
          toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-500" />
          )}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-8 print:hidden">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-white hover:text-white/90 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
              </h1>
              <p className="text-white/90">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                getStatusColor(order.orderStatus)
              }`}>
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          {/* <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </button> */}

          <button
  onClick={() => navigate(`/orders/${order._id}/invoice`)}
  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
>
  <Download className="w-4 h-4" />
  View Full Invoice
</button>
          {canCancelOrder() && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                cancelling 
                  ? 'bg-red-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {cancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Timeline & Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                      step.completed 
                        ? step.current ? 'bg-pink-100' : 'bg-green-100'
                        : 'bg-gray-100'
                    }`}>
                      {step.completed ? (
                        step.current ? getStatusIcon(order.orderStatus) : (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          step.current ? 'text-pink-600' : 
                          step.completed ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </h3>
                        {step.current && (
                          <span className="text-sm text-gray-500">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.current && step.id === 'shipped' && order.trackingNumber && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            Tracking Number: <strong>{order.trackingNumber}</strong>
                          </p>
                          <p className="text-sm text-blue-600 mt-1">
                            Use this number to track your package
                          </p>
                        </div>
                      )}
                      {step.current && step.id === 'delivered' && order.deliveredAt && (
                        <p className="text-sm text-gray-600 mt-2">
                          Delivered on {formatDate(order.deliveredAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML = '<span class="text-2xl">🌸</span>';
                          }}
                        />
                      ) : item.product?.images?.[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML = '<span class="text-2xl">🌸</span>';
                          }}
                        />
                      ) : (
                        <span className="text-2xl">🌸</span>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.name || item.product?.name || 'Unnamed Product'}
                      </h3>
                      {item.product?.category && (
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${(item.price || 0).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Details */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(order.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">
                    {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                     order.paymentMethod === 'paypal' ? 'PayPal' : 
                     order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Unknown'}
                  </p>
                </div>
                {order.isPaid && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className="font-medium text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Paid on {formatDate(order.paidAt)}
                      </p>
                    </div>
                    {order.paymentResult?.id && (
                      <div>
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-medium text-sm">{order.paymentResult.id}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-2">
                {order.shippingAddress ? (
                  <>
                    <p className="font-medium">{order.shippingAddress.street || 'N/A'}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="text-gray-600 flex items-center gap-2 mt-3">
                        <Phone className="w-4 h-4" />
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No shipping address provided</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:support@flowershop.com" 
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@flowershop.com
                  </a>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    (123) 456-7890
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
          .shadow-sm {
            box-shadow: none !important;
          }
          .border {
            border: 1px solid #e5e7eb !important;
          }
          .rounded-xl {
            border-radius: 0 !important;
          }
        }
        
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

export default OrderDetails;