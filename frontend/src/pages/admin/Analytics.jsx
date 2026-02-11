

import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Loader from '../../components/common/Loader';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for different analytics data
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);

  // Set default date range to last 30 days
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAllAnalytics();
    }
  }, [timeRange, startDate, endDate]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { 
        period: timeRange,
        ...(startDate && endDate ? { startDate, endDate } : {})
      };

      // Fetch all analytics data in parallel
      const [
        summaryRes,
        salesRes,
        revenueRes,
        productRes,
        customerRes,
        realtimeRes
      ] = await Promise.all([
        adminService.getAnalytics(params),
        adminService.getSalesReport(params),
        adminService.getRevenueAnalytics(params),
        adminService.getProductAnalytics(params),
        adminService.getUserAnalytics(params),
        adminService.getAnalytics({ timeframe: 'today' }) // For real-time data
      ]);

      setAnalyticsSummary(summaryRes.data);
      setSalesData(salesRes.data);
      setRevenueData(revenueRes.data);
      setProductData(productRes.data);
      setCustomerData(customerRes.data);
      setRealtimeData(realtimeRes.data);
      
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare revenue chart data
  const prepareRevenueChartData = () => {
    if (!revenueData?.revenueTrend) return null;

    const labels = revenueData.revenueTrend.map(item => {
      if (timeRange === 'day') {
        return formatDate(item._id, 'MMM dd');
      } else if (timeRange === 'week') {
        return `Week ${item._id.week}, ${item._id.year}`;
      } else if (timeRange === 'year') {
        return item._id.year.toString();
      } else {
        // month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[item._id.month - 1]} ${item._id.year}`;
      }
    });

    const data = revenueData.revenueTrend.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Prepare sales chart data
  const prepareSalesChartData = () => {
    if (!salesData?.salesData) return null;

    const labels = salesData.salesData.map(item => {
      if (timeRange === 'day') {
        return formatDate(item._id, 'MMM dd');
      } else if (timeRange === 'week') {
        return `Week ${item._id.week}, ${item._id.year}`;
      } else if (timeRange === 'year') {
        return item._id.year.toString();
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[item._id.month - 1]} ${item._id.year}`;
      }
    });

    const data = salesData.salesData.map(item => item.totalOrders);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Orders',
          data,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare category distribution data
  const prepareCategoryChartData = () => {
    if (!productData?.categoryPerformance) return null;

    const topCategories = productData.categoryPerformance.slice(0, 5);
    
    return {
      labels: topCategories.map(item => item.category || 'Uncategorized'),
      datasets: [
        {
          data: topCategories.map(item => item.totalRevenue),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(14, 165, 233, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Get top products from product analytics
  const getTopProducts = () => {
    if (!productData?.productPerformance) return [];
    
    return productData.productPerformance.slice(0, 5).map(product => ({
      name: product.name,
      sales: product.totalSold,
      revenue: product.totalRevenue,
      category: product.category,
      conversion: product.totalSold // Simplified conversion metric
    }));
  };

  // Calculate metrics from analytics data
  const calculateMetrics = () => {
    if (!analyticsSummary) return null;

    const summary = analyticsSummary.summary;
    const customerStats = customerData?.repeatCustomers || {};

    return {
      conversionRate: summary?.revenueGrowth || 0,
      avgOrderValue: summary?.totalOrders > 0 ? summary.totalRevenue / summary.totalOrders : 0,
      customerRetention: customerStats.repeatCustomers > 0 
        ? (customerStats.repeatCustomers / (customerStats.totalCustomers || 1)) * 100 
        : 0,
      newCustomers: summary?.totalCustomers || 0,
      returningCustomers: customerStats.repeatCustomers || 0
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label?.toLowerCase().includes('revenue')) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y.toLocaleString();
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (this.chart.data.datasets[0].label?.toLowerCase().includes('revenue')) {
              return formatCurrency(value);
            }
            return value.toLocaleString();
          }
        }
      }
    }
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const handleDateRangeChange = () => {
    fetchAllAnalytics();
  };

  if (loading && !analyticsSummary) return <Loader />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  const metrics = calculateMetrics();
  const revenueChartData = prepareRevenueChartData();
  const salesChartData = prepareSalesChartData();
  const categoryChartData = prepareCategoryChartData();
  const topProducts = getTopProducts();

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Track performance metrics and gain insights into your business
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
              <button 
                onClick={handleDateRangeChange}
                className="btn-secondary"
              >
                Apply
              </button>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field w-32"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
            <button 
              onClick={fetchAllAnalytics}
              className="btn-primary"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      {realtimeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Today's Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {realtimeData.today?.orders || 0}
            </p>
            <div className="mt-2">
              <span className={`text-xs ${realtimeData.comparisons?.orders?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {realtimeData.comparisons?.orders?.isPositive ? '↑' : '↓'} {realtimeData.comparisons?.orders?.value || 0}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Today's Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(realtimeData.today?.revenue || 0)}
            </p>
            <div className="mt-2">
              <span className={`text-xs ${realtimeData.comparisons?.revenue?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {realtimeData.comparisons?.revenue?.isPositive ? '↑' : '↓'} {realtimeData.comparisons?.revenue?.value || 0}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {realtimeData.alerts?.pendingOrders || 0}
            </p>
            <div className="mt-2">
              <span className="text-xs text-yellow-600">
                Requires attention
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Low Stock Items</p>
            <p className="text-2xl font-semibold text-gray-900">
              {realtimeData.alerts?.lowStockCount || 0}
            </p>
            <div className="mt-2">
              <span className="text-xs text-red-600">
                Check inventory
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics from Analytics Summary */}
      {analyticsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(analyticsSummary.summary?.totalRevenue || 0)}
            </p>
            <div className="mt-2">
              <span className={`text-xs ${analyticsSummary.summary?.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsSummary.summary?.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsSummary.summary?.revenueGrowth || 0)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">growth</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {analyticsSummary.summary?.totalOrders || 0}
            </p>
            <div className="mt-2">
              <span className={`text-xs ${analyticsSummary.summary?.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsSummary.summary?.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsSummary.summary?.ordersGrowth || 0)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">growth</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Avg. Order Value</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(metrics?.avgOrderValue || 0)}
            </p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">per order</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">New Customers</p>
            <p className="text-2xl font-semibold text-gray-900">
              {analyticsSummary.summary?.totalCustomers || 0}
            </p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">this period</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Top Products</p>
            <p className="text-2xl font-semibold text-gray-900">
              {productData?.productPerformance?.length || 0}
            </p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">tracked</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        {revenueChartData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Sales Chart */}
        {salesChartData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sales Volume</h3>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Bar data={salesChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        {categoryChartData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
            </div>
            <div className="p-6">
              <div className="h-64">
                <Pie data={categoryChartData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          </div>
          <div className="p-6">
            {topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-primary-600 font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.category || 'Uncategorized'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{product.sales}</div>
                          <div className="text-xs text-gray-500">units sold</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(product.revenue)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ 
                                  width: `${topProducts[0]?.sales > 0 ? (product.sales / topProducts[0].sales) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                              {topProducts[0]?.sales > 0 
                                ? Math.round((product.sales / topProducts[0].sales) * 100) 
                                : 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No product data available for the selected period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders from Real-time Data */}
      {realtimeData?.recentOrders && realtimeData.recentOrders.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {realtimeData.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-6)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {order.user?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user?.email || ''}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.createdAt, 'hh:mm a')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Insights */}
      {customerData && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1 mr-3"></div>
                <span className="text-sm text-gray-700">
                  {customerData.repeatCustomers?.repeatCustomers || 0} repeat customers ({Math.round((customerData.repeatCustomers?.repeatCustomers || 0) / (customerData.repeatCustomers?.totalCustomers || 1) * 100)}%)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1 mr-3"></div>
                <span className="text-sm text-gray-700">
                  {customerData.repeatCustomers?.loyalCustomers || 0} loyal customers (5+ orders)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-1 mr-3"></div>
                <span className="text-sm text-gray-700">
                  Customer growth: {customerData.customerGrowth?.reduce((sum, item) => sum + item.newCustomers, 0) || 0} new customers this period
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-xs">1</span>
                </div>
                <span className="text-sm text-gray-700">
                  Focus on categories with highest revenue growth
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-xs">2</span>
                </div>
                <span className="text-sm text-gray-700">
                  Replenish low stock items to avoid lost sales
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 text-xs">3</span>
                </div>
                <span className="text-sm text-gray-700">
                  Create promotions for underperforming categories
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;