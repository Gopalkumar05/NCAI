
// import React, { useState, useEffect } from 'react';
// import { adminService } from '../../services/adminService';
// import { toast } from 'react-toastify';
// import { 
//   DollarSign, 
//   Package, 
//   Flower, 
//   Users,
//   TrendingUp,
//   TrendingDown,
//   ChevronRight,
//   RefreshCw
// } from 'lucide-react';

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [revenueTrend, setRevenueTrend] = useState(0);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch dashboard stats
//       const statsResponse = await adminService.getStats();
//       setStats(statsResponse.data);
//       setRevenueTrend(statsResponse.data.revenueChange || 0);
      
//       // Fetch recent orders
//       const ordersResponse = await adminService.getRecentOrders();
//       setRecentOrders(ordersResponse.data);
//     } catch (error) {
//       toast.error('Failed to load dashboard data');
//       console.error('Dashboard error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchDashboardData();
//     toast.info('Refreshing dashboard...');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 md:space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
//         >
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Refresh
//         </button>
//       </div>

//       {/* Stats Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         <StatCard
//           title="Total Revenue"
//           value={`$${stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
//           icon={<DollarSign className="h-6 w-6" />}
//           color="green"
//           trend={revenueTrend}
//           trendLabel="vs last month"
//         />
//         <StatCard
//           title="Total Orders"
//           value={stats?.totalOrders?.toLocaleString() || 0}
//           icon={<Package className="h-6 w-6" />}
//           color="blue"
//           subtitle="This month"
//         />
//         <StatCard
//           title="Total Products"
//           value={stats?.totalProducts?.toLocaleString() || 0}
//           icon={<Flower className="h-6 w-6" />}
//           color="purple"
//           subtitle="Active listings"
//         />
//         <StatCard
//           title="Total Users"
//           value={stats?.totalUsers?.toLocaleString() || 0}
//           icon={<Users className="h-6 w-6" />}
//           color="indigo"
//           subtitle="Registered users"
//         />
//       </div>

//       {/* Recent Orders Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
//               <p className="text-sm text-gray-600 mt-1">Latest customer orders</p>
//             </div>
//             <a
//               href="/admin/orders"
//               className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
//             >
//               View all orders
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </a>
//           </div>
//         </div>
        
//         {/* Mobile Cards View */}
//         <div className="sm:hidden">
//           {recentOrders.length > 0 ? (
//             <div className="divide-y divide-gray-200">
//               {recentOrders.slice(0, 5).map((order) => (
//                 <div key={order._id} className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <p className="font-medium text-gray-900">Order #{order.orderId}</p>
//                       <p className="text-sm text-gray-600">{order.user?.name}</p>
//                     </div>
//                     <StatusBadge status={order.orderStatus} />
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="font-medium text-gray-900">
//                       ${order.totalPrice?.toFixed(2) || '0.00'}
//                     </span>
//                     <span className="text-gray-500">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Package className="h-12 w-12 text-gray-400 mx-auto" />
//               <p className="mt-4 text-gray-500">No orders found</p>
//             </div>
//           )}
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden sm:block overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentOrders.length > 0 ? (
//                 recentOrders.slice(0, 10).map((order) => (
//                   <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{order.orderId}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div>
//                         <p className="font-medium">{order.user?.name}</p>
//                         <p className="text-gray-500 text-xs">{order.user?.email}</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       ${order.totalPrice?.toFixed(2) || '0.00'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <StatusBadge status={order.orderStatus} />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(order.createdAt).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric'
//                       })}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-12 text-center">
//                     <Package className="h-12 w-12 text-gray-400 mx-auto" />
//                     <p className="mt-4 text-gray-500">No orders found</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer with pagination/view more */}
//         {recentOrders.length > 0 && (
//           <div className="px-4 py-3 sm:px-6 border-t border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{Math.min(recentOrders.length, 10)}</span> of{' '}
//                 <span className="font-medium">{recentOrders.length}</span> orders
//               </p>
//               <a
//                 href="/admin/orders"
//                 className="text-sm font-medium text-primary-600 hover:text-primary-700"
//               >
//                 View all orders →
//               </a>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Quick Stats Row for Mobile */}
//       <div className="lg:hidden grid grid-cols-2 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Avg. Order Value</p>
//           <p className="text-lg font-bold text-gray-900">
//             ${stats?.averageOrderValue?.toFixed(2) || '0.00'}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Conversion Rate</p>
//           <p className="text-lg font-bold text-gray-900">
//             {stats?.conversionRate?.toFixed(1) || '0.0'}%
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon, color, trend, trendLabel, subtitle }) => {
//   const colorConfig = {
//     green: {
//       bg: 'bg-green-50',
//       iconBg: 'bg-green-100',
//       text: 'text-green-700',
//       trendUp: 'text-green-600',
//       trendDown: 'text-red-600'
//     },
//     blue: {
//       bg: 'bg-blue-50',
//       iconBg: 'bg-blue-100',
//       text: 'text-blue-700',
//       trendUp: 'text-blue-600',
//       trendDown: 'text-red-600'
//     },
//     purple: {
//       bg: 'bg-purple-50',
//       iconBg: 'bg-purple-100',
//       text: 'text-purple-700',
//       trendUp: 'text-purple-600',
//       trendDown: 'text-red-600'
//     },
//     indigo: {
//       bg: 'bg-indigo-50',
//       iconBg: 'bg-indigo-100',
//       text: 'text-indigo-700',
//       trendUp: 'text-indigo-600',
//       trendDown: 'text-red-600'
//     }
//   };

//   const config = colorConfig[color] || colorConfig.green;

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 transition-transform duration-200 hover:shadow-md">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          
//           {subtitle && (
//             <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
//           )}
          
//           {trend !== undefined && (
//             <div className="flex items-center mt-2">
//               {trend >= 0 ? (
//                 <TrendingUp className={`h-4 w-4 ${config.trendUp} mr-1`} />
//               ) : (
//                 <TrendingDown className={`h-4 w-4 ${config.trendDown} mr-1`} />
//               )}
//               <span className={`text-sm font-medium ${trend >= 0 ? config.trendUp : config.trendDown}`}>
//                 {trend >= 0 ? '+' : ''}{trend}%
//               </span>
//               {trendLabel && (
//                 <span className="text-xs text-gray-500 ml-2">{trendLabel}</span>
//               )}
//             </div>
//           )}
//         </div>
//         <div className={`p-3 rounded-lg ${config.iconBg} ${config.text}`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     pending: {
//       color: 'bg-yellow-100 text-yellow-800',
//       label: 'Pending',
//       icon: '⏳'
//     },
//     processing: {
//       color: 'bg-blue-100 text-blue-800',
//       label: 'Processing',
//       icon: '🔄'
//     },
//     shipped: {
//       color: 'bg-purple-100 text-purple-800',
//       label: 'Shipped',
//       icon: '🚚'
//     },
//     delivered: {
//       color: 'bg-green-100 text-green-800',
//       label: 'Delivered',
//       icon: '✅'
//     },
//     cancelled: {
//       color: 'bg-red-100 text-red-800',
//       label: 'Cancelled',
//       icon: '❌'
//     }
//   };

//   const config = statusConfig[status?.toLowerCase()] || {
//     color: 'bg-gray-100 text-gray-800',
//     label: status || 'Unknown',
//     icon: '❓'
//   };

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
//       <span className="mr-1.5">{config.icon}</span>
//       {config.label}
//     </span>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Package, 
  Flower, 
  Users,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  RefreshCw,
  Calendar,
  ShoppingCart,
  BarChart3,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState(0);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await adminService.getStats({ timeframe });
      setStats(statsResponse.data);
      setRevenueTrend(statsResponse.data.revenueChange || 0);
      
      // Fetch recent orders
      const ordersResponse = await adminService.getRecentOrders();
      setRecentOrders(ordersResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast.info('Refreshing dashboard...');
  };

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}`}
          icon={<DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="green"
          trend={revenueTrend}
          trendLabel="vs last period"
          subtitle={timeframes.find(t => t.value === timeframe)?.label}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || 0}
          icon={<Package className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="blue"
          trend={stats?.orderChange || 0}
          trendLabel="vs last period"
          subtitle={`${stats?.avgDailyOrders || 0}/day avg`}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toLocaleString() || 0}
          icon={<Flower className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="purple"
          subtitle={`${stats?.activeProducts || 0} active`}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || 0}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="indigo"
          trend={stats?.userChange || 0}
          trendLabel="new this period"
          subtitle={`${stats?.activeUsers || 0} active`}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MiniStatCard
          title="Avg. Order Value"
          value={`$${stats?.averageOrderValue?.toFixed(2) || '0.00'}`}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <MiniStatCard
          title="Conversion Rate"
          value={`${stats?.conversionRate?.toFixed(1) || '0.0'}%`}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <MiniStatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={<AlertCircle className="h-4 w-4" />}
          color="warning"
        />
        <MiniStatCard
          title="Top Product"
          value={stats?.topProduct || 'N/A'}
          icon={<Flower className="h-4 w-4" />}
          isText={true}
        />
      </div>

      {/* Charts and Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Orders - Takes 2/3 on desktop */}
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>

        {/* Quick Stats - Takes 1/3 on desktop */}
        <div className="space-y-4 md:space-y-6">
          <QuickStats stats={stats} />
          <PopularProducts products={stats?.popularProducts || []} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, trendLabel, subtitle }) => {
  const colorConfig = {
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      text: 'text-green-700',
      trendUp: 'text-green-600',
      trendDown: 'text-red-600'
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      text: 'text-blue-700',
      trendUp: 'text-blue-600',
      trendDown: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      text: 'text-purple-700',
      trendUp: 'text-purple-600',
      trendDown: 'text-red-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      text: 'text-indigo-700',
      trendUp: 'text-indigo-600',
      trendDown: 'text-red-600'
    }
  };

  const config = colorConfig[color] || colorConfig.green;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 truncate">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
          
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {trend >= 0 ? (
                <TrendingUp className={`h-4 w-4 ${config.trendUp} mr-1 flex-shrink-0`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${config.trendDown} mr-1 flex-shrink-0`} />
              )}
              <span className={`text-sm font-medium ${trend >= 0 ? config.trendUp : config.trendDown} truncate`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-gray-500 ml-2 truncate hidden sm:inline">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${config.iconBg} ${config.text} ml-3 flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const MiniStatCard = ({ title, value, icon, color = 'default', isText = false }) => {
  const colorClasses = {
    default: 'bg-blue-50 text-blue-700',
    warning: 'bg-yellow-50 text-yellow-700',
    success: 'bg-green-50 text-green-700',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          <p className={`text-lg sm:text-xl font-bold truncate ${isText ? 'text-gray-900' : ''}`}>
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]} ml-2 flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-600 mt-1">Latest customer orders</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all orders
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Mobile Cards View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {orders.length > 0 ? (
          orders.slice(0, 5).map((order) => (
            <div key={order._id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-600 truncate">{order.user?.name}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900">
                  ${order.totalPrice?.toFixed(2) || '0.00'}
                </span>
                <span className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Order ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.slice(0, 10).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {order.user?.name}
                          </p>
                          <p className="text-gray-500 text-xs truncate max-w-[120px] sm:max-w-none">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="mt-4 text-gray-500">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      {orders.length > 0 && (
        <div className="px-4 py-3 sm:px-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{Math.min(orders.length, 10)}</span> of{' '}
              <span className="font-medium">{orders.length}</span> orders
            </p>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all orders →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Revenue Today</span>
          <span className="font-medium text-gray-900">
            ${stats?.todayRevenue?.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Orders Today</span>
          <span className="font-medium text-gray-900">{stats?.todayOrders || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">New Customers</span>
          <span className="font-medium text-gray-900">{stats?.newCustomers || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Inventory Value</span>
          <span className="font-medium text-gray-900">
            ${stats?.inventoryValue?.toLocaleString() || '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

const PopularProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Products</h3>
      <div className="space-y-3">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[150px]">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{product.sales} sold</p>
                <p className="text-xs text-gray-500">${product.revenue?.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No product data available</p>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Pending',
      icon: '⏳'
    },
    processing: {
      color: 'bg-blue-100 text-blue-800',
      label: 'Processing',
      icon: '🔄'
    },
    shipped: {
      color: 'bg-purple-100 text-purple-800',
      label: 'Shipped',
      icon: '🚚'
    },
    delivered: {
      color: 'bg-green-100 text-green-800',
      label: 'Delivered',
      icon: '✅'
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      label: 'Cancelled',
      icon: '❌'
    }
  };

  const config = statusConfig[status?.toLowerCase()] || {
    color: 'bg-gray-100 text-gray-800',
    label: status || 'Unknown',
    icon: '❓'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className="mr-1.5">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default Dashboard;