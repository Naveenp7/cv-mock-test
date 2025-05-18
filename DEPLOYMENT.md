# CV Mock Test Deployment Guide

This guide will walk you through deploying the CV Mock Test application to Render.com.

## Prerequisites

1. A MongoDB Atlas account
2. A Render.com account
3. Your project code pushed to a GitHub repository

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account if you don't have one: https://www.mongodb.com/cloud/atlas/register
2. Create a new project in MongoDB Atlas
3. Build a new cluster (free tier is sufficient for testing)
4. Create a database user with read/write permissions
5. Add your IP address to the IP Access List (or allow access from anywhere for testing)
6. Create a new database named `cv-mock-test`

## Step 2: Get Your MongoDB Connection String

1. In your MongoDB Atlas dashboard, click "Connect" on your cluster
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user's password
5. Replace `<dbname>` with `cv-mock-test`

## Step 3: Deploy to Render.com

1. Create a Render.com account if you don't have one: https://render.com/
2. In the Render dashboard, click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the web service:
   - **Name**: cv-mock-test (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add the following environment variables:
   - `NODE_ENV`: production
   - `PORT`: 5000
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random string for JWT encryption
   - `FILE_UPLOAD_MAX_SIZE`: 52428800

6. Click "Create Web Service"

## Step 4: Verify Deployment

1. Wait for the deployment to complete (this may take a few minutes)
2. Once deployed, Render will provide a URL for your application
3. Visit the URL to verify that your application is running correctly

## Troubleshooting

### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

1. Verify your connection string is correct
2. Ensure your database user has the correct permissions
3. Check that your IP is whitelisted in MongoDB Atlas
4. Look at the Render logs for specific error messages

### Build Failures

If your build is failing:

1. Check the build logs in Render
2. Ensure all dependencies are correctly listed in your package.json
3. Verify that your build scripts are correct

### Client-Side Routing Issues

If you're experiencing client-side routing issues:

1. Make sure your server is configured to serve the React app for all routes
2. Check that your React Router configuration is correct

## Updating Your Deployment

To update your deployment:

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy your application

## Custom Domain (Optional)

To use a custom domain:

1. In the Render dashboard, go to your web service
2. Click on "Settings" and then "Custom Domain"
3. Follow the instructions to add your domain

---

For any additional help, refer to the [Render documentation](https://render.com/docs) or [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/). 