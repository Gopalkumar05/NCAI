// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { 
//   CheckCircle, 
//   ShoppingBag, 
//   Package, 
//   Truck, 
//   Home, 
//   Download, 
//   Printer,
//   Calendar,
//   Clock,
//   CreditCard,
//   MapPin,
//   Phone,
//   Mail
// } from 'lucide-react';
// import { orderService } from '../../services/orderService';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const OrderConfirmation = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [countdown, setCountdown] = useState(10);

//   useEffect(() => {
//     if (id) {
//       fetchOrderDetails();
//     } else {
//       navigate('/orders');
//     }
//   }, [id]);

//   useEffect(() => {
//     if (!order) return;

//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           navigate('/orders');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [order, navigate]);

//   const fetchOrderDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await orderService.getOrderById(id);
//       setOrder(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load order details');
//       console.error('Error fetching order:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrintInvoice = () => {
//     window.print();
//   };

//   const handleDownloadInvoice = () => {
//     // In a real app, this would generate a PDF
//     toast.success('Invoice download started');
//   };

//   const handleContinueShopping = () => {
//     navigate('/products');
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getOrderStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       processing: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPaymentMethodIcon = (method) => {
//     const icons = {
//       card: <CreditCard className="w-5 h-5" />,
//       paypal: 'PP',
//       cod: '💰',
//     };
//     return icons[method] || '💳';
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error || !order) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
//         <div className="text-center max-w-md p-6">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Order Not Found
//           </h2>
//           <p className="text-gray-600 mb-6">{error || 'The order could not be found.'}</p>
//           <div className="flex gap-4 justify-center">
//             <Link
//               to="/orders"
//               className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600"
//             >
//               View Orders
//             </Link>
//             <Link
//               to="/products"
//               className="border-2 border-pink-500 text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-pink-50"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
//       {/* Confirmation Header */}
//       <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
//         <div className="container mx-auto px-4 py-12">
//           <div className="max-w-4xl mx-auto text-center">
//             <CheckCircle className="w-24 h-24 mx-auto mb-6" />
//             <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
//             <p className="text-xl opacity-90 mb-6">
//               Thank you for your purchase. Your order #{order._id.slice(-8).toUpperCase()} has been received.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button
//                 onClick={handlePrintInvoice}
//                 className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 flex items-center gap-2"
//               >
//                 <Printer className="w-5 h-5" />
//                 Print Invoice
//               </button>
//               <button
//                 onClick={handleDownloadInvoice}
//                 className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 flex items-center gap-2"
//               >
//                 <Download className="w-5 h-5" />
//                 Download Invoice
//               </button>
//               <button
//                 onClick={handleContinueShopping}
//                 className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 flex items-center gap-2"
//               >
//                 <ShoppingBag className="w-5 h-5" />
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Order Summary */}
//           <div className="grid lg:grid-cols-3 gap-8 mb-8">
//             {/* Order Details */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-2xl shadow-sm p-8">
//                 <div className="flex justify-between items-center mb-8">
//                   <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//                   <span className={`px-4 py-2 rounded-full font-semibold ${getOrderStatusColor(order.orderStatus)}`}>
//                     {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
//                   </span>
//                 </div>

//                 {/* Order Items */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
//                   <div className="space-y-6">
//                     {order.orderItems.map((item, index) => (
//                       <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
//                         <div className="w-20 h-20 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">
//                           {item.image ? (
//                             <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
//                           ) : (
//                             '🌸'
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex justify-between">
//                             <h4 className="font-medium text-gray-900">{item.name}</h4>
//                             <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-600 mt-2">
//                             <span>Quantity: {item.quantity}</span>
//                             <span>${item.price} each</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Timeline */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
//                   <div className="relative">
//                     {/* Timeline line */}
//                     <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
//                     <div className="space-y-8">
//                       {/* Order Placed */}
//                       <div className="relative flex items-start">
//                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
//                           <ShoppingBag className="w-6 h-6 text-green-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">Order Placed</h4>
//                           <p className="text-gray-600">Your order has been received</p>
//                           <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                             <Calendar className="w-4 h-4" />
//                             <span>{formatDate(order.createdAt)}</span>
//                             <Clock className="w-4 h-4 ml-2" />
//                             <span>{formatTime(order.createdAt)}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Processing */}
//                       <div className="relative flex items-start">
//                         <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${order.orderStatus === 'pending' || order.orderStatus === 'processing' ? 'bg-blue-100' : 'bg-gray-100'}`}>
//                           <Package className={`w-6 h-6 ${order.orderStatus === 'pending' || order.orderStatus === 'processing' ? 'text-blue-600' : 'text-gray-400'}`} />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">Processing</h4>
//                           <p className="text-gray-600">Preparing your order for shipment</p>
//                           {order.orderStatus !== 'pending' && (
//                             <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                               <Calendar className="w-4 h-4" />
//                               <span>Estimated: {formatDate(new Date(Date.now() + 86400000))}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Shipping */}
//                       <div className="relative flex items-start">
//                         <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'bg-purple-100' : 'bg-gray-100'}`}>
//                           <Truck className={`w-6 h-6 ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'text-purple-600' : 'text-gray-400'}`} />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">Shipping</h4>
//                           <p className="text-gray-600">Your order is on the way</p>
//                           {order.trackingNumber && (
//                             <div className="mt-2">
//                               <p className="text-sm text-gray-600">Tracking Number: <span className="font-mono font-bold">{order.trackingNumber}</span></p>
//                               <Link to={`/orders/${order._id}/track`} className="text-pink-600 hover:text-pink-700 text-sm font-medium">
//                                 Track Order
//                               </Link>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Delivery */}
//                       <div className="relative flex items-start">
//                         <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${order.orderStatus === 'delivered' ? 'bg-green-100' : 'bg-gray-100'}`}>
//                           <Home className={`w-6 h-6 ${order.orderStatus === 'delivered' ? 'text-green-600' : 'text-gray-400'}`} />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">Delivery</h4>
//                           <p className="text-gray-600">Your order has been delivered</p>
//                           {order.deliveredAt && (
//                             <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                               <Calendar className="w-4 h-4" />
//                               <span>{formatDate(order.deliveredAt)}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary Sidebar */}
//             <div>
//               <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
//                 {/* Order Info */}
//                 <div className="space-y-4 mb-8">
//                   <div>
//                     <p className="text-sm text-gray-600">Order Number</p>
//                     <p className="font-bold text-gray-900">{order._id.slice(-8).toUpperCase()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Order Date</p>
//                     <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Payment Method</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
//                         {getPaymentMethodIcon(order.paymentMethod)}
//                       </div>
//                       <span className="font-medium text-gray-900">
//                         {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
//                          order.paymentMethod === 'paypal' ? 'PayPal' : 
//                          'Cash on Delivery'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="mb-8">
//                   <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <MapPin className="w-5 h-5" />
//                     Shipping Address
//                   </h4>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="font-medium text-gray-900">{order.shippingAddress.street}</p>
//                     <p className="text-gray-600">
//                       {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
//                     </p>
//                     <p className="text-gray-600">{order.shippingAddress.country}</p>
//                     <div className="flex items-center gap-2 mt-3 text-gray-600">
//                       <Phone className="w-4 h-4" />
//                       <span>{order.shippingAddress.phone}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Totals */}
//                 <div className="space-y-3 border-t pt-6">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">${order.itemsPrice.toFixed(2)}</span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="font-medium">
//                       {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax</span>
//                     <span className="font-medium">${order.taxPrice.toFixed(2)}</span>
//                   </div>
                  
//                   <div className="border-t pt-4">
//                     <div className="flex justify-between text-xl font-bold">
//                       <span>Total</span>
//                       <span>${order.totalPrice.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Status */}
//                 <div className={`mt-6 p-4 rounded-lg ${order.isPaid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="font-semibold text-gray-900">
//                         {order.isPaid ? 'Payment Successful' : 'Payment Pending'}
//                       </p>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Complete payment to process order'}
//                       </p>
//                     </div>
//                     {order.isPaid && (
//                       <CheckCircle className="w-6 h-6 text-green-600" />
//                     )}
//                   </div>
//                 </div>

//                 {/* Need Help */}
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                   <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
//                   <p className="text-sm text-blue-700 mb-3">
//                     Our customer support team is here to assist you.
//                   </p>
//                   <div className="space-y-2">
//                     <a href="mailto:support@bloombox.com" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
//                       <Mail className="w-4 h-4" />
//                       support@bloombox.com
//                     </a>
//                     <a href="tel:+15551234567" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
//                       <Phone className="w-4 h-4" />
//                       (555) 123-4567
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Next Steps */}
//           <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               <div className="text-center p-6 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
//                 <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
//                   📧
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Confirmation Email</h3>
//                 <p className="text-gray-600 text-sm">
//                   We've sent an order confirmation to your email with all the details.
//                 </p>
//               </div>
              
//               <div className="text-center p-6 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
//                 <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
//                   📱
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
//                 <p className="text-gray-600 text-sm">
//                   You'll receive tracking information once your order ships.
//                 </p>
//               </div>
              
//               <div className="text-center p-6 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
//                 <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
//                   🎁
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
//                 <p className="text-gray-600 text-sm">
//                   Flower care tips will be included with your delivery.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-4 justify-center">
//             <Link
//               to="/orders"
//               className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 flex items-center gap-2"
//             >
//               <ShoppingBag className="w-5 h-5" />
//               View All Orders
//             </Link>
//             <Link
//               to="/products"
//               className="border-2 border-pink-500 text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 flex items-center gap-2"
//             >
//               Continue Shopping
//             </Link>
//             <button
//               onClick={() => navigate('/')}
//               className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 flex items-center gap-2"
//             >
//               <Home className="w-5 h-5" />
//               Back to Home
//             </button>
//           </div>

//           {/* Auto Redirect Notice */}
//           <div className="text-center mt-8 text-gray-600">
//             <p>
//               Redirecting to orders page in{' '}
//               <span className="font-bold text-pink-600">{countdown}</span> seconds...
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           header, footer, button, .no-print {
//             display: none !important;
//           }
//           body {
//             background: white !important;
//           }
//           .print-only {
//             display: block !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OrderConfirmation;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ShoppingBag, 
  Package, 
  Truck, 
  Home, 
  Download, 
  Printer,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [toasts, setToasts] = useState([]);
  const [downloading, setDownloading] = useState(false);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    } else {
      navigate('/orders');
    }
  }, [id]);

  useEffect(() => {
    if (!order) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
      console.error('Error fetching order:', err);
      showToast('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
    showToast('Print dialog opened', 'info');
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      // Simulate API call for invoice generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('Invoice downloaded successfully', 'success');
    } catch (err) {
      showToast('Failed to download invoice', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
    showToast('Continue shopping', 'info');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: <CreditCard className="w-5 h-5" />,
      paypal: 'PP',
      cod: '💰',
    };
    return icons[method] || '💳';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error || 'The order could not be found.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors text-sm sm:text-base text-center"
            >
              View Orders
            </Link>
            <Link
              to="/products"
              className="border-2 border-pink-500 text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors text-sm sm:text-base text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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

      {/* Confirmation Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Order Confirmed!</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-4 sm:mb-6">
              Thank you for your purchase. Your order #{order._id.slice(-8).toUpperCase()} has been received.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <button
                onClick={handlePrintInvoice}
                className="bg-white text-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-green-50 flex items-center gap-2 transition-colors text-sm sm:text-base"
              >
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                Print Invoice
              </button>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="bg-white text-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-green-50 flex items-center gap-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${downloading ? 'animate-pulse' : ''}`} />
                {downloading ? 'Downloading...' : 'Download Invoice'}
              </button>
              <button
                onClick={handleContinueShopping}
                className="bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-emerald-700 flex items-center gap-2 transition-colors text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Order Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h2>
                  <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base ${getOrderStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Items Ordered</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-100 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            '🌸'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                            <span className="font-bold text-gray-900 text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 gap-1">
                            <span>Quantity: {item.quantity}</span>
                            <span>${item.price} each</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Order Timeline</h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6 sm:space-y-8">
                      {/* Order Placed */}
                      <div className="relative flex items-start">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Order Placed</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">Your order has been received</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                            <span>{formatTime(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Processing */}
                      <div className="relative flex items-start">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${order.orderStatus === 'pending' || order.orderStatus === 'processing' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <Package className={`w-4 h-4 sm:w-6 sm:h-6 ${order.orderStatus === 'pending' || order.orderStatus === 'processing' ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Processing</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">Preparing your order for shipment</p>
                          {order.orderStatus !== 'pending' && (
                            <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Estimated: {formatDate(new Date(Date.now() + 86400000))}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="relative flex items-start">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <Truck className={`w-4 h-4 sm:w-6 sm:h-6 ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'text-purple-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Shipping</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">Your order is on the way</p>
                          {order.trackingNumber && (
                            <div className="mt-1 sm:mt-2">
                              <p className="text-xs sm:text-sm text-gray-600">Tracking: <span className="font-mono font-bold">{order.trackingNumber}</span></p>
                              <Link 
                                to={`/orders/${order._id}/track`} 
                                className="text-pink-600 hover:text-pink-700 text-xs sm:text-sm font-medium flex items-center gap-1 mt-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Track Order
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="relative flex items-start">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${order.orderStatus === 'delivered' ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Home className={`w-4 h-4 sm:w-6 sm:h-6 ${order.orderStatus === 'delivered' ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Delivery</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">Your order has been delivered</p>
                          {order.deliveredAt && (
                            <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDate(order.deliveredAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 sticky top-4 sm:top-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>
                
                {/* Order Info */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Order Number</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs sm:text-sm">
                        {getPaymentMethodIcon(order.paymentMethod)}
                      </div>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                         order.paymentMethod === 'paypal' ? 'PayPal' : 
                         'Cash on Delivery'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    Shipping Address
                  </h4>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{order.shippingAddress.street}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">{order.shippingAddress.country}</p>
                    <div className="flex items-center gap-2 mt-2 text-gray-600 text-xs sm:text-sm">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 sm:space-y-3 border-t pt-4 sm:pt-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                    <span className="font-medium text-sm sm:text-base">${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">Shipping</span>
                    <span className="font-medium text-sm sm:text-base">
                      {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">Tax</span>
                    <span className="font-medium text-sm sm:text-base">${order.taxPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex justify-between text-lg sm:text-xl font-bold">
                      <span>Total</span>
                      <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg ${order.isPaid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {order.isPaid ? 'Payment Successful' : 'Payment Pending'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                        {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Complete payment to process order'}
                      </p>
                    </div>
                    {order.isPaid && (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Need Help */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Need Help?</h4>
                  <p className="text-xs sm:text-sm text-blue-700 mb-2 sm:mb-3">
                    Our customer support team is here to assist you.
                  </p>
                  <div className="space-y-1 sm:space-y-2">
                    <a href="mailto:support@bloombox.com" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">support@bloombox.com</span>
                    </a>
                    <a href="tel:+15551234567" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs sm:text-sm">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>(555) 123-4567</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">What's Next?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 border border-gray-200 rounded-lg sm:rounded-xl hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4 mx-auto">
                  📧
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Confirmation Email</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  We've sent an order confirmation to your email with all the details.
                </p>
              </div>
              
              <div className="text-center p-4 sm:p-6 border border-gray-200 rounded-lg sm:rounded-xl hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4 mx-auto">
                  📱
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Track Your Order</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
              
              <div className="text-center p-4 sm:p-6 border border-gray-200 rounded-lg sm:rounded-xl hover:border-pink-300 transition-colors">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4 mx-auto">
                  🎁
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Care Instructions</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Flower care tips will be included with your delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <Link
              to="/orders"
              className="bg-pink-500 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-pink-600 flex items-center gap-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-[140px]"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              View All Orders
            </Link>
            <Link
              to="/products"
              className="border-2 border-pink-500 text-pink-600 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-pink-50 flex items-center gap-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-[140px]"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-gray-300 text-gray-700 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center min-w-[140px]"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Home
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <div className="text-center mt-4 sm:mt-8 text-gray-600 text-sm sm:text-base">
            <p>
              Redirecting to orders page in{' '}
              <span className="font-bold text-pink-600">{countdown}</span> seconds...
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          header, footer, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .print-only {
            display: block !important;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;