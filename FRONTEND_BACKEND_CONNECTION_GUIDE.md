# Frontend-Backend Connection Troubleshooting Guide

## 🚨 Current Issue: "Failed to fetch" Error

The frontend is getting "Failed to fetch" errors when trying to connect to the backend. This indicates a network connectivity issue.

## 🔍 **Step-by-Step Troubleshooting**

### 1. **Check Backend Server Status**
First, make sure your backend is running:

```bash
cd Backend
npm start
```

You should see:
```
🚀 RentYatra Backend Server Started Successfully!
📡 Server running on: 0.0.0.0:5000
```

### 2. **Test Backend Endpoints Manually**
Run the test script I created:

```bash
node test-backend.js
```

This will test:
- Health endpoint: `http://localhost:5000/api/health`
- Categories endpoint: `http://localhost:5000/api/categories`
- Products endpoint: `http://localhost:5000/api/products`

### 3. **Check Environment Variables**

#### For Development:
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### For Production:
```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

### 4. **Verify CORS Configuration**

Your backend CORS is configured to allow:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://rentyatra.onrender.com`
- `https://rentyatra-frontend.onrender.com`

Make sure your frontend URL matches one of these.

### 5. **Check Network Tab in Browser**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load the page
4. Look for failed requests (they'll be red)
5. Click on failed requests to see the error details

### 6. **Common Solutions**

#### Solution 1: Use Vite Proxy (Recommended for Development)
Your `vite.config.js` already has proxy configuration. Make sure you're accessing the frontend through the Vite dev server:

```bash
cd frontend
npm run dev
```

Then access: `http://localhost:8080` (not the built version)

#### Solution 2: Update API Base URL
If you're using the built version, update the API URL in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // For development
// or
const API_BASE_URL = 'https://your-backend-app.onrender.com/api'; // For production
```

#### Solution 3: Check Backend CORS
Make sure your backend is running and CORS is properly configured. The backend should log CORS blocked origins if any.

### 7. **Production Deployment Issues**

If deploying to Render:

1. **Backend Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-app.onrender.com
   CORS_ORIGIN=https://your-frontend-app.onrender.com
   ```

2. **Frontend Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

3. **Build Commands:**
   - Backend: `cd Backend && npm install && npm start`
   - Frontend: `cd frontend && npm install && npm run build`

## 🛠️ **Quick Fixes**

### Fix 1: Development Mode
```bash
# Terminal 1 - Start Backend
cd Backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

Access frontend at: `http://localhost:8080`

### Fix 2: Update API Service
The API service has been updated with better error handling and logging. Check the browser console for detailed error messages.

### Fix 3: Test Backend Connectivity
```bash
# Test if backend is accessible
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"RentYatra API is running","timestamp":"..."}
```

## 🔧 **Debugging Steps**

1. **Check Backend Logs:**
   - Look for CORS errors
   - Check if requests are reaching the backend
   - Verify database connection

2. **Check Frontend Console:**
   - Look for the detailed API request logs I added
   - Check for CORS errors
   - Verify the API URL being used

3. **Network Analysis:**
   - Use browser DevTools Network tab
   - Check if requests are being made
   - Look at response status codes

## 📞 **If Still Having Issues**

1. Run the test script: `node test-backend.js`
2. Check browser console for detailed error messages
3. Verify both frontend and backend are running
4. Check if there are any firewall or antivirus blocking connections
5. Try accessing the backend directly in browser: `http://localhost:5000/api/health`

The updated API service now provides much better error messages and logging to help identify the exact issue.
