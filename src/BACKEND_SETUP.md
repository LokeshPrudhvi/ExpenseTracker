# Backend Setup Guide

Complete guide to set up and run the MERN stack backend for the Expense Tracker application.

## 🎯 Quick Start

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your actual MongoDB connection string and JWT secret:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
DB_NAME=expense_tracker
```

### Step 4: Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier available)
4. Wait for cluster creation (2-5 minutes)
5. Click "Connect" button
6. Choose "Connect your application"
7. Copy the connection string
8. It will look like: `mongodb+srv://username:<password>@cluster.mongodb.net/`
9. Replace `<password>` with your actual database user password
10. Paste into `.env` as `MONGODB_URI`

#### Option B: Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/expense_tracker`

### Step 5: Generate JWT Secret

Use a strong random string for `JWT_SECRET`. You can generate one using:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Online:** Use [randomkeygen.com](https://randomkeygen.com/)

### Step 6: Start the Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: expense_tracker
🚀 Server running in development mode on port 5000
📡 API: http://localhost:5000/api
💚 Health: http://localhost:5000/health
```

### Step 7: Test the Server

Visit in browser or use curl:
```bash
curl http://localhost:5000/health
```

Response should be:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-25T..."
}
```

## 🔧 Frontend Configuration

### Step 1: Create Frontend .env File

In the **root directory** (not /server):

```bash
cp .env.example .env
```

### Step 2: Configure API URL

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend

```bash
npm run dev
```

## 📝 Complete .env Files

### Server (.env in /server directory)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration (REQUIRED - Replace with your actual connection string)
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/

# JWT Secret (REQUIRED - Generate a strong random string)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# JWT Token Expiration
JWT_EXPIRE=7d

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000

# Database Name
DB_NAME=expense_tracker
```

### Frontend (.env in root directory)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running Both Frontend and Backend

### Terminal 1: Backend

```bash
cd server
npm run dev
```

### Terminal 2: Frontend

```bash
npm run dev
```

## ✅ Verification Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB Atlas account created OR local MongoDB installed
- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] `.env` file created in `/server` directory
- [ ] `MONGODB_URI` added to `/server/.env`
- [ ] `JWT_SECRET` added to `/server/.env` (strong random string)
- [ ] Frontend `.env` file created in root directory
- [ ] `VITE_API_URL` set in frontend `.env`
- [ ] Backend running successfully on port 5000
- [ ] Frontend running successfully on port 3000
- [ ] Health check endpoint returns success

## 🔐 Security Best Practices

1. **Never commit .env files** - They are in `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Keep MongoDB credentials secure**
4. **Use environment-specific settings**
5. **Enable MongoDB network access** only for your IP

## 🐛 Common Issues

### Issue: MongoDB Connection Failed

**Solution:**
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas network access (allow your IP)
- Check database user credentials
- Ensure cluster is running

### Issue: Port 5000 Already in Use

**Solution:**
- Change `PORT` in `/server/.env` to `5001` or another port
- Update frontend `VITE_API_URL` accordingly

### Issue: JWT Token Errors

**Solution:**
- Ensure `JWT_SECRET` is set in `/server/.env`
- Clear browser localStorage and login again
- Check token format in API requests

### Issue: CORS Errors

**Solution:**
- Verify `CORS_ORIGIN` in `/server/.env` matches frontend URL
- Check frontend is running on the correct port
- Restart backend server after `.env` changes

## 📊 Database Collections

After running the app, MongoDB will automatically create these collections:

- `users` - User accounts and profiles
- `expenses` - All expense records
- `savingsgoals` - Savings goals
- `customcategories` - User-created categories
- `recurringexpenses` - Recurring expense definitions
- `emis` - EMI/loan records

## 🔄 Data Migration

If you previously used localStorage, you'll need to:

1. Export data from old app (use Data Management page)
2. Login to new app
3. Import data (upcoming feature) or manually re-enter

## 📱 API Testing

### Using Postman or Thunder Client

1. Import the API endpoints
2. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🎉 Success!

Your backend is now running! The frontend will automatically connect to it when you login/register.

## 🔗 Next Steps

- Try registering a new account
- Add some expenses
- Create savings goals
- Set up recurring expenses
- Track EMIs

## 📚 Additional Documentation

- See `/server/README.md` for detailed API documentation
- Check API routes in `/server/routes/` directory
- Review models in `/server/models/` directory

---

**Need Help?** Check the troubleshooting section above or review the server logs for detailed error messages.
