// const asyncHandler = require('express-async-handler');
// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const User = require('../models/User');

// // @desc    Get sales analytics
// // @route   GET /api/analytics/sales
// // @access  Private/Admin
// const getSalesAnalytics = asyncHandler(async (req, res) => {
//   const { period = 'month', startDate, endDate } = req.query;
  
//   let matchStage = {};
//   if (startDate && endDate) {
//     matchStage.createdAt = {
//       $gte: new Date(startDate),
//       $lte: new Date(endDate)
//     };
//   }
  
//   let groupFormat;
//   switch (period) {
//     case 'day':
//       groupFormat = { 
//         year: { $year: '$createdAt' },
//         month: { $month: '$createdAt' },
//         day: { $dayOfMonth: '$createdAt' }
//       };
//       break;
//     case 'week':
//       groupFormat = { 
//         year: { $year: '$createdAt' },
//         week: { $week: '$createdAt' }
//       };
//       break;
//     default: // month
//       groupFormat = { 
//         year: { $year: '$createdAt' },
//         month: { $month: '$createdAt' }
//       };
//   }
  
//   const salesData = await Order.aggregate([
//     { $match: { ...matchStage, isPaid: true } },
//     {
//       $group: {
//         _id: groupFormat,
//         totalSales: { $sum: '$totalPrice' },
//         totalOrders: { $sum: 1 },
//         averageOrderValue: { $avg: '$totalPrice' }
//       }
//     },
//     { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
//   ]);
  
//   const topProducts = await Order.aggregate([
//     { $match: { ...matchStage, isPaid: true } },
//     { $unwind: '$orderItems' },
//     {
//       $group: {
//         _id: '$orderItems.product',
//         totalSold: { $sum: '$orderItems.quantity' },
//         totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
//       }
//     },
//     { $sort: { totalSold: -1 } },
//     { $limit: 10 },
//     {
//       $lookup: {
//         from: 'products',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'product'
//       }
//     },
//     { $unwind: '$product' }
//   ]);
  
//   const customerStats = await Order.aggregate([
//     { $match: { ...matchStage, isPaid: true } },
//     {
//       $group: {
//         _id: '$user',
//         totalSpent: { $sum: '$totalPrice' },
//         orderCount: { $sum: 1 }
//       }
//     },
//     { $sort: { totalSpent: -1 } },
//     { $limit: 10 },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'user'
//       }
//     },
//     { $unwind: '$user' }
//   ]);
  
//   res.json({
//     salesData,
//     topProducts,
//     customerStats,
//     period,
//     dateRange: { startDate, endDate }
//   });
// });

// // @desc    Get inventory analytics
// // @route   GET /api/analytics/inventory
// // @access  Private/Admin
// const getInventoryAnalytics = asyncHandler(async (req, res) => {
//   const lowStockThreshold = 10;
  
//   const inventoryStats = await Product.aggregate([
//     {
//       $group: {
//         _id: '$category',
//         totalProducts: { $sum: 1 },
//         totalStock: { $sum: '$stock' },
//         totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
//         lowStockItems: {
//           $sum: {
//             $cond: [{ $lt: ['$stock', lowStockThreshold] }, 1, 0]
//           }
//         }
//       }
//     },
//     { $sort: { totalValue: -1 } }
//   ]);
  
//   const lowStockProducts = await Product.find({
//     stock: { $lt: lowStockThreshold },
//     isAvailable: true
//   }).sort({ stock: 1 }).limit(20);
  
//   const bestSellingCategories = await Order.aggregate([
//     { $match: { isPaid: true } },
//     { $unwind: '$orderItems' },
//     {
//       $lookup: {
//         from: 'products',
//         localField: 'orderItems.product',
//         foreignField: '_id',
//         as: 'product'
//       }
//     },
//     { $unwind: '$product' },
//     {
//       $group: {
//         _id: '$product.category',
//         totalSold: { $sum: '$orderItems.quantity' },
//         totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
//       }
//     },
//     { $sort: { totalRevenue: -1 } }
//   ]);
  
//   res.json({
//     inventoryStats,
//     lowStockProducts,
//     bestSellingCategories,
//     lowStockThreshold
//   });
// });

// // @desc    Get customer analytics
// // @route   GET /api/analytics/customers
// // @access  Private/Admin
// const getCustomerAnalytics = asyncHandler(async (req, res) => {
//   const { timeframe = 'all' } = req.query;
  
//   let dateFilter = {};
//   const now = new Date();
  
//   switch (timeframe) {
//     case 'today':
//       dateFilter = {
//         createdAt: {
//           $gte: new Date(now.setHours(0, 0, 0, 0)),
//           $lte: new Date(now.setHours(23, 59, 59, 999))
//         }
//       };
//       break;
//     case 'week':
//       const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       dateFilter = { createdAt: { $gte: weekAgo } };
//       break;
//     case 'month':
//       const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       dateFilter = { createdAt: { $gte: monthAgo } };
//       break;
//   }
  
//   const customerGrowth = await User.aggregate([
//     { $match: { ...dateFilter, role: 'customer' } },
//     {
//       $group: {
//         _id: {
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' },
//           day: { $dayOfMonth: '$createdAt' }
//         },
//         newCustomers: { $sum: 1 }
//       }
//     },
//     { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
//   ]);
  
//   const customerLifetimeValue = await Order.aggregate([
//     { $match: { isPaid: true } },
//     {
//       $group: {
//         _id: '$user',
//         totalSpent: { $sum: '$totalPrice' },
//         firstOrder: { $min: '$createdAt' },
//         lastOrder: { $max: '$createdAt' },
//         orderCount: { $sum: 1 }
//       }
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'user'
//       }
//     },
//     { $unwind: '$user' },
//     { $sort: { totalSpent: -1 } },
//     { $limit: 20 }
//   ]);
  
//   const repeatCustomers = await Order.aggregate([
//     { $match: { isPaid: true } },
//     {
//       $group: {
//         _id: '$user',
//         orderCount: { $sum: 1 }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         totalCustomers: { $sum: 1 },
//         singlePurchase: {
//           $sum: { $cond: [{ $eq: ['$orderCount', 1] }, 1, 0] }
//         },
//         repeatCustomers: {
//           $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
//         },
//         loyalCustomers: {
//           $sum: { $cond: [{ $gt: ['$orderCount', 5] }, 1, 0] }
//         }
//       }
//     }
//   ]);
  
//   res.json({
//     customerGrowth,
//     customerLifetimeValue,
//     repeatCustomers: repeatCustomers[0] || {},
//     timeframe
//   });
// });

// // @desc    Get real-time dashboard data
// // @route   GET /api/analytics/realtime
// // @access  Private/Admin
// const getRealtimeData = asyncHandler(async (req, res) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
  
//   // Today's stats
//   const todayOrders = await Order.countDocuments({
//     createdAt: { $gte: today },
//     isPaid: true
//   });
  
//   const todayRevenue = await Order.aggregate([
//     { 
//       $match: { 
//         createdAt: { $gte: today },
//         isPaid: true 
//       } 
//     },
//     { $group: { _id: null, total: { $sum: '$totalPrice' } } }
//   ]);
  
//   const todayNewCustomers = await User.countDocuments({
//     createdAt: { $gte: today },
//     role: 'customer'
//   });
  
//   // Yesterday's stats for comparison
//   const yesterdayOrders = await Order.countDocuments({
//     createdAt: { $gte: yesterday, $lt: today },
//     isPaid: true
//   });
  
//   const yesterdayRevenue = await Order.aggregate([
//     { 
//       $match: { 
//         createdAt: { $gte: yesterday, $lt: today },
//         isPaid: true 
//       } 
//     },
//     { $group: { _id: null, total: { $sum: '$totalPrice' } } }
//   ]);
  
//   // Current pending orders
//   const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  
//   // Low stock alerts
//   const lowStockCount = await Product.countDocuments({
//     stock: { $lt: 10 },
//     isAvailable: true
//   });
  
//   // Recent orders (last 5)
//   const recentOrders = await Order.find()
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .populate('user', 'name email')
//     .select('_id totalPrice orderStatus createdAt');
  
//   // Calculate percentage changes
//   const orderChange = yesterdayOrders > 0 
//     ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1)
//     : 0;
  
//   const revenueChange = yesterdayRevenue[0]?.total > 0 
//     ? ((todayRevenue[0]?.total || 0 - yesterdayRevenue[0]?.total) / yesterdayRevenue[0]?.total * 100).toFixed(1)
//     : 0;
  
//   res.json({
//     today: {
//       orders: todayOrders,
//       revenue: todayRevenue[0]?.total || 0,
//       newCustomers: todayNewCustomers
//     },
//     comparisons: {
//       orders: {
//         value: orderChange,
//         isPositive: orderChange > 0
//       },
//       revenue: {
//         value: revenueChange,
//         isPositive: revenueChange > 0
//       }
//     },
//     alerts: {
//       pendingOrders,
//       lowStockCount
//     },
//     recentOrders
//   });
// });

// module.exports = {
//   getSalesAnalytics,
//   getInventoryAnalytics,
//   getCustomerAnalytics,
//   getRealtimeData
// };

// controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get analytics summary for dashboard
// @route   GET /api/admin/analytics
// @access  Private/Admin


const getRealtimeData = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Today's stats
  const todayOrders = await Order.countDocuments({
    createdAt: { $gte: today },
    isPaid: true
  });
  
  const todayRevenue = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: today },
        isPaid: true 
      } 
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  
  const todayNewCustomers = await User.countDocuments({
    createdAt: { $gte: today },
    role: 'customer'
  });
  
  // Yesterday's stats for comparison
  const yesterdayOrders = await Order.countDocuments({
    createdAt: { $gte: yesterday, $lt: today },
    isPaid: true
  });
  
  const yesterdayRevenue = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: yesterday, $lt: today },
        isPaid: true 
      } 
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  
  // Current pending orders
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  
  // Low stock alerts
  const lowStockCount = await Product.countDocuments({
    stock: { $lt: 10 },
    isAvailable: true
  });
  
  // Recent orders (last 5)
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .select('_id totalPrice orderStatus createdAt');
  
  // Calculate percentage changes
  const orderChange = yesterdayOrders > 0 
    ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1)
    : 0;
  
  const revenueChange = yesterdayRevenue[0]?.total > 0 
    ? ((todayRevenue[0]?.total || 0 - yesterdayRevenue[0]?.total) / yesterdayRevenue[0]?.total * 100).toFixed(1)
    : 0;
  
  res.json({
    today: {
      orders: todayOrders,
      revenue: todayRevenue[0]?.total || 0,
      newCustomers: todayNewCustomers
    },
    comparisons: {
      orders: {
        value: orderChange,
        isPositive: orderChange > 0
      },
      revenue: {
        value: revenueChange,
        isPositive: revenueChange > 0
      }
    },
    alerts: {
      pendingOrders,
      lowStockCount
    },
    recentOrders
  });
});












const getCustomerAnalytics = asyncHandler(async (req, res) => {
  const { timeframe = 'all' } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  switch (timeframe) {
    case 'today':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999))
        }
      };
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: weekAgo } };
      break;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: monthAgo } };
      break;
  }
  
  const customerGrowth = await User.aggregate([
    { $match: { ...dateFilter, role: 'customer' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        newCustomers: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  const customerLifetimeValue = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$totalPrice' },
        firstOrder: { $min: '$createdAt' },
        lastOrder: { $max: '$createdAt' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    { $sort: { totalSpent: -1 } },
    { $limit: 20 }
  ]);
  
  const repeatCustomers = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: '$user',
        orderCount: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        singlePurchase: {
          $sum: { $cond: [{ $eq: ['$orderCount', 1] }, 1, 0] }
        },
        repeatCustomers: {
          $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
        },
        loyalCustomers: {
          $sum: { $cond: [{ $gt: ['$orderCount', 5] }, 1, 0] }
        }
      }
    }
  ]);
  
  res.json({
    customerGrowth,
    customerLifetimeValue,
    repeatCustomers: repeatCustomers[0] || {},
    timeframe
  });
});





const getInventoryAnalytics = asyncHandler(async (req, res) => {
  const lowStockThreshold = 10;
  
  const inventoryStats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
        lowStockItems: {
          $sum: {
            $cond: [{ $lt: ['$stock', lowStockThreshold] }, 1, 0]
          }
        }
      }
    },
    { $sort: { totalValue: -1 } }
  ]);
  
  const lowStockProducts = await Product.find({
    stock: { $lt: lowStockThreshold },
    isAvailable: true
  }).sort({ stock: 1 }).limit(20);
  
  const bestSellingCategories = await Order.aggregate([
    { $match: { isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);
  
  res.json({
    inventoryStats,
    lowStockProducts,
    bestSellingCategories,
    lowStockThreshold
  });
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month', startDate, endDate } = req.query;
  
  let matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  let groupFormat;
  switch (period) {
    case 'day':
      groupFormat = { 
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
      break;
    case 'week':
      groupFormat = { 
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      break;
    default: // month
      groupFormat = { 
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
  }
  
  const salesData = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    {
      $group: {
        _id: groupFormat,
        totalSales: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
  ]);
  
  const topProducts = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);
  
  const customerStats = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' }
  ]);
  
  res.json({
    salesData,
    topProducts,
    customerStats,
    period,
    dateRange: { startDate, endDate }
  });
});

const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const { timeframe = 'month' } = req.query;
  
  const now = new Date();
  let dateFilter = {};
  let previousDateFilter = {};
  
  // Set date filters based on timeframe
  switch (timeframe) {
    case 'today':
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const todayEnd = new Date(now.setHours(23, 59, 59, 999));
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      const yesterdayEnd = new Date(todayEnd);
      yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
      
      dateFilter = { createdAt: { $gte: todayStart, $lte: todayEnd } };
      previousDateFilter = { createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } };
      break;
    
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      
      dateFilter = { createdAt: { $gte: weekAgo } };
      previousDateFilter = { createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } };
      break;
    
    case 'month':
    default:
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      dateFilter = { createdAt: { $gte: monthAgo } };
      previousDateFilter = { createdAt: { $gte: twoMonthsAgo, $lt: monthAgo } };
      break;
  }
  
  // Get current period stats
  const [totalRevenue, totalOrders, totalCustomers, topProducts] = await Promise.all([
    // Total revenue
    Order.aggregate([
      { $match: { ...dateFilter, isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
    
    // Total orders
    Order.countDocuments({ ...dateFilter, isPaid: true }),
    
    // Total new customers
    User.countDocuments({ ...dateFilter, role: 'customer' }),
    
    // Top products
    Order.aggregate([
      { $match: { ...dateFilter, isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1,
          image: '$product.image'
        }
      }
    ])
  ]);
  
  // Get previous period stats for comparison
  const [previousRevenue, previousOrders] = await Promise.all([
    Order.aggregate([
      { $match: { ...previousDateFilter, isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]),
    Order.countDocuments({ ...previousDateFilter, isPaid: true })
  ]);
  
  // Calculate growth percentages
  const currentRev = totalRevenue[0]?.total || 0;
  const prevRev = previousRevenue[0]?.total || 0;
  const revenueGrowth = prevRev > 0 ? ((currentRev - prevRev) / prevRev * 100).toFixed(1) : currentRev > 0 ? 100 : 0;
  
  const ordersGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders * 100).toFixed(1) : totalOrders > 0 ? 100 : 0;
  
  // Get sales chart data
  const salesChart = await Order.aggregate([
    { $match: { ...dateFilter, isPaid: true } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } },
    {
      $project: {
        date: '$_id',
        revenue: 1,
        orders: 1,
        _id: 0
      }
    }
  ]);
  
  res.json({
    summary: {
      totalRevenue: currentRev,
      totalOrders,
      totalCustomers,
      revenueGrowth: parseFloat(revenueGrowth),
      ordersGrowth: parseFloat(ordersGrowth)
    },
    topProducts,
    salesChart,
    timeframe
  });
});

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let groupFormat;
  switch (period) {
    case 'day':
      groupFormat = { 
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
      };
      break;
    case 'week':
      groupFormat = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      break;
    default: // month
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
  }
  
  // User growth over time
  const userGrowth = await User.aggregate([
    { $match: { role: 'customer' } },
    {
      $group: {
        _id: groupFormat,
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  // User demographics
  const userDemographics = await User.aggregate([
    { $match: { role: 'customer' } },
    {
      $group: {
        _id: {
          $cond: [
            { $and: [
              { $ne: ['$country', null] },
              { $ne: ['$country', ''] }
            ]},
            '$country',
            'Unknown'
          ]
        },
        count: { $sum: 1 },
        totalSpent: { 
          $sum: {
            $cond: [{ $ifNull: ['$totalSpent', false] }, '$totalSpent', 0]
          }
        }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  // User activity
  const userActivity = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: '$user',
        lastOrder: { $max: '$createdAt' },
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        name: '$user.name',
        email: '$user.email',
        lastOrder: 1,
        orderCount: 1,
        totalSpent: 1,
        daysSinceLastOrder: {
          $divide: [
            { $subtract: [new Date(), '$lastOrder'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    { $sort: { lastOrder: -1 } },
    { $limit: 20 }
  ]);
  
  // User segmentation by spending
  const userSegmentation = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $bucket: {
        groupBy: '$totalSpent',
        boundaries: [0, 100, 500, 1000, 5000, 10000],
        default: '10000+',
        output: {
          count: { $sum: 1 },
          avgOrderCount: { $avg: '$orderCount' },
          totalRevenue: { $sum: '$totalSpent' }
        }
      }
    }
  ]);
  
  res.json({
    userGrowth,
    userDemographics,
    userActivity,
    userSegmentation,
    totalUsers: await User.countDocuments({ role: 'customer' }),
    period
  });
});

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private/Admin
const getProductAnalytics = asyncHandler(async (req, res) => {
  const { timeframe = 'month', category } = req.query;
  
  let dateFilter = {};
  const now = new Date();
  
  switch (timeframe) {
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: weekAgo } };
      break;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: monthAgo } };
      break;
    case 'year':
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: yearAgo } };
      break;
  }
  
  // Match stage for orders
  let orderMatch = { ...dateFilter, isPaid: true };
  
  // Product performance
  const productPerformance = await Order.aggregate([
    { $match: orderMatch },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        avgRating: { $avg: '$orderItems.rating' }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        name: '$product.name',
        category: '$product.category',
        price: '$product.price',
        stock: '$product.stock',
        totalSold: 1,
        totalRevenue: 1,
        avgRating: 1,
        revenuePerUnit: { $divide: ['$totalRevenue', '$totalSold'] }
      }
    }
  ]);
  
  // Category performance
  const categoryPerformance = await Order.aggregate([
    { $match: orderMatch },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        uniqueProducts: { $addToSet: '$orderItems.product' }
      }
    },
    {
      $project: {
        category: '$_id',
        totalSold: 1,
        totalRevenue: 1,
        productCount: { $size: '$uniqueProducts' },
        avgRevenuePerProduct: { $divide: ['$totalRevenue', { $size: '$uniqueProducts' }] }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);
  
  // Stock analysis
  const stockAnalysis = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        avgStock: { $avg: '$stock' },
        lowStockCount: {
          $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
        },
        outOfStockCount: {
          $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
        }
      }
    },
    { $sort: { totalProducts: -1 } }
  ]);
  
  // Price distribution
  const priceDistribution = await Product.aggregate([
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 10, 25, 50, 100, 250, 500, 1000],
        default: '1000+',
        output: {
          count: { $sum: 1 },
          avgStock: { $avg: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    }
  ]);
  
  res.json({
    productPerformance,
    categoryPerformance,
    stockAnalysis,
    priceDistribution,
    timeframe,
    category
  });
});

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month', startDate, endDate } = req.query;
  
  let matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  let groupFormat;
  switch (period) {
    case 'day':
      groupFormat = { 
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
      };
      break;
    case 'week':
      groupFormat = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      break;
    case 'year':
      groupFormat = {
        year: { $year: '$createdAt' }
      };
      break;
    default: // month
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
  }
  
  // Revenue over time
  const revenueTrend = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    {
      $group: {
        _id: groupFormat,
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalPrice' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  // Revenue by payment method
  const revenueByPayment = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    {
      $group: {
        _id: '$paymentMethod',
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalPrice' }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
  
  // Revenue by category
  const revenueByCategory = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        itemsSold: { $sum: '$orderItems.quantity' }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
  
  // Revenue by customer tier
  const revenueByCustomerTier = await Order.aggregate([
    { $match: { ...matchStage, isPaid: true } },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $bucket: {
        groupBy: '$totalSpent',
        boundaries: [0, 100, 500, 1000, 5000],
        default: '5000+',
        output: {
          customerCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalSpent' },
          avgOrders: { $avg: '$orderCount' }
        }
      }
    }
  ]);
  
  // Monthly recurring revenue (MRR) calculation
  const monthlyRecurringRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        },
        isPaid: true
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  res.json({
    revenueTrend,
    revenueByPayment,
    revenueByCategory,
    revenueByCustomerTier,
    monthlyRecurringRevenue,
    period,
    dateRange: { startDate, endDate }
  });
});

// Keep all your existing controller functions (getSalesAnalytics, getInventoryAnalytics, getCustomerAnalytics, getRealtimeData)

// Export all controller functions
module.exports = {
  getAnalyticsSummary,
  getSalesAnalytics,
  getInventoryAnalytics,
  getCustomerAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  getRevenueAnalytics,
  getRealtimeData
};