
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { testCloudinaryConnection } = require('./config/cloudinary');
const seedShippingMethods = require('./utils/shippingSeeder');




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
seedShippingMethods();
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
