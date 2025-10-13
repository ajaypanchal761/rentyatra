// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
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

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
