
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { testCloudinaryConnection } = require('./config/cloudinary');




// Import routes
const adminAuthRoutes = require('./routes/adminAuthRoutes'); // Rename this
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const app = express();
app.use('/uploads', express.static('uploads'));
// Connect to database
connectDB();
testCloudinaryConnection();
// Security middleware
app.use(helmet());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
}


// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again after 15 minutes'
// });
// app.use('/api/', limiter);
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }));
// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes - Correct order matters
app.use('/api/admin/auth', adminAuthRoutes); // Admin authentication routes
app.use('/api/admin', adminRoutes); // Admin management routes (protected)
app.use('/api/admin', analyticsRoutes);
app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes); // User authentication
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});


app.use(express.static(path.join(__dirname, '../frontend/dist')));

// React routing support
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// require('dotenv').config();

// const connectDB = require('./config/database');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');
// const { testCloudinaryConnection } = require('./config/cloudinary');

// // Import routes
// const adminAuthRoutes = require('./routes/adminAuthRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const wishlistRoutes = require('./routes/wishlistRoutes');
// const analyticsRoutes = require('./routes/analyticsRoutes');
// const checkoutRoutes = require('./routes/checkoutRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const userRoutes = require('./routes/userRoutes');

// const app = express();

// // Static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Connect to database with error handling
// connectDB().catch(err => {
//   console.error('Failed to connect to database:', err);
//   process.exit(1);
// });

// // Test Cloudinary connection (non-critical)
// testCloudinaryConnection().catch(err => {
//   console.warn('Cloudinary connection warning:', err.message);
// });

// // Security middleware
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow image serving
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
//     },
//   },
// }));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.FRONTEND_URL || 'https://yourdomain.com'
//     : ['http://localhost:5173', 'http://localhost:3000'],
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// };
// app.use(cors(corsOptions));

// // Rate limiting - different tiers for different endpoints
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: 'Too many requests from this IP, please try again after 15 minutes',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 requests per 15 minutes
//   message: 'Too many authentication attempts, please try again later',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const apiLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 30, // 30 requests per minute
//   message: 'Too many API requests, please slow down',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Apply rate limiting
// app.use('/api/', globalLimiter);
// app.use('/api/auth', authLimiter);
// app.use('/api/users/auth', authLimiter);
// app.use('/api/admin/auth', authLimiter);
// app.use('/api/payment', apiLimiter);
// app.use('/api/checkout', apiLimiter);

// // Webhook - needs raw body BEFORE JSON parser
// app.post('/api/payment/webhook', 
//   express.raw({ type: 'application/json' }),
//   (req, res) => {
//     // Forward to payment controller
//     require('./controllers/paymentController').webhook(req, res);
//   }
// );

// // Body parsers
// app.use(express.json({ 
//   limit: '10mb',
//   verify: (req, res, buf) => {
//     req.rawBody = buf.toString();
//   }
// }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Request logging middleware (development only)
// if (process.env.NODE_ENV === 'development') {
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
//     next();
//   });
// }

// // API Routes - Organized by resource
// app.use('/api/admin/auth', adminAuthRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/admin/analytics', analyticsRoutes);

// // User routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// // Shop routes
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/checkout', checkoutRoutes);
// app.use('/api/payment', paymentRoutes);

// // Health check endpoint
// app.get('/api/health', async (req, res) => {
//   const healthcheck = {
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || 'development',
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//     databaseState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
//     services: {
//       cloudinary: await testCloudinaryConnection().then(() => 'connected').catch(() => 'disconnected'),
//       stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
//       email: process.env.EMAIL_USER ? 'configured' : 'not configured'
//     },
//     memory: process.memoryUsage(),
//     cpu: process.cpuUsage()
//   };

//   const statusCode = healthcheck.database === 'connected' ? 200 : 503;
//   res.status(statusCode).json(healthcheck);
// });

// // API documentation endpoint
// app.get('/api', (req, res) => {
//   res.json({
//     name: 'NCAI API',
//     version: '1.0.0',
//     status: 'active',
//     description: 'E-commerce API with authentication, products, cart, orders, and payments',
//     documentation: '/api/docs', // If you add Swagger/OpenAPI later
//     endpoints: {
//       health: {
//         url: '/api/health',
//         method: 'GET',
//         description: 'Server health check'
//       },
//       auth: {
//         register: { url: '/api/auth/register', method: 'POST' },
//         login: { url: '/api/auth/login', method: 'POST' },
//         profile: { url: '/api/users/profile', method: 'GET' }
//       },
//       products: {
//         list: { url: '/api/products', method: 'GET' },
//         single: { url: '/api/products/:id', method: 'GET' },
//         create: { url: '/api/products', method: 'POST', auth: 'admin' }
//       },
//       cart: {
//         get: { url: '/api/cart', method: 'GET' },
//         add: { url: '/api/cart', method: 'POST' },
//         update: { url: '/api/cart/:itemId', method: 'PUT' },
//         remove: { url: '/api/cart/:itemId', method: 'DELETE' }
//       },
//       orders: {
//         list: { url: '/api/orders', method: 'GET' },
//         create: { url: '/api/orders', method: 'POST' },
//         single: { url: '/api/orders/:id', method: 'GET' }
//       },
//       checkout: {
//         initiate: { url: '/api/checkout', method: 'POST' },
//         verify: { url: '/api/checkout/verify', method: 'POST' }
//       },
//       payment: {
//         methods: { url: '/api/payment/methods', method: 'GET' },
//         intent: { url: '/api/payment/create-intent', method: 'POST' },
//         webhook: { url: '/api/payment/webhook', method: 'POST' }
//       },
//       wishlist: {
//         get: { url: '/api/wishlist', method: 'GET' },
//         add: { url: '/api/wishlist', method: 'POST' },
//         remove: { url: '/api/wishlist/:productId', method: 'DELETE' }
//       },
//       admin: {
//         dashboard: { url: '/api/admin', method: 'GET' },
//         analytics: { url: '/api/admin/analytics', method: 'GET' }
//       }
//     }
//   });
// });

// // Root route - redirect to API docs or frontend
// app.get('/', (req, res) => {
//   if (process.env.NODE_ENV === 'production') {
//     // Serve static frontend if available
//     const frontendPath = path.join(__dirname, '../frontend/dist');
//     if (require('fs').existsSync(frontendPath)) {
//       return res.sendFile(path.join(frontendPath, 'index.html'));
//     }
//   }
  
//   // Development or no frontend build - show API info
//   res.redirect('/api');
// });

// // Serve static assets in production (if frontend is built)
// if (process.env.NODE_ENV === 'development') {
//   const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  
//   // Check if frontend build exists
//   const fs = require('fs');
//   if (fs.existsSync(frontendBuildPath)) {
//     console.log('Serving frontend from:', frontendBuildPath);
//     app.use(express.static(frontendBuildPath));
    
//     // Catch-all route to serve frontend for non-API routes
//     app.get(/.*/, (req, res, next) => {
//       if (!req.path.startsWith('/api')) {
//         res.sendFile(path.join(frontendBuildPath, 'index.html'));
//       } else {
//         next();
//       }
//     });
//   }
// }

// // 404 handler - must be last
// app.use(notFound);

// // Error handler - must be after 404
// app.use(errorHandler);

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.error(err.name, err.message);
//   console.error(err.stack);
//   process.exit(1);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.error(err.name, err.message);
//   console.error(err.stack);
//   process.exit(1);
// });

// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
//   console.log(`📝 API available at: http://localhost:${PORT}/api`);
//   console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  
//   if (process.env.NODE_ENV !== 'production') {
//     console.log(`🎨 Frontend dev server: http://localhost:5173`);
//   }
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('💀 HTTP server closed.');
//     mongoose.connection.close(false, () => {
//       console.log('💀 MongoDB connection closed.');
//       process.exit(0);
//     });
//   });
// });

// module.exports = { app, server };