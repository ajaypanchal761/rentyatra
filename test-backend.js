// Simple script to test backend connectivity
const API_BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 Testing backend connectivity...');
  console.log('📍 API Base URL:', API_BASE_URL);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check response:', healthData);
    } else {
      console.log('❌ Health check failed');
    }
    
    // Test categories endpoint
    console.log('\n2. Testing categories endpoint...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
    console.log('Categories status:', categoriesResponse.status);
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('✅ Categories response:', categoriesData);
    } else {
      console.log('❌ Categories endpoint failed');
    }
    
    // Test products endpoint
    console.log('\n3. Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    console.log('Products status:', productsResponse.status);
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Products response:', productsData);
    } else {
      console.log('❌ Products endpoint failed');
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.error('Full error:', error);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Make sure your backend server is running on port 5000');
      console.log('2. Check if the backend URL is correct');
      console.log('3. Verify CORS configuration in backend');
      console.log('4. Check if there are any firewall issues');
    }
  }
}

// Run the test
testBackend();
