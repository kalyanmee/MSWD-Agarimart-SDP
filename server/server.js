const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/Cartroutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fertilizerRoutes = require('./routes/fertilizerRoutes');
const emailRoutes = require('./routes/email');
const paymentRoutes = require('./routes/paymentRoutes');  // Razorpay payment routes
const orderRoutes = require('./routes/orderRoutes');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend React URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and handling file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file hosting for images and other assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/order', orderRoutes);

// Routes
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/email', emailRoutes);  // Email-related routes
app.use('/api/payment', paymentRoutes);  // Razorpay payment routes

// Database Connection (MongoDB)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);  // Exit if DB connection fails
  });

// Error handling middlewares (404 and custom error handler)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
