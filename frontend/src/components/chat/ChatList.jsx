import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import chatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for new messages
      socket.on('new_message', handleNewMessage);
      socket.on('message_notification', handleMessageNotification);

      return () => {
        socket.off('new_message');
        socket.off('message_notification');
      };
    } else if (!isConnected) {
      // Poll for new conversations when Socket.io is not available
      const pollInterval = setInterval(async () => {
        try {
          const response = await chatService.getConversations(user.id);
          setConversations(response.data.conversations);
        } catch (error) {
          console.error('Error polling for conversations:', error);
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(pollInterval);
    }
  }, [socket, isConnected, user.id]);

  const loadConversations = async () => {
    if (!user || !user.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      const response = await chatService.getConversations(user.id);
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      if (error.message.includes('Unauthorized')) {
        // User is not authenticated, redirect to login
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    // Update conversations list with new message
    setConversations(prev => {
      const updated = [...prev];
      const conversationIndex = updated.findIndex(
        conv => conv.conversationId === message.conversationId
      );
      
      if (conversationIndex !== -1) {
        updated[conversationIndex].lastMessage = message;
        updated[conversationIndex].unreadCount += 1;
        // Move to top
        const [movedConv] = updated.splice(conversationIndex, 1);
        updated.unshift(movedConv);
      } else {
        // New conversation
        updated.unshift({
          conversationId: message.conversationId,
          lastMessage: message,
          unreadCount: 1,
          sender: message.sender,
          receiver: message.receiver
        });
      }
      
      return updated;
    });
  };

  const handleMessageNotification = (data) => {
    // Update unread count for the conversation
    setConversations(prev => {
      const updated = [...prev];
      const conversationIndex = updated.findIndex(
        conv => conv.conversationId === data.message.conversationId
      );
      
      if (conversationIndex !== -1) {
        updated[conversationIndex].unreadCount = data.unreadCount;
      }
      
      return updated;
    });
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await chatService.searchConversations(query);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching conversations:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherUser = (conversation) => {
    if (conversation.sender && conversation.sender._id === user.id) {
      return conversation.receiver;
    }
    return conversation.sender;
  };

  const openChat = (conversation) => {
    const otherUser = getOtherUser(conversation);
    navigate(`/chat/${otherUser._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayData = isSearching ? searchResults : conversations;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {displayData.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isSearching ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isSearching 
                ? 'Try a different search term'
                : 'Your conversations with renters and owners will appear here'
              }
            </p>
            {!isSearching && (
              <Button onClick={() => navigate('/listings')}>Browse Listings</Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {displayData.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const lastMessage = conversation.lastMessage;
              
              return (
                <Card
                  key={conversation.conversationId}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openChat(conversation)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {otherUser.name || 'Unknown User'}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {lastMessage ? formatTime(lastMessage.createdAt) : ''}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 truncate">
                        {lastMessage ? lastMessage.content : 'No messages yet'}
                      </p>
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
