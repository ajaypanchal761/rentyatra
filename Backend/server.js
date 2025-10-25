const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

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
const publicRentalRequestRoutes = require('./routes/publicRentalRequestRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const rentalRequestRoutes = require('./routes/rentalRequestRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'https://rentyatra.vercel.app',
      'https://rentyatra-frontend.onrender.com',
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

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io globally available for controllers
global.io = io;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Socket.io server is running and accepting connections');
  console.log('Socket transport:', socket.conn.transport.name);

  // Join user to their personal room
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const Message = require('./models/Message');
      const User = require('./models/User');
      
      const { senderId, receiverId, content, productId } = data;
      
      // Create conversation ID
      const conversationId = Message.generateConversationId(senderId, receiverId);
      
      // Create message
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        conversationId,
        product: productId || null
      });
      
      await message.save();
      
      // Populate sender info
      await message.populate('sender', 'name email profilePicture');
      await message.populate('receiver', 'name email profilePicture');
      if (productId) {
        await message.populate('product', 'title images');
      }
      
      // Emit to conversation room
      io.to(`conversation_${conversationId}`).emit('new_message', message);
      
      // Emit to receiver's personal room for notifications
      io.to(`user_${receiverId}`).emit('message_notification', {
        message,
        unreadCount: await Message.countDocuments({
          receiver: receiverId,
          isRead: false
        })
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle message read status
  socket.on('mark_message_read', async (data) => {
    try {
      const Message = require('./models/Message');
      const { messageId, userId } = data;
      
      const message = await Message.findById(messageId);
      if (message && message.receiver.toString() === userId) {
        await message.markAsRead();
        
        // Notify sender that message was read
        io.to(`user_${message.sender}`).emit('message_read', {
          messageId,
          readAt: message.readAt
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });

  // Handle test messages
  socket.on('test_message', (data) => {
    console.log('Test message received:', data);
    socket.emit('test_response', { 
      message: 'Test response received', 
      originalMessage: data.message,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

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
app.use('/api/admin/banners', bannerRoutes);
app.use('/api/admin/rental-requests', rentalRequestRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/categories', publicCategoryRoutes);
app.use('/api/rental-requests', publicRentalRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/tickets', ticketRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => res.status(200).json({ message: 'Backend is healthy' }));

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
    
    // Connect to MongoDB Atlas first (with error handling)
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      console.log('⚠️ Starting server without database connection...');
    }
    
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    // Try to start server with retry mechanism
    const startServerWithRetry = (port, host, retries = 3) => {
      const httpServer = server.listen(port, host, () => {
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
🏠 Rental Request Endpoints: /api/admin/rental-requests
🛍️ Public Product Endpoints: /api/products
📂 Public Category Endpoints: /api/categories
🏠 Public Rental Request Endpoints: /api/rental-requests (GET, POST)
⭐ Review Endpoints: /api/reviews
      `);
    });
    
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`❌ Port ${port} is already in use, trying port ${port + 1}...`);
        if (retries > 0) {
          setTimeout(() => {
            startServerWithRetry(port + 1, host, retries - 1);
          }, 1000);
        } else {
          console.error(`❌ Could not find available port after ${retries} retries`);
          process.exit(1);
        }
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
    
    return httpServer;
    };
    
    const httpServer = startServerWithRetry(PORT, HOST);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      httpServer.close(() => {
        console.log('🔌 Server closed');
        process.exit(0);
      });
    });

    // Keep the server running
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      // Don't exit the process
    });

    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err);
      // Don't exit the process
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('❌ Error details:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
