# MongoDB Setup Guide

## Fixing TLS/SSL Errors on Render
If you see errors like `tlsv1 alert internal error` or `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`, you need to force Node.js to use TLS 1.2 or higher.

**How to fix:**
1. Go to your Render service dashboard.
2. Add an environment variable:
   - Key: `NODE_OPTIONS`
   - Value: `--tls-min-v1.2`
3. Save and redeploy your service.

---

# MongoDB Connection Setup Guide

## Current Issue
You're getting a "Could not connect to any servers in your MongoDB Atlas cluster" error because your IP address isn't whitelisted in MongoDB Atlas.

## Solution 1: Whitelist Your IP in MongoDB Atlas (Recommended)

### Step-by-Step Instructions:

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Sign in with your credentials

2. **Navigate to Network Access**
   - Select your project
   - Click on "Network Access" in the left sidebar
   - Click "IP Access List"

3. **Add Your IP Address**
   - Click "Add IP Address" button
   - You have two options:
     - **Option A (Secure)**: Click "Add Current IP Address" to add only your current IP
     - **Option B (Development)**: Enter `0.0.0.0/0` to allow all IP addresses (less secure, but easier for development)

4. **Save Changes**
   - Click "Confirm" to save the changes
   - Wait a few minutes for the changes to take effect

### Find Your Current IP Address:
- Visit: https://whatismyipaddress.com/
- Copy your public IP address
- Add it to the whitelist

## Solution 2: Use Local MongoDB (Alternative)

If you prefer to use a local MongoDB instance:

1. **Install MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Install following the installation wizard

2. **Start MongoDB Service**
   - On Windows: MongoDB should start automatically as a service
   - Or run: `mongod` in a terminal

3. **Use Local Connection**
   - The connection string will be: `mongodb://localhost:27017/social_dashboard`

## Solution 3: Use MongoDB Atlas with Environment Variables

For better security, use environment variables:

1. **Create a .env file**
   ```env
   MONGODB_URI=mongodb+srv://bavdhanekunal19:Kunal1234@cluster0.ubecr2g.mongodb.net/social_dashboard?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Install dotenv**
   ```bash
   npm install dotenv
   ```

3. **Update db.js**
   ```javascript
   require('dotenv').config();
   const MONGO_URI = process.env.MONGODB_URI;
   ```

## Testing Your Connection

After implementing any solution, test with:
```bash
node test-connection.js
```

## Common Issues and Solutions

### Issue: "SSL/TLS Alert Internal Error"
- **Cause**: Node.js version compatibility
- **Solution**: Update MongoDB driver or use the connection options in the updated db.js

### Issue: "Authentication Failed"
- **Cause**: Wrong username/password
- **Solution**: Check your MongoDB Atlas Database Access settings

### Issue: "Database Not Found"
- **Cause**: Database doesn't exist
- **Solution**: MongoDB Atlas will create the database automatically on first use

## Next Steps

1. **Whitelist your IP** in MongoDB Atlas (Solution 1)
2. **Test the connection** with `node test-connection.js`
3. **Start your backend** with `node index.cjs`
4. **If still having issues**, try the local MongoDB option (Solution 2)

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community Server: https://docs.mongodb.com/manual/installation/
- Node.js MongoDB Driver: https://docs.mongodb.com/drivers/node/ 