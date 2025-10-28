# Expense Tracker Backend API

Complete MERN stack backend with JWT authentication for the Expense Tracker application.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `/server` directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/expense_tracker

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# JWT Token Expiration
JWT_EXPIRE=7d

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000

# Database Name
DB_NAME=expense_tracker
```

### 3. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" > "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Paste in your `.env` file as `MONGODB_URI`

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/expense_tracker`

## 🏃‍♂️ Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Expenses

- `GET /api/expenses` - Get all expenses (Protected)
- `POST /api/expenses` - Create expense (Protected)
- `PUT /api/expenses/:id` - Update expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)
- `GET /api/expenses/range?startDate=&endDate=` - Get expenses by date range (Protected)

### Savings Goals

- `GET /api/savings` - Get all savings goals (Protected)
- `POST /api/savings` - Create savings goal (Protected)
- `PUT /api/savings/:id` - Update savings goal (Protected)
- `DELETE /api/savings/:id` - Delete savings goal (Protected)

### Custom Categories

- `GET /api/categories` - Get all categories (Protected)
- `POST /api/categories` - Create category (Protected)
- `DELETE /api/categories/:id` - Delete category (Protected)

### Recurring Expenses

- `GET /api/recurring` - Get all recurring expenses (Protected)
- `POST /api/recurring` - Create recurring expense (Protected)
- `PUT /api/recurring/:id` - Update recurring expense (Protected)
- `DELETE /api/recurring/:id` - Delete recurring expense (Protected)

### EMI

- `GET /api/emi` - Get all EMIs (Protected)
- `POST /api/emi` - Create EMI (Protected)
- `PUT /api/emi/:id` - Update EMI (Protected)
- `DELETE /api/emi/:id` - Delete EMI (Protected)

### Health Check

- `GET /health` - Server health check

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is automatically sent from the frontend after login/registration.

## 📝 Example Requests

### Register User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Expense

```bash
POST http://localhost:5000/api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50,
  "category": "Food",
  "description": "Lunch",
  "date": "2025-10-25",
  "paymentMethod": "card"
}
```

## 🗂️ Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── expenseController.js # Expense logic
│   ├── savingsController.js # Savings goals logic
│   ├── categoryController.js# Categories logic
│   ├── recurringController.js# Recurring expenses logic
│   └── emiController.js     # EMI logic
├── models/
│   ├── User.js              # User model
│   ├── Expense.js           # Expense model
│   ├── SavingsGoal.js       # Savings goal model
│   ├── CustomCategory.js    # Category model
│   ├── RecurringExpense.js  # Recurring expense model
│   └── EMI.js               # EMI model
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── expenseRoutes.js     # Expense routes
│   ├── savingsRoutes.js     # Savings routes
│   ├── categoryRoutes.js    # Category routes
│   ├── recurringRoutes.js   # Recurring routes
│   └── emiRoutes.js         # EMI routes
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes
- CORS configuration
- Input validation
- User-specific data isolation

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check your `MONGODB_URI` is correct
- Ensure MongoDB service is running (local)
- Check network access in MongoDB Atlas
- Verify database user credentials

### Port Already in Use

- Change `PORT` in `.env` file
- Or stop the process using port 5000

### JWT Token Errors

- Ensure `JWT_SECRET` is set in `.env`
- Check token is being sent in headers
- Verify token hasn't expired

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Support

For issues or questions, please check the main project README or create an issue.
