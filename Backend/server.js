const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import database connection
const connectDB = require('./config/db');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);

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
    // Connect to MongoDB Atlas first
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`
🚀 RentYatra Backend Server Started!
📡 Server running on port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API Base URL: http://localhost:${PORT}/api
📊 Health Check: http://localhost:${PORT}/api/health
🔐 Auth Endpoints: http://localhost:${PORT}/api/auth
👤 User Endpoints: http://localhost:${PORT}/api/users
📄 Document Endpoints: http://localhost:${PORT}/api/documents
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
