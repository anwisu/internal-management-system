# Railway Deployment Guide

This guide will help you deploy the Internal Management Platform to Railway with separate frontend and backend services.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your code
- MongoDB instance (Railway MongoDB service or external MongoDB Atlas)
- Cloudinary account for image uploads

## Architecture

The application is deployed as two separate Railway services:
- **Backend Service**: Node.js/Express API server
- **Frontend Service**: React/Vite static site served via preview server

## Step-by-Step Deployment

### 1. Create Railway Project

1. Log in to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Add MongoDB Service

**Option A: Railway MongoDB (Recommended)**
1. In your Railway project, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically create a MongoDB instance
4. Note the connection string from the MongoDB service variables

**Option B: External MongoDB (MongoDB Atlas)**
1. Use your existing MongoDB Atlas connection string
2. Ensure your MongoDB Atlas IP whitelist allows Railway IPs (or use 0.0.0.0/0 for development)

### 3. Deploy Backend Service

1. In your Railway project, click "New" → "GitHub Repo"
2. Select the same repository
3. Railway will detect the service automatically
4. Click on the service to configure it:
   - **Root Directory**: Set to `backend`
   - **Build Command**: `npm install` (handled by railway.json)
   - **Start Command**: `npm start` (handled by railway.json)

### 4. Configure Backend Environment Variables

In the backend service settings, go to "Variables" and add:

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
NODE_ENV=production
FRONTEND_URL=<your-frontend-railway-url>
```

**Notes:**
- `PORT` is optional (Railway auto-assigns, but defaults to 5000)
- `MONGODB_URI`: Use the connection string from Railway MongoDB or MongoDB Atlas
- `FRONTEND_URL`: Set this after deploying the frontend service (e.g., `https://your-frontend-service.up.railway.app`)

### 5. Deploy Frontend Service

1. In your Railway project, click "New" → "GitHub Repo"
2. Select the same repository again
3. Click on the new service to configure it:
   - **Root Directory**: Set to `frontend`
   - **Build Command**: `npm install && npm run build` (handled by railway.json)
   - **Start Command**: `npm run preview` (handled by railway.json)

### 6. Configure Frontend Environment Variables

In the frontend service settings, go to "Variables" and add:

```
VITE_API_URL=<your-backend-railway-url>/api
PORT=3000
```

**Notes:**
- `VITE_API_URL`: Use your backend service's public URL (e.g., `https://your-backend-service.up.railway.app/api`)
- `PORT` is optional (Railway auto-assigns, but defaults to 3000)
- **Important**: Vite environment variables must be prefixed with `VITE_` to be accessible in the browser

### 7. Update Backend CORS Configuration

After deploying the frontend, update the backend's `FRONTEND_URL` environment variable with the frontend service's public URL. This ensures CORS is properly configured.

### 8. Generate Public URLs

1. For each service, go to "Settings" → "Networking"
2. Click "Generate Domain" to create a public URL
3. Copy the generated URLs for use in environment variables

## Environment Variables Reference

### Backend Service Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port (Railway auto-assigns) | `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://...` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret | `your-secret-key` |
| `NODE_ENV` | Yes | Environment mode | `production` |
| `FRONTEND_URL` | Recommended | Frontend service URL for CORS | `https://frontend.up.railway.app` |

### Frontend Service Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API base URL | `https://backend.up.railway.app/api` |
| `PORT` | No | Preview server port | `3000` |

## Verification

### Backend Health Check

Visit your backend service URL:
```
https://your-backend-service.up.railway.app/status
```

Expected response:
```json
{
  "status": "ok"
}
```

### Frontend Access

Visit your frontend service URL. The application should load and connect to the backend API.

## Troubleshooting

### Backend Issues

1. **Database Connection Failed**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB service is running (if using Railway MongoDB)
   - Ensure IP whitelist includes Railway IPs (if using MongoDB Atlas)

2. **CORS Errors**
   - Verify `FRONTEND_URL` matches your frontend service URL exactly
   - Check that the frontend URL includes the protocol (`https://`)

3. **Port Issues**
   - Railway automatically assigns ports via `PORT` environment variable
   - Ensure your code uses `process.env.PORT` (already configured)

### Frontend Issues

1. **API Connection Failed**
   - Verify `VITE_API_URL` is set correctly
   - Ensure the URL includes `/api` at the end
   - Check that the backend service is running and accessible

2. **Build Failures**
   - Check Railway build logs for specific errors
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **Environment Variables Not Working**
   - Remember: Vite requires `VITE_` prefix for client-side variables
   - Rebuild the frontend after changing environment variables
   - Check that variables are set in Railway dashboard, not just locally

## Production Considerations

1. **Security**
   - Never commit `.env` files to Git
   - Use Railway's environment variables for all secrets
   - Keep Cloudinary credentials secure

2. **Performance**
   - Consider enabling Railway's CDN for static assets
   - Monitor service usage and scale as needed
   - Set up Railway monitoring and alerts

3. **Database**
   - Use Railway MongoDB for easier management
   - Or configure MongoDB Atlas with proper security settings
   - Regular backups recommended

4. **Updates**
   - Railway automatically deploys on git push (if connected)
   - Environment variable changes require service restart
   - Frontend rebuilds are needed when changing `VITE_*` variables

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express CORS Configuration](https://expressjs.com/en/resources/middleware/cors.html)

