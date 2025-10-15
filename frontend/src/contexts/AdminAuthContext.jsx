import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminUser');
      
      if (token && adminData) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/admin/validate-token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setAdmin(data.data.admin);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        } catch (error) {
          console.error('Admin token validation failed:', error);
          // For development/testing: if backend is not available, use stored data
          console.log('Backend not available, using stored admin data for testing');
          try {
            const parsedAdminData = JSON.parse(adminData);
            setAdmin(parsedAdminData);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error('Failed to parse stored admin data:', parseError);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        }
      } else {
        // For testing: create a mock admin if no data exists
        console.log('No admin data found, creating mock admin for testing');
        const mockAdmin = {
          id: 'admin-123',
          name: 'Test Admin',
          email: 'admin@rentyatra.com',
          role: 'super_admin'
        };
        setAdmin(mockAdmin);
        setIsAuthenticated(true);
        localStorage.setItem('adminUser', JSON.stringify(mockAdmin));
        localStorage.setItem('adminToken', 'mock-token-for-testing');
      }
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  const login = async (adminData, token) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    localStorage.setItem('adminToken', token);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('http://localhost:5000/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    }
  };

  const updateAdmin = (updatedData) => {
    const updatedAdmin = { ...admin, ...updatedData };
    setAdmin(updatedAdmin);
    localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    adminToken: localStorage.getItem('adminToken'),
    login,
    logout,
    updateAdmin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
