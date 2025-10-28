# 🚀 Backend Setup Instructions

## Prerequisites

Before starting, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas account) - [Setup Guide](#mongodb-setup)
- **npm** or **yarn** package manager

---

## 📦 Installation Steps

### Step 1: Install Dependencies

Navigate to the server directory and install all required packages:

```bash
cd server
npm install
```

This will install:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- express-validator
- nodemon (dev dependency)

---

### Step 2: Configure Environment Variables

The `.env` file has been created with default values. You need to update it based on your setup.

#### Edit `/server/.env`:

```env
# =================================
# SERVER CONFIGURATION
# =================================
PORT=5000
NODE_ENV=development

# =================================
# DATABASE CONFIGURATION
# =================================
MONGODB_URI=mongodb://localhost:27017
DB_NAME=expense_tracker

# =================================
# JWT AUTHENTICATION
# =================================
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# =================================
# CORS CONFIGURATION
# =================================
CORS_ORIGIN=http://localhost:3000
```

---

## 🗄️ MongoDB Setup

### Option A: Local MongoDB

1. **Install MongoDB:**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB:**
   ```bash
   # macOS/Linux
   mongod

   # Windows (as service)
   net start MongoDB
   ```

3. **Verify:**
   ```bash
   mongo --version
   ```

4. **Update .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=expense_tracker
   ```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Create username and password
   - Set privileges to "Atlas admin"
   - Click "Add User"

4. **Setup Network Access:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) - **For development only**
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=expense_tracker
   ```

---

## 🔐 Generate JWT Secret

For security, generate a strong JWT secret:

### Method 1: Using Node.js (Recommended)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste in your `.env`:

```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
```

### Method 2: Using OpenSSL

```bash
openssl rand -hex 64
```

---

## 🏃 Running the Server

### Development Mode (with auto-reload):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

### Expected Output:

```
✅ MongoDB Connected: localhost
📊 Database: expense_tracker

🚀 Server running in development mode on port 5000
📡 API: http://localhost:5000/api
💚 Health: http://localhost:5000/health
```

---

## ✅ Verify Setup

### Test Health Endpoint:

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

### Test User Registration:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── categoryController.js # Custom categories
│   ├── emiController.js      # EMI management
│   ├── expenseController.js  # Expense CRUD
│   ├── recurringController.js # Recurring expenses
│   └── savingsController.js  # Savings goals
├── middleware/
│   └── auth.js              # JWT verification
├── models/
│   ├── CustomCategory.js    # Category schema
│   ├── EMI.js               # EMI schema
│   ├── Expense.js           # Expense schema
│   ├── RecurringExpense.js  # Recurring schema
│   ├── SavingsGoal.js       # Savings schema
│   └── User.js              # User schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── categoryRoutes.js    # Category endpoints
│   ├── emiRoutes.js         # EMI endpoints
│   ├── expenseRoutes.js     # Expense endpoints
│   ├── recurringRoutes.js   # Recurring endpoints
│   └── savingsRoutes.js     # Savings endpoints
├── .env                     # Environment variables
├── .env.example             # Example env file
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── server.js                # Entry point
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Expenses
- `GET /api/expenses` - Get all expenses (Protected)
- `POST /api/expenses` - Create expense (Protected)
- `GET /api/expenses/range?startDate=&endDate=` - Get by date range (Protected)
- `PUT /api/expenses/:id` - Update expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)

### Savings Goals
- `GET /api/savings` - Get all goals (Protected)
- `POST /api/savings` - Create goal (Protected)
- `PUT /api/savings/:id` - Update goal (Protected)
- `DELETE /api/savings/:id` - Delete goal (Protected)

### Custom Categories
- `GET /api/categories` - Get all categories (Protected)
- `POST /api/categories` - Create category (Protected)
- `DELETE /api/categories/:id` - Delete category (Protected)

### Recurring Expenses
- `GET /api/recurring` - Get all recurring (Protected)
- `POST /api/recurring` - Create recurring (Protected)
- `PUT /api/recurring/:id` - Update recurring (Protected)
- `DELETE /api/recurring/:id` - Delete recurring (Protected)

### EMI
- `GET /api/emi` - Get all EMIs (Protected)
- `POST /api/emi` - Create EMI (Protected)
- `PUT /api/emi/:id` - Update EMI (Protected)
- `DELETE /api/emi/:id` - Delete EMI (Protected)

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running: `mongod`
2. Check connection string in `.env`
3. For Atlas: Verify IP whitelist and credentials
4. Check firewall settings

### JWT Token Errors

**Error:** `JsonWebTokenError: secret or public key must be provided`

**Solution:**
1. Ensure `JWT_SECRET` is set in `.env`
2. Generate a new secret using crypto
3. Restart the server

### CORS Errors

**Error:** `Access-Control-Allow-Origin header`

**Solution:**
1. Verify `CORS_ORIGIN` in `.env` matches your frontend URL
2. For development: `http://localhost:3000`
3. For production: Your actual domain

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

---

## 🌐 Frontend Integration

Update your frontend `.env` file (in root directory):

```env
# Create /.env file in root
VITE_API_URL=http://localhost:5000/api
```

The frontend API service (`/services/api.ts`) is already configured to use this.

---

## 🚀 Deployment

### Deploy to Heroku

1. **Install Heroku CLI**
2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   cd server
   heroku create your-app-name
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. Go to [Railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy!

### Deploy to Render

1. Go to [Render.com](https://render.com/)
2. Click "New" → "Web Service"
3. Connect your repository
4. Set build command: `cd server && npm install`
5. Set start command: `node server/server.js`
6. Add environment variables
7. Deploy!

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Minimum 64 characters
3. **Use HTTPS in production**
4. **Rotate secrets regularly**
5. **Limit MongoDB IP whitelist** in production
6. **Use environment-specific databases**
7. **Enable rate limiting** for production
8. **Validate all inputs**
9. **Keep dependencies updated**: `npm audit fix`

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [JWT Best Practices](https://jwt.io/introduction)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the server logs in terminal
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that dependencies are installed: `npm install`
5. Review the API endpoints in this guide
6. Check the troubleshooting section above

---

**Last Updated:** October 25, 2025
