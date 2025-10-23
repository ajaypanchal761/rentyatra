// API Base URL - with fallback for development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://your-production-api.com/api');

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
    this.adminToken = localStorage.getItem('adminToken');
    this.timeout = 60000; // 60 seconds timeout for file uploads
    this.isDev = import.meta.env.DEV;
  }

  // Conditional logging for development only
  log(...args) {
    if (this.isDev) {
      console.log(...args);
    }
  }

  logError(...args) {
    if (this.isDev) {
      console.error(...args);
    }
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

  // Timeout utility for fetch requests
  async fetchWithTimeout(url, options, timeoutMs = this.timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request Timeout');
      }
      throw error;
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

    // Get fresh admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }

    return headers;
  }

  // Get admin headers for file upload
  getAdminFileUploadHeaders() {
    const headers = {};

    // Get fresh admin token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      headers.Authorization = `Bearer ${adminToken}`;
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

    console.log('🌐 Making API request to:', url);
    console.log('📋 Request config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ API Request Error:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        const networkError = new Error('Network error: Unable to connect to server. Please check your internet connection and ensure the backend server is running.');
        networkError.originalError = error;
        throw networkError;
      }
      
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
      const response = await this.fetchWithTimeout(url, config, 120000); // 2 minutes for file uploads
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('File Upload Error:', error);
      
      // Provide more specific error messages
      if (error.message === 'Request Timeout') {
        throw new Error('Upload timeout - Please try again with smaller files or check your internet connection');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection');
      }
      
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
  async adminLogin(email, password, adminKey = null) {
    const body = { email, password };
    if (adminKey) {
      body.adminKey = adminKey;
    }
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(body),
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
      
      const response = await this.fetchWithTimeout(url, config, 120000); // 2 minutes for file uploads
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
      
      // Provide more specific error messages
      if (error.message === 'Request Timeout') {
        throw new Error('Upload timeout - Please try again with smaller files or check your internet connection');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection');
      }
      
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
      
      const response = await this.fetchWithTimeout(url, config, 120000); // 2 minutes for file uploads
      console.log('Update response status:', response.status);
      
      const data = await response.json();
      console.log('Update response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Update Product Error:', error);
      
      // Provide more specific error messages
      if (error.message === 'Request Timeout') {
        throw new Error('Update timeout - Please try again with smaller files or check your internet connection');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection');
      }
      
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

    console.log('🌐 Fetching featured products from:', url);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Featured products response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
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

  // Banner APIs
  async addBanner(bannerData) {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(bannerData).forEach(key => {
      if (key === 'image') {
        // Handle image separately
        formData.append('image', bannerData[key]);
      } else {
        formData.append(key, bannerData[key]);
      }
    });

    const url = `${this.baseURL}/admin/banners`;
    const config = {
      method: 'POST',
      headers: this.getAdminFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Adding banner:', bannerData);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await this.fetchWithTimeout(url, config, 120000); // 2 minutes for file uploads
      console.log('Add banner response status:', response.status);
      console.log('Add banner response headers:', response.headers);
      
      const data = await response.json();
      console.log('Add banner response data:', data);

      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Add Banner Error Details:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.message === 'Request Timeout') {
        throw new Error('Upload timeout - Please try again with smaller files or check your internet connection');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection');
      }
      
      throw error;
    }
  }

  async getAllBanners(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${this.baseURL}/admin/banners?${params.toString()}`;
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

  async getBanner(bannerId) {
    const url = `${this.baseURL}/admin/banners/${bannerId}`;
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

  async updateBanner(bannerId, bannerData) {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(bannerData).forEach(key => {
      if (key === 'image') {
        // Handle image separately
        formData.append('image', bannerData[key]);
      } else {
        formData.append(key, bannerData[key]);
      }
    });

    const url = `${this.baseURL}/admin/banners/${bannerId}`;
    const config = {
      method: 'PUT',
      headers: this.getAdminFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Updating banner:', bannerId, bannerData);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await this.fetchWithTimeout(url, config, 120000); // 2 minutes for file uploads
      console.log('Update banner response status:', response.status);
      
      const data = await response.json();
      console.log('Update banner response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Update Banner Error:', error);
      
      // Provide more specific error messages
      if (error.message === 'Request Timeout') {
        throw new Error('Update timeout - Please try again with smaller files or check your internet connection');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection');
      }
      
      throw error;
    }
  }

  async deleteBanner(bannerId) {
    const url = `${this.baseURL}/admin/banners/${bannerId}`;
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


  // Public Banner APIs (for regular users - no authentication required)
  async getPublicBanners(position = 'top', limit = 10) {
    const params = new URLSearchParams({
      position: position,
      limit: limit.toString()
    });

    const url = `${this.baseURL}/admin/banners/public?${params.toString()}`;
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


  // Rental Request APIs
  async getAllRentalRequests(page = 1, limit = 10, status = '', search = '', category = '', city = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (city) params.append('city', city);

    const url = `${this.baseURL}/admin/rental-requests?${params.toString()}`;
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

  async getRentalRequest(requestId) {
    const url = `${this.baseURL}/admin/rental-requests/${requestId}`;
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

  async updateRentalRequestStatus(requestId, status, rejectionReason = null) {
    const url = `${this.baseURL}/admin/rental-requests/${requestId}/status`;
    const config = {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status, rejectionReason }),
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

  async bulkUpdateRentalRequestStatus(requestIds, status, rejectionReason = null) {
    const url = `${this.baseURL}/admin/rental-requests/bulk-status`;
    const config = {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ requestIds, status, rejectionReason }),
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

  async deleteRentalRequest(requestId) {
    const url = `${this.baseURL}/admin/rental-requests/${requestId}`;
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

  async getRentalRequestStats() {
    const url = `${this.baseURL}/admin/rental-requests/stats`;
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

  async getRentalRequestsByUser(userId, page = 1, limit = 10, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);

    const url = `${this.baseURL}/admin/rental-requests/user/${userId}?${params.toString()}`;
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

  // Public Rental Request APIs
  async getPublicRentalRequests(page = 1, limit = 12, search = '', category = '', city = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (city) params.append('city', city);

    const url = `${this.baseURL}/rental-requests?${params.toString()}`;
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

  async getPublicRentalRequest(requestId) {
    const url = `${this.baseURL}/rental-requests/${requestId}`;
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

  async getFeaturedRentalRequests(limit = 8) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const url = `${this.baseURL}/rental-requests/featured?${params.toString()}`;
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

  // Create rental listing (for users)
  async createRentalListing(formData) {
    const url = `${this.baseURL}/rental-requests`;
    const config = {
      method: 'POST',
      headers: this.getFileUploadHeaders(),
      body: formData,
    };

    try {
      console.log('Creating rental listing:', formData);
      console.log('Request config:', config);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await this.fetchWithTimeout(url, config, 120000); // 2 minutes for file uploads
      console.log('Create rental listing response status:', response.status);
      console.log('Create rental listing response headers:', response.headers);
      
      const data = await response.json();
      console.log('Create rental listing response data:', data);

      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Create Rental Listing Error Details:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.message === 'Request Timeout') {
        throw new Error('Upload timeout - Please try again with smaller files or check your internet connection');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - Please check your internet connection');
      }
      
      throw error;
    }
  }

  // Get user's own rental requests
  async getUserRentalListings(page = 1, limit = 10, status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);

    const url = `${this.baseURL}/rental-requests/my-requests?${params.toString()}`;
    const config = {
      headers: this.getHeaders(),
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

  // Update user's rental request
  async updateRentalRequest(rentalId, updateData) {
    const url = `${this.baseURL}/rental-requests/${rentalId}`;
    const config = {
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
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

  // Review APIs
  async getProductReviews(productId, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options.rating) params.append('rating', options.rating);

    const url = `${this.baseURL}/reviews/product/${productId}?${params.toString()}`;
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

  async getRentalRequestReviews(rentalRequestId, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options.rating) params.append('rating', options.rating);

    const url = `${this.baseURL}/reviews/rental-request/${rentalRequestId}?${params.toString()}`;
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

  async createProductReview(productId, reviewData) {
    return this.request(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async createRentalRequestReview(rentalRequestId, reviewData) {
    return this.request(`/reviews/rental-request/${rentalRequestId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async voteReview(reviewId, isHelpful) {
    return this.request(`/reviews/${reviewId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ isHelpful }),
    });
  }

  async removeVote(reviewId) {
    return this.request(`/reviews/${reviewId}/vote`, {
      method: 'DELETE',
    });
  }

  async getUserReviews(userId, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `${this.baseURL}/reviews/user/${userId}?${params.toString()}`;
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

  async getProductReviewStats(productId) {
    const url = `${this.baseURL}/reviews/product/${productId}/stats`;
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

  // Favorites APIs
  async getFavorites() {
    return this.request('/favorites');
  }

  async addToFavorites(itemId, itemType = 'rental-request') {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ itemId, itemType }),
    });
  }

  async removeFromFavorites(itemId) {
    return this.request(`/favorites/${itemId}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(itemId, itemType = 'rental-request') {
    try {
      return await this.request('/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ itemId, itemType }),
      });
    } catch (error) {
      // Handle 404 or route not found errors gracefully for favorites
      if (error.message.includes('Route not found') || error.message.includes('404')) {
        return { success: false, message: 'Favorites API not available' };
      }
      throw error;
    }
  }

  async getFavoriteItems(page = 1, limit = 12, search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);

      return await this.request(`/favorites/items?${params.toString()}`);
    } catch (error) {
      // Handle 404 or route not found errors gracefully for favorites
      if (error.message.includes('Route not found') || error.message.includes('404')) {
        return { success: false, message: 'Favorites API not available' };
      }
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // HTTP method shortcuts
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
