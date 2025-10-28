# 🔐 Environment Variables Setup Guide

This guide will help you configure the `.env` file for your Expense Tracker backend server.

## 📋 Prerequisites

Before setting up the environment variables, ensure you have:

1. Node.js installed (v14 or higher)
2. MongoDB installed locally OR a MongoDB Atlas account
3. A code editor

## 🚀 Quick Setup

### Step 1: Copy the Environment File

The `.env` file has been created in the `/server` directory with placeholder values. You need to update these values based on your setup.

```bash
cd server
```

### Step 2: Configure MongoDB

#### Option A: Local MongoDB

If you're running MongoDB locally:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=expense_tracker
```

#### Option B: MongoDB Atlas (Cloud)

If you're using MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace the placeholder in `.env`:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=expense_tracker
```

**Important:** Replace `your_username` and `your_password` with your actual credentials.

### Step 3: Generate a Strong JWT Secret

The JWT_SECRET is used to sign authentication tokens. Generate a secure random string:

#### Method 1: Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it in your `.env`:

```env
JWT_SECRET=your_generated_secret_here
```

#### Method 2: Using Online Tool

Visit [RandomKeygen](https://randomkeygen.com/) and copy a "CodeIgniter Encryption Key"

### Step 4: Configure CORS Origin

Set the frontend URL for CORS:

**Development:**
```env
CORS_ORIGIN=http://localhost:3000
```

**Production:**
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### Step 5: Set Node Environment

```env
NODE_ENV=development
```

Change to `production` when deploying to production.

## 📝 Complete .env Example

Here's what your final `.env` file should look like:

### For Local Development:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
DB_NAME=expense_tracker
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### For Production (MongoDB Atlas):

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://admin:MySecureP@ss123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=expense_tracker_prod
JWT_SECRET=your_64_character_random_secret_generated_securely_for_production
JWT_EXPIRE=7d
CORS_ORIGIN=https://myexpenseapp.com
```

## 🔍 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port number for the server | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `expense_tracker` |
| `JWT_SECRET` | Secret key for JWT tokens | Generated random string |
| `JWT_EXPIRE` | Token expiration time | `7d` (7 days) |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:3000` |

## 🛡️ Security Best Practices

1. **Never commit `.env` to version control**
   - The `.gitignore` file already includes `.env`
   - Always keep `.env` files private

2. **Use strong JWT secrets**
   - Minimum 32 characters
   - Use cryptographically secure random strings
   - Different secrets for different environments

3. **Rotate secrets regularly**
   - Change JWT_SECRET periodically in production
   - Use environment-specific secrets

4. **Use different databases for different environments**
   - Development: `expense_tracker_dev`
   - Production: `expense_tracker_prod`
   - Testing: `expense_tracker_test`

## 🚀 Running the Server

After configuring your `.env` file:

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start
```

## ✅ Verify Setup

1. Start the server:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB Connected: localhost
   📊 Database: expense_tracker
   🚀 Server running in development mode on port 5000
   📡 API: http://localhost:5000/api
   💚 Health: http://localhost:5000/health
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2025-10-25T12:00:00.000Z"
   }
   ```

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
- Ensure MongoDB is running locally: `mongod`
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for testing)
- Verify connection string credentials

### JWT Token Issues

**Error:** `JsonWebTokenError: secret or public key must be provided`

**Solution:**
- Ensure `JWT_SECRET` is set in `.env`
- Restart the server after changing `.env`

### CORS Errors

**Error:** `Access-Control-Allow-Origin header`

**Solution:**
- Set correct `CORS_ORIGIN` in `.env`
- Ensure frontend is running on the specified origin

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [JWT Best Practices](https://jwt.io/introduction)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🆘 Need Help?

If you encounter any issues:

1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed: `npm install`
5. Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`

---

**Last Updated:** October 25, 2025
