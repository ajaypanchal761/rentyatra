import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    // Return default values instead of throwing error
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      login: () => {},
      logout: () => {},
      updateUser: () => {}
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        apiService.setToken(token);
        try {
          const response = await apiService.getMe();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          apiService.setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      apiService.setToken(token);
    }
  };

  const signup = async (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      apiService.setToken(token);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      apiService.setToken(null);
    }
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // API methods for authentication
  const sendOTP = async (phone) => {
    try {
      const response = await apiService.sendOTP(phone);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (phone, otp, name, email) => {
    try {
      const response = await apiService.verifyOTP(phone, otp, name, email);
      if (response.success) {
        await login(response.data.user, response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const loginWithOTP = async (phone, otp) => {
    try {
      const response = await apiService.login(phone, otp);
      if (response.success) {
        await login(response.data.user, response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateUser,
    sendOTP,
    verifyOTP,
    register,
    loginWithOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

