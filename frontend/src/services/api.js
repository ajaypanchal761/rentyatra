// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
    this.adminToken = localStorage.getItem('adminToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Set admin authentication token
  setAdminToken(token) {
    this.adminToken = token;
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Get headers for file upload
  getFileUploadHeaders() {
    const headers = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Get admin authentication headers
  getAdminHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.adminToken) {
      headers.Authorization = `Bearer ${this.adminToken}`;
    }

    return headers;
  }

  // Get admin headers for file upload
  getAdminFileUploadHeaders() {
    const headers = {};

    if (this.adminToken) {
      headers.Authorization = `Bearer ${this.adminToken}`;
    } else {
      console.warn('No admin token found for file upload');
    }

    console.log('Admin file upload headers:', headers);
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // File upload request method
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: this.getFileUploadHeaders(),
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }

  // Authentication APIs
  async sendOTP(phone) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone, otp, name, email) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, name, email }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(phone, otp) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // User APIs
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async updateUserPreferences(preferences) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async changePhoneNumber(newPhone, otp) {
    return this.request('/users/change-phone', {
      method: 'POST',
      body: JSON.stringify({ newPhone, otp }),
    });
  }

  async deactivateAccount() {
    return this.request('/users/deactivate', {
      method: 'PUT',
    });
  }

  async reactivateAccount() {
    return this.request('/users/reactivate', {
      method: 'PUT',
    });
  }

  async getUserActivity(page = 1, limit = 10) {
    return this.request(`/users/activity?page=${page}&limit=${limit}`);
  }

  async exportUserData() {
    return this.request('/users/export');
  }

  // Document APIs
  async uploadAadharCard(aadharNumber, frontImage, backImage) {
    const formData = new FormData();
    if (aadharNumber) {
      formData.append('aadharNumber', aadharNumber);
    }
    formData.append('images', frontImage);
    formData.append('images', backImage);

    return this.uploadFile('/documents/upload-aadhar', formData);
  }

  async uploadPANCard(panNumber, frontImage, backImage) {
    const formData = new FormData();
    formData.append('panNumber', panNumber);
    formData.append('images', frontImage);
    formData.append('images', backImage);

    return this.uploadFile('/documents/upload-pan', formData);
  }

  async uploadProfileImage(image) {
    const formData = new FormData();
    formData.append('image', image);

    return this.uploadFile('/documents/upload-profile', formData);
  }

  async getDocumentStatus() {
    return this.request('/documents/status');
  }

  async deleteDocument(type) {
    return this.request(`/documents/delete/${type}`, {
      method: 'DELETE',
    });
  }

  // Admin APIs
  async adminLogin(email, password, adminKey) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, adminKey }),
    });
  }

  async adminSignup(adminData) {
    return this.request('/admin/signup', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  async getAdminProfile() {
    const url = `${this.baseURL}/admin/me`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async updateAdminProfile(adminData) {
    const url = `${this.baseURL}/admin/profile`;
    const config = {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(adminData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getAdminStats() {
    const url = `${this.baseURL}/admin/stats`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 10, search = '') {
    const url = `${this.baseURL}/admin/users?page=${page}&limit=${limit}&search=${search}`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getUserDetails(userId) {
    const url = `${this.baseURL}/admin/users/${userId}`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    const url = `${this.baseURL}/admin/users/${userId}/status`;
    const config = {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status }),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    const url = `${this.baseURL}/admin/users/${userId}`;
    const config = {
      method: 'DELETE',
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Product APIs
  async addProduct(productData) {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle images separately
        productData[key].forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const url = `${this.baseURL}/admin/products`;
    const config = {
      method: 'POST',
      headers: this.getAdminFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Making request to:', url);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('File Upload Error Details:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getAllProducts(page = 1, limit = 10, status = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const url = `${this.baseURL}/admin/products?${params.toString()}`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getProduct(productId) {
    const url = `${this.baseURL}/admin/products/${productId}`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle images separately
        productData[key].forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const url = `${this.baseURL}/admin/products/${productId}`;
    const config = {
      method: 'PUT',
      headers: this.getAdminFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Updating product:', productId);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch(url, config);
      console.log('Update response status:', response.status);
      
      const data = await response.json();
      console.log('Update response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Update Product Error:', error);
      throw error;
    }
  }

  async updateProductStatus(productId, status) {
    const url = `${this.baseURL}/admin/products/${productId}/status`;
    const config = {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status }),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    const url = `${this.baseURL}/admin/products/${productId}`;
    const config = {
      method: 'DELETE',
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getProductStats() {
    const url = `${this.baseURL}/admin/products/stats`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Category APIs
  async addCategory(categoryData) {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(categoryData).forEach(key => {
      if (key === 'images') {
        // Handle images separately
        categoryData[key].forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, categoryData[key]);
      }
    });

    const url = `${this.baseURL}/admin/categories`;
    const config = {
      method: 'POST',
      headers: this.getAdminFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Adding category:', categoryData);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch(url, config);
      console.log('Add category response status:', response.status);
      console.log('Add category response headers:', response.headers);
      
      let data;
      try {
        data = await response.json();
        console.log('Add category response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        const textResponse = await response.text();
        console.log('Raw response text:', textResponse);
        throw new Error(`Invalid JSON response: ${textResponse}`);
      }

      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Add Category Error Details:', {
        error: error,
        message: error.message,
        stack: error.stack,
        url: url,
        config: config
      });
      throw error;
    }
  }

  async getAllCategories(page = 1, limit = 100, status = '', search = '', productId = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (productId) params.append('productId', productId);

    const url = `${this.baseURL}/admin/categories?${params.toString()}`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getCategory(categoryId) {
    const url = `${this.baseURL}/admin/categories/${categoryId}`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async updateCategory(categoryId, categoryData) {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(categoryData).forEach(key => {
      if (key === 'images') {
        // Handle images separately
        categoryData[key].forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, categoryData[key]);
      }
    });

    const url = `${this.baseURL}/admin/categories/${categoryId}`;
    const config = {
      method: 'PUT',
      headers: this.getAdminFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Updating category:', categoryId, categoryData);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch(url, config);
      console.log('Update category response status:', response.status);
      
      const data = await response.json();
      console.log('Update category response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Update Category Error:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    const url = `${this.baseURL}/admin/categories/${categoryId}`;
    const config = {
      method: 'DELETE',
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async updateCategoryStatus(categoryId, status) {
    const url = `${this.baseURL}/admin/categories/${categoryId}/status`;
    const config = {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status }),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getCategoryStats() {
    const url = `${this.baseURL}/admin/categories/stats`;
    const config = {
      headers: this.getAdminHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Public Product APIs (for regular users)
  async getPublicProducts(page = 1, limit = 12, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);

    const url = `${this.baseURL}/products?${params.toString()}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getPublicProduct(productId) {
    const url = `${this.baseURL}/products/${productId}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getFeaturedProducts(limit = 8) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const url = `${this.baseURL}/products/featured?${params.toString()}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Public Category APIs (for regular users)
  async getPublicCategories(page = 1, limit = 50, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);

    const url = `${this.baseURL}/categories?${params.toString()}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getCategoriesByProduct(productId, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${this.baseURL}/categories/product/${productId}?${params.toString()}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getPublicCategory(categoryId) {
    const url = `${this.baseURL}/categories/${categoryId}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
