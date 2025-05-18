# Step-by-Step Deployment Guide for CV Mock Test

This guide provides detailed steps to deploy your CV Mock Test application to Render.com with MongoDB Atlas integration.

## Step 1: Create a MongoDB Atlas Account and Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create an account
2. Create a new project (e.g., "CV Mock Test")
3. Click "Build a Database" and select the free tier option
4. Choose your preferred cloud provider and region
5. Click "Create Cluster" and wait for it to be provisioned (takes a few minutes)
6. Under "Security" tab, create a database user:
   - Click "Database Access" → "Add New Database User"
   - Set Authentication Method to "Password"
   - Enter a username and password (save these securely)
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"
7. Add your IP address to the access list:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" for development (you can restrict this later)
   - Click "Confirm"
8. Get your connection string:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Add your database name after `mongodb.net/` (e.g., `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cv-mock-test?retryWrites=true&w=majority`)

## Step 2: Prepare Your Application for Deployment

1. Make sure your code is in a GitHub repository
2. Verify your package.json has the correct scripts:
   ```json
   "scripts": {
     "start": "node server/server.js",
     "build": "npm run build --prefix client",
     "install-all": "npm install && npm install --prefix client && npm install --prefix server",
     "render-build": "npm run install-all && npm run build"
   }
   ```
3. Ensure your server is configured to serve the React app in production mode:
   ```javascript
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/build')));
     app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
     });
   }
   ```
4. Commit and push all changes to GitHub:
   ```
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

## Step 3: Deploy to Render.com

1. Go to [Render.com](https://render.com/) and create an account
2. From your dashboard, click "New" and select "Web Service"
3. Connect to your GitHub repository
4. Configure the service:
   - **Name**: cv-mock-test
   - **Environment**: Node
   - **Region**: Choose the closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add the following environment variables:
   - Click "Advanced" and then "Add Environment Variable" for each:
   
   | Key | Value |
   |-----|-------|
   | NODE_ENV | production |
   | PORT | 5000 |
   | MONGO_URI | Your MongoDB Atlas connection string |
   | JWT_SECRET | A random secure string (e.g., use a password generator) |
   | FILE_UPLOAD_MAX_SIZE | 52428800 |

6. Click "Create Web Service"

7. Wait for the deployment to complete (monitor the logs)

8. Once deployed, Render will provide a URL (e.g., https://cv-mock-test.onrender.com)

## Step 4: Test Your Deployed Application

1. Visit the URL provided by Render
2. Test all functionality:
   - User registration and login
   - Exam selection
   - Mock test interface
   - PDF upload (admin)
   - Performance analytics

## Step 5: Add a Custom Domain (Optional)

1. Purchase a domain from a domain registrar (e.g., Namecheap, GoDaddy)
2. In your Render dashboard, go to your web service
3. Click "Settings" and then "Custom Domain"
4. Add your custom domain and follow the DNS configuration instructions

## Troubleshooting Common Issues

### Application Not Loading
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure build process completed successfully

### MongoDB Connection Issues
- Check if MongoDB Atlas IP access list includes 0.0.0.0/0 (allow from anywhere)
- Verify database user credentials
- Ensure connection string format is correct

### PDF Upload Not Working
- Check if FILE_UPLOAD_MAX_SIZE environment variable is set
- Verify the temp directory permissions
- Check server logs for specific errors

### Client-Side Routing Issues
- Make sure your server.js has the catch-all route for client-side routing
- Verify that React Router is configured correctly

## Maintenance

- Monitor your application performance in the Render dashboard
- Set up alerts for downtime or errors
- Regularly backup your MongoDB database
- Update dependencies periodically for security patches

---

For additional help, refer to:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html) 