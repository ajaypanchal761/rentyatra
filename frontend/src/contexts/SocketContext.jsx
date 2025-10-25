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
      // Enable Socket.io for real-time updates
      console.log('🔌 Connecting to Socket.io for real-time updates...');
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket.io connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket.io disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.log('❌ Socket.io connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
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

  const listenForTicketUpdates = (callback) => {
    if (socket && isConnected) {
      socket.on('ticketStatusUpdated', callback);
      return () => socket.off('ticketStatusUpdated', callback);
    }
    return () => {};
  };

  const value = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping,
    listenForTicketUpdates
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
