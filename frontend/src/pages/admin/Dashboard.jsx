

import { useState, useEffect } from 'react';
import StatsCard from '../../components/admin/StatsCard';
import RecentOrders from '../../components/admin/RecentOrders';
import RevenueChart from '../../components/admin/RevenueChart';
import Loader from '../../components/common/Loader';
import { adminService } from '../../services/adminService';
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  SparklesIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange, refreshKey]);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats({ timeRange });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setLoading(true);
  };

  if (loading) return <Loader />;

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Top Performance</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {stats?.performance?.topMetric || 'Revenue'}
              </p>
            </div>
            <FireIcon className="h-8 w-8 opacity-90" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>{stats?.performance?.change || '+18%'} this period</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {stats?.activeUsers?.toLocaleString() || '0'}
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 opacity-90" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>{stats?.userGrowth || '+12%'} growth</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Conversion Rate</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {stats?.conversionRate || '4.5'}%
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 opacity-90" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            {stats?.conversionChange >= 0 ? (
              <>
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span>+{stats?.conversionChange || '0.5'}%</span>
              </>
            ) : (
              <>
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                <span>{stats?.conversionChange || '0'}%</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Attention Needed</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {stats?.attentionItems || '3'} items
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 opacity-90" />
          </div>
          <div className="mt-4 text-sm">
            <span>Low stock & pending orders</span>
          </div>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          change={stats.userChange || 12}
          color="primary"
          trend={stats.userTrend || 'up'}
          subtitle="Registered users"
          size="medium"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBagIcon}
          change={stats.productChange || 8}
          color="green"
          trend={stats.productTrend || 'up'}
          subtitle="Active listings"
          size="medium"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ClipboardDocumentListIcon}
          change={stats.orderChange || 15}
          color="blue"
          trend={stats.orderTrend || 'up'}
          subtitle={timeRanges.find(t => t.id === timeRange)?.label}
          size="medium"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          change={stats.revenueChange || 18}
          color="purple"
          trend={stats.revenueTrend || 'up'}
          subtitle={`Avg: $${(stats.totalRevenue / stats.totalOrders || 0).toFixed(2)}`}
          size="medium"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Pending Orders</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                {stats.pendingOrders || 0}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded-lg">
              <ClipboardDocumentListIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Completed</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                {stats.completedOrders || 0}
              </p>
            </div>
            <div className="bg-green-100 text-green-800 p-2 rounded-lg">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Avg. Session</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                {stats.avgSessionDuration || '4:30'}m
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
              <ChartBarIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Bounce Rate</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                {stats.bounceRate || '42'}%
              </p>
            </div>
            <div className="bg-purple-100 text-purple-800 p-2 rounded-lg">
              <ArrowTrendingDownIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart - Takes 2/3 on desktop */}
        <div className="lg:col-span-2">
          <RevenueChart 
            data={stats.monthlyRevenue} 
            timeRange={timeRange}
          />
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-600">Avg. Order Value</p>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    +12%
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  ${(stats.totalRevenue / stats.totalOrders || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    +2.1%
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.conversionRate || '4.5'}%
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-600">Active Users</p>
                  <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    +8%
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {Math.round(stats.totalUsers * 0.65).toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    4.8/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: '96%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {stats.topProducts?.slice(0, 3).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {product.sales?.toLocaleString()} sold
                    </p>
                    <p className="text-xs text-gray-500">
                      ${product.revenue?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <RecentOrders 
        orders={stats.recentOrders} 
        title="Recent Orders"
        showViewAll={true}
        limit={5}
      />

      {/* Mobile Only Summary */}
      <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">New Customers</p>
            <p className="text-lg font-bold text-gray-900">{stats.newCustomers || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Repeat Rate</p>
            <p className="text-lg font-bold text-gray-900">{stats.repeatRate || '45'}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Refund Rate</p>
            <p className="text-lg font-bold text-gray-900">{stats.refundRate || '2.5'}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Stock Alert</p>
            <p className="text-lg font-bold text-gray-900">{stats.lowStockItems || 5}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;