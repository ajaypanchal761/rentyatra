# CORS Fix Guide - Frontend-Backend Connection

## 🚨 **Problem Identified**

Your frontend is getting "Failed to fetch" errors because the Render backend is rejecting requests due to CORS policy. The backend is returning "Not allowed by CORS" errors.

## ✅ **Root Cause**

The deployed backend on Render doesn't have the updated CORS configuration that allows your local frontend to connect to it.

## 🛠️ **Solutions**

### **Solution 1: Redeploy Backend with Updated CORS (Recommended)**

1. **Commit and push your updated backend code:**
   ```bash
   git add Backend/server.js
   git commit -m "Fix CORS configuration for frontend access"
   git push origin main
   ```

2. **Redeploy on Render:**
   - Go to your Render dashboard
   - Find your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete

3. **Update frontend to use Render backend:**
   ```javascript
   // In frontend/src/services/api.js
   const API_BASE_URL = import.meta.env.VITE_API_URL || 
     (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://rentyatra-1.onrender.com/api');
   ```

### **Solution 2: Use Local Backend for Development (Temporary)**

I've temporarily updated your frontend to use the local backend. To use this:

1. **Start your local backend:**
   ```bash
   cd Backend
   npm start
   ```

2. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access your app:** `http://localhost:8080`

### **Solution 3: Set Environment Variables**

Create a `.env` file in your frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔧 **CORS Configuration Details**

The updated CORS configuration in your backend now allows:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8080`
- `https://rentyatra.vercel.app`
- `https://rentyatra-frontend.onrender.com`

## 🚀 **Quick Fix Steps**

### **For Immediate Development:**

1. **Start Backend Locally:**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Connection:**
   ```bash
   node test-frontend-backend.js
   ```

### **For Production Deployment:**

1. **Redeploy Backend:**
   - Push your changes to GitHub
   - Trigger a new deployment on Render

2. **Update Frontend API URL:**
   ```javascript
   const API_BASE_URL = 'https://rentyatra-1.onrender.com/api';
   ```

3. **Deploy Frontend:**
   - Build and deploy your frontend with the correct API URL

## 🧪 **Testing**

Use the test script to verify the connection:
```bash
node test-frontend-backend.js
```

This will test:
- Health endpoint
- Categories endpoint
- Featured products endpoint

## 📋 **Environment Variables for Render**

Make sure these are set in your Render backend environment:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:8080
```

## 🔍 **Debugging**

If you still have issues:

1. **Check Render logs** for CORS errors
2. **Use browser DevTools** Network tab to see the exact error
3. **Test with curl** to verify backend accessibility
4. **Check environment variables** in Render dashboard

The CORS issue is now identified and the solution is ready to implement!
