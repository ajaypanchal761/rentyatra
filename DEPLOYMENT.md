# RentYatra Deployment Guide

## Render Deployment Configuration

### Backend Deployment

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Choose "Web Service"

2. **Configure Build & Deploy Settings**
   ```
   Build Command: cd Backend && npm install
   Start Command: cd Backend && npm start
   ```

3. **Environment Variables**
   Set these in your Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   SMSINDIAHUB_API_KEY=your_sms_api_key
   SMSINDIAHUB_SENDER_ID=your_sms_sender_id
   FRONTEND_URL=https://your-frontend-app.onrender.com
   CORS_ORIGIN=https://your-frontend-app.onrender.com
   ```

### Alternative: Using render.yaml

If you prefer to use the `render.yaml` file:
1. Make sure the `render.yaml` file is in your repository root
2. Render will automatically detect and use it
3. You can still override settings in the Render dashboard

### Frontend Deployment (Optional)

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Choose "Static Site"

2. **Configure Build Settings**
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

## Troubleshooting

### Common Issues

1. **"Couldn't find package.json"**
   - Make sure you're using the correct build/start commands with `cd Backend &&`
   - Or use the `render.yaml` configuration file

2. **CORS Errors**
   - Update `FRONTEND_URL` and `CORS_ORIGIN` environment variables
   - Make sure your frontend URL is correct

3. **Database Connection Issues**
   - Verify your `MONGODB_URI` is correct
   - Check if your MongoDB Atlas cluster allows connections from Render's IPs

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`

### Manual Configuration Steps

If you prefer manual configuration over `render.yaml`:

1. **Backend Service Settings:**
   - **Build Command:** `cd Backend && npm install`
   - **Start Command:** `cd Backend && npm start`
   - **Node Version:** 18.x or higher

2. **Environment Variables:**
   - Add all required environment variables from the list above
   - Make sure to mark sensitive variables as "Secret"

3. **Health Check:**
   - Render will automatically check `/api/health` endpoint
   - Make sure this endpoint is working

## Post-Deployment

1. **Test your API endpoints:**
   ```
   https://your-backend-app.onrender.com/api/health
   ```

2. **Update frontend API URL:**
   - Update your frontend to use the new backend URL
   - Redeploy frontend if necessary

3. **Monitor logs:**
   - Check Render logs for any errors
   - Monitor performance and response times
