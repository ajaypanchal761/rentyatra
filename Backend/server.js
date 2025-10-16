const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const publicProductRoutes = require('./routes/publicProductRoutes');
const publicCategoryRoutes = require('./routes/publicCategoryRoutes');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://rentyatra.vercel.app/',
    
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import database connection
const connectDB = require('./config/db');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/categories', publicCategoryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RentYatra API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server only after database connection is established
const startServer = async () => {
  try {
    console.log('🔄 Starting RentYatra Backend Server...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    // Connect to MongoDB Atlas first
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    const server = app.listen(PORT, HOST, () => {
      console.log(`
🚀 RentYatra Backend Server Started Successfully!
📡 Server running on: ${HOST}:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API Base URL: ${process.env.NODE_ENV === 'production' ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.onrender.com'}` : `http://localhost:${PORT}`}/api
📊 Health Check: ${process.env.NODE_ENV === 'production' ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.onrender.com'}` : `http://localhost:${PORT}`}/api/health
🔐 Auth Endpoints: /api/auth
👤 User Endpoints: /api/users
📄 Document Endpoints: /api/documents
🛡️ Admin Endpoints: /api/admin
📦 Product Endpoints: /api/admin/products
🛍️ Public Product Endpoints: /api/products
📂 Public Category Endpoints: /api/categories
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('🔌 Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('❌ Error details:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
