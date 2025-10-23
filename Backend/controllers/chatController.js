const Message = require('../models/Message');
const User = require('../models/User');
const Product = require('../models/Product');

// Get user's conversations
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Get conversations with pagination
    const conversations = await Message.getUserConversations(userId);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedConversations = conversations.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        conversations: paginatedConversations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(conversations.length / limit),
          totalConversations: conversations.length,
          hasNext: endIndex < conversations.length,
          hasPrev: startIndex > 0
        }
      }
    });
  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations',
      error: error.message
    });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { page = 1, limit = 50 } = req.query;

    console.log('Chat Controller Debug:');
    console.log('req.user.userId:', req.user.userId);
    console.log('req.user.userId type:', typeof req.user.userId);
    console.log('userId1:', userId1);
    console.log('userId1 type:', typeof userId1);
    console.log('userId2:', userId2);
    console.log('userId2 type:', typeof userId2);
    console.log('userId1 === req.user.userId:', userId1 === req.user.userId);
    console.log('userId2 === req.user.userId:', userId2 === req.user.userId);

    // Convert string IDs to ObjectId for comparison
    const currentUserId = req.user.userId.toString();
    const paramUserId1 = userId1.toString();
    const paramUserId2 = userId2.toString();

    console.log('ID Comparison:');
    console.log('currentUserId:', currentUserId);
    console.log('paramUserId1:', paramUserId1);
    console.log('paramUserId2:', paramUserId2);
    console.log('currentUserId === paramUserId1:', currentUserId === paramUserId1);
    console.log('currentUserId === paramUserId2:', currentUserId === paramUserId2);

    // Validate that the requesting user is one of the participants
    if (currentUserId !== paramUserId1 && currentUserId !== paramUserId2) {
      console.log('Authorization failed - user not in conversation');
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this conversation'
      });
    }

    const messages = await Message.getConversation(userId1, userId2, page, limit);
    
    // Get the other participant's info
    const otherUserId = currentUserId === userId1.toString() ? userId2 : userId1;
    console.log('Getting other user info:');
    console.log('otherUserId:', otherUserId);
    console.log('otherUserId type:', typeof otherUserId);
    
    const otherUser = await User.findById(otherUserId).select('name email profilePicture');
    console.log('Other user found:', otherUser);
    console.log('Other user name:', otherUser?.name);
    console.log('Other user email:', otherUser?.email);
    
    // Mark messages as read for the current user
    await Message.updateMany(
      {
        conversationId: Message.generateConversationId(userId1, userId2),
        receiver: req.user.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        otherUser,
        conversationId: Message.generateConversationId(userId1, userId2)
      }
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation',
      error: error.message
    });
  }
};

// Send a message (REST API endpoint for fallback)
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, productId } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

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

    // Populate message with user and product info
    await message.populate('sender', 'name email profilePicture');
    await message.populate('receiver', 'name email profilePicture');
    if (productId) {
      await message.populate('product', 'title images');
    }

    // Emit real-time message via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${conversationId}`).emit('new_message', message);
      io.to(`user_${receiverId}`).emit('message_notification', {
        message,
        unreadCount: await Message.countDocuments({
          receiver: receiverId,
          isRead: false
        })
      });
    }

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Mark message as read
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the receiver
    if (message.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to mark this message as read'
      });
    }

    await message.markAsRead();

    // Emit read status via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${message.sender}`).emit('message_read', {
        messageId,
        readAt: message.readAt
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// Search conversations
const searchConversations = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.userId;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Get conversations and search in message content
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { receiver: mongoose.Types.ObjectId(userId) }
          ],
          content: { $regex: query, $options: 'i' }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          matchCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.receiver',
          foreignField: '_id',
          as: 'receiver'
        }
      },
      {
        $project: {
          conversationId: '$_id',
          lastMessage: 1,
          matchCount: 1,
          sender: { $arrayElemAt: ['$sender', 0] },
          receiver: { $arrayElemAt: ['$receiver', 0] }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search conversations',
      error: error.message
    });
  }
};

module.exports = {
  getUserConversations,
  getConversation,
  sendMessage,
  markMessageAsRead,
  getUnreadCount,
  searchConversations
};
