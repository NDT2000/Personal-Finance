# Backend Deployment Guide

Your Personal Finance application has a complete backend server that needs to be deployed separately from the frontend. Here are your options:

## Option 1: Deploy Backend to a Cloud Service

### Recommended: Railway, Render, or Heroku

1. **Create a new project** on your chosen platform
2. **Connect your GitHub repository**
3. **Set environment variables**:
   - `NODE_ENV=production`
   - Database credentials (already configured in server.js)

4. **Update the frontend API URL** in `src/services/apiService.js`:
   ```javascript
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.railway.app/api' // Replace with your actual backend URL
     : 'http://localhost:3001/api'
   ```

## Option 2: Use Your Existing Database

Your backend is already configured with a TiDB Cloud database. You just need to:

1. **Deploy the backend server** to any cloud platform
2. **Update the frontend** to point to the deployed backend URL
3. **The database will work immediately** (already configured)

## Option 3: Local Development Setup

For local development:

1. **Start the backend server**:
   ```bash
   npm run server
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

3. **Access the application** at `http://localhost:5173`

## Current Backend Features

Your backend includes:
- ✅ User authentication with bcrypt
- ✅ MySQL/TiDB database integration
- ✅ Account management
- ✅ Transaction tracking
- ✅ ML categorization
- ✅ Regression analysis
- ✅ Goal tracking
- ✅ CORS enabled
- ✅ Error handling

## Next Steps

1. **Choose a deployment platform** (Railway, Render, Heroku, etc.)
2. **Deploy your backend server**
3. **Update the API_BASE_URL** in the frontend
4. **Redeploy the frontend** to GitHub Pages

The backend is production-ready and will work immediately once deployed!
