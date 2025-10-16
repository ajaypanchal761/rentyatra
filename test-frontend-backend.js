// Test script to verify frontend-backend connection
const API_BASE_URL = 'https://rentyatra-1.onrender.com/api';

async function testConnection() {
  console.log('🧪 Testing Frontend-Backend Connection...');
  console.log('📍 Backend URL:', API_BASE_URL);
  
  const tests = [
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET'
    },
    {
      name: 'Categories',
      endpoint: '/categories',
      method: 'GET'
    },
    {
      name: 'Featured Products',
      endpoint: '/products/featured?limit=5',
      method: 'GET'
    }
  ];

  for (const test of tests) {
    console.log(`\n🔍 Testing ${test.name}...`);
    
    try {
      const response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        // Add origin header to simulate browser request
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:8080'
        }
      });
      
      console.log(`📡 Status: ${response.status} ${response.statusText}`);
      console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name} - Success!`);
        console.log(`📊 Response:`, test.name === 'Health Check' ? data : `${test.name} data received (${JSON.stringify(data).length} chars)`);
      } else {
        console.log(`❌ ${test.name} - Failed with status ${response.status}`);
        const errorText = await response.text();
        console.log(`📄 Error response:`, errorText);
      }
      
    } catch (error) {
      console.error(`❌ ${test.name} - Error:`, error.message);
      if (error.message.includes('Failed to fetch')) {
        console.log('🔧 This suggests a network connectivity issue');
      }
    }
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n💡 If you see CORS errors, the backend needs to be updated with your frontend origin');
  console.log('💡 If you see network errors, check your internet connection');
}

// Run the test
testConnection();
