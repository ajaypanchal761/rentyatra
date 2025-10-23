import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // For now, disable Socket.io due to namespace issues
      // Chat will work with REST API only
      console.log('Socket.io disabled - using REST API only mode');
      setIsConnected(false);
      setSocket(null);
    } else {
      // Disconnect if user is not authenticated
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  const joinConversation = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('leave_conversation', conversationId);
    }
  };

  const sendMessage = (messageData) => {
    if (socket && isConnected) {
      socket.emit('send_message', messageData);
    } else {
      console.warn('Socket not connected, message will be sent via REST API');
    }
  };

  const markMessageAsRead = (messageId, userId) => {
    if (socket && isConnected) {
      socket.emit('mark_message_read', { messageId, userId });
    }
  };

  const startTyping = (conversationId, userId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { conversationId, userId });
    }
  };

  const stopTyping = (conversationId, userId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { conversationId, userId });
    }
  };

  const value = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
