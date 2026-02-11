// components/Invoice.jsx
import React, { useState, useEffect } from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFViewer,
  Image,
  Font
} from '@react-pdf/renderer';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail,
  Home,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';

// Register fonts (optional - for better typography)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf' }, // regular
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 }, // bold
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#ec4899',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 15,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  invoiceSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    width: '40%',
  },
  value: {
    fontSize: 12,
    color: '#111827',
    width: '60%',
    textAlign: 'right',
    fontWeight: 'normal',
  },
  boldValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: 'bold',
    width: '60%',
    textAlign: 'right',
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '25%', textAlign: 'right' },
  summary: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 12,
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  statusBadge: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ec4899',
    marginLeft: 10,
  },
});

// PDF Document Component
const InvoicePDF = ({ order }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={{ width: 40, height: 40, backgroundColor: '#ec4899', borderRadius: 8 }} />
            <Text style={styles.logoText}>BloomBoutique</Text>
          </View>
          <Text style={styles.companyTagline}>Beautiful Flowers for Every Occasion</Text>
          
          <View style={[styles.row, { marginBottom: 15 }]}>
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceSubtitle}>Order #{order._id?.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={{
              backgroundColor: getStatusColor(order.orderStatus),
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
              <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold' }}>
                {order.orderStatus?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>INV-{order._id?.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Number:</Text>
            <Text style={styles.value}>ORD-{order._id?.slice(-8).toUpperCase()}</Text>
          </View>
          {order.paidAt && (
            <View style={styles.row}>
              <Text style={styles.label}>Payment Date:</Text>
              <Text style={styles.value}>{formatDate(order.paidAt)}</Text>
            </View>
          )}
        </View>

        {/* Billing & Shipping Info */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ width: '50%' }}>
            <Text style={styles.sectionTitle}>Billing Information</Text>
            <Text style={{ fontSize: 12, color: '#111827', marginBottom: 5 }}>
              {order.user?.name || 'Customer'}
            </Text>
            {order.shippingAddress && (
              <>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  {order.shippingAddress.street}
                </Text>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Text>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  {order.shippingAddress.country}
                </Text>
                {order.shippingAddress.phone && (
                  <Text style={{ fontSize: 10, color: '#6b7280' }}>
                    Phone: {order.shippingAddress.phone}
                  </Text>
                )}
              </>
            )}
          </View>
          
          <View style={{ width: '50%' }}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            {order.shippingAddress ? (
              <>
                <Text style={{ fontSize: 12, color: '#111827', marginBottom: 5 }}>Shipping to:</Text>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  {order.shippingAddress.street}
                </Text>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Text>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  {order.shippingAddress.country}
                </Text>
              </>
            ) : (
              <Text style={{ fontSize: 10, color: '#6b7280' }}>Same as billing address</Text>
            )}
          </View>
        </View>

        {/* Order Items Table */}
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.col1]}>Description</Text>
            <Text style={[styles.tableCell, styles.col2]}>Qty</Text>
            <Text style={[styles.tableCell, styles.col3]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.col4]}>Total</Text>
          </View>
          
          {/* Table Rows */}
          {order.orderItems?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {item.name || item.product?.name}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.quantity || 1}</Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {formatCurrency(item.price)}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {formatCurrency((item.price || 0) * (item.quantity || 1))}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.itemsPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.shippingPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.taxPrice)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalPrice)}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
              {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
               order.paymentMethod === 'paypal' ? 'PayPal' : 
               order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'N/A'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.boldValue}>
              {order.isPaid ? 'PAID' : 'PENDING'}
            </Text>
          </View>
          {order.paymentResult?.id && (
            <View style={styles.row}>
              <Text style={styles.label}>Transaction ID:</Text>
              <Text style={[styles.value, { fontSize: 9 }]}>{order.paymentResult.id}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>BloomBoutique • 123 Flower Street, Garden City, GC 12345</Text>
          <Text>Phone: (123) 456-7890 • Email: info@bloomboutique.com • Website: www.bloomboutique.com</Text>
          <Text style={{ marginTop: 5 }}>
            This is a computer-generated invoice. No signature required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Invoice Component
const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id && id !== 'undefined') {
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
      
      const response = await orderService.getOrderById(id);
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

  const handleDownloadPDF = async () => {
    if (!order) return;
    
    setDownloading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<InvoicePDF order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order._id.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = () => {
    alert('Email invoice feature will be available soon!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Invoice not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to generate invoice for this order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/orders/${id}`)}
              className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Back to Order
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="flex items-center gap-2 text-white hover:text-white/90 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Order
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Invoice #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-white/90">
                Preview and download your invoice
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              downloading 
                ? 'bg-pink-400 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download PDF
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Invoice
          </button>
          <button
            onClick={handleEmailInvoice}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Email Invoice
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>
            <p className="text-sm text-gray-600">Scroll to view the entire invoice</p>
          </div>
          <div className="h-[600px]">
            <PDFViewer width="100%" height="100%">
              <InvoicePDF order={order} />
            </PDFViewer>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${(order.itemsPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">${(order.shippingPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${(order.taxPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-gray-900">
                  ${(order.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium">
                  {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                   order.paymentMethod === 'paypal' ? 'PayPal' : 
                   order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-sm text-gray-600">Paid On</p>
                  <p className="font-medium">
                    {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Invoice Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Invoice Number</p>
                <p className="font-medium">
                  INV-{order._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="font-medium">
                  {order.orderItems?.length || 0} items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about this invoice or need to make changes, please contact our support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:support@bloomboutique.com" 
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              support@bloomboutique.com
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">(123) 456-7890</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Mon-Fri 9am-6pm EST</span>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
        
        /* PDF Viewer styling */
        .react-pdf__Page {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};

export default Invoice;