import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const ChatWindow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected, joinConversation, leaveConversation, sendMessage, markMessageAsRead, startTyping, stopTyping } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [conversationId, setConversationId] = useState('');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user && userId) {
      console.log('ChatWindow: User authenticated, loading conversation');
      console.log('Current user ID:', user.id);
      console.log('Other user ID (from URL):', userId);
      loadConversation();
    } else {
      console.log('ChatWindow: User not authenticated or no userId');
      if (!user) {
        console.log('ChatWindow: No user found, redirecting to login');
        navigate('/login');
      }
    }
  }, [user, userId]);

  useEffect(() => {
    if (socket && isConnected && conversationId) {
      joinConversation(conversationId);
      
      // Listen for new messages
      socket.on('new_message', handleNewMessage);
      socket.on('user_typing', handleUserTyping);
      socket.on('message_read', handleMessageRead);

      return () => {
        leaveConversation(conversationId);
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('message_read');
      };
    } else if (!isConnected && conversationId) {
      // Poll for new messages when Socket.io is not available
      const pollInterval = setInterval(async () => {
        try {
          const response = await chatService.getConversation(user.id, userId, 1, 50);
          const newMessages = response.data.messages;
          
          // Check if there are new messages
          if (newMessages.length > messages.length) {
            setMessages(newMessages);
          }
        } catch (error) {
          console.error('Error polling for messages:', error);
        }
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(pollInterval);
    }
  }, [socket, isConnected, conversationId, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    if (!user || !user.id) {
      console.error('User not authenticated');
      navigate('/login');
      return;
    }

    console.log('ChatWindow Debug:');
    console.log('user.id:', user.id);
    console.log('user.id type:', typeof user.id);
    console.log('userId (from params):', userId);
    console.log('userId type:', typeof userId);
    console.log('user object:', user);

    try {
      setLoading(true);
      const response = await chatService.getConversation(user.id, userId);
      setMessages(response.data.messages);
      setOtherUser(response.data.otherUser);
      setConversationId(response.data.conversationId);
    } catch (error) {
      console.error('Error loading conversation:', error);
      if (error.message.includes('Unauthorized')) {
        navigate('/login');
      } else {
        navigate('/messages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (message.conversationId === conversationId) {
      setMessages(prev => [...prev, message]);
      
      // Mark as read if it's for current user
      if (message.receiver._id === user.id) {
        markMessageAsRead(message._id, user.id);
      }
    }
  };

  const handleUserTyping = (data) => {
    if (data.userId !== user.id) {
      setOtherUserTyping(data.isTyping);
    }
  };

  const handleMessageRead = (data) => {
    setMessages(prev => 
      prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, isRead: true, readAt: data.readAt }
          : msg
      )
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageData = {
      senderId: user.id,
      receiverId: userId,
      content: newMessage.trim()
    };

    try {
      setSending(true);
      
      // Send via Socket.io for real-time
      if (socket && isConnected) {
        sendMessage(messageData);
      } else {
        // Fallback to REST API
        console.log('Socket not connected, using REST API fallback');
        const response = await chatService.sendMessage(messageData);
        // Add the message to the local state since it won't come through socket
        setMessages(prev => [...prev, response.data]);
      }
      
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (conversationId) {
      if (!isTyping) {
        setIsTyping(true);
        startTyping(conversationId, user.id);
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping(conversationId, user.id);
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <Button onClick={() => navigate('/messages')}>Back to Messages</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/messages')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{otherUser.name}</h2>
            </div>
          </div>
          
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender._id === user.id;
          
          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className={`flex items-center justify-between mt-1 text-xs ${
                  isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.createdAt)}</span>
                  {isOwn && (
                    <span className="ml-2">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
