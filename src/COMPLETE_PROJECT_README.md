# 💰 Expense Tracker - Complete MERN Stack Application

## 📱 Modern Personal Finance Management

A comprehensive, user-friendly expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time expense tracking, savings goals, EMI management, and advanced analytics.

---

## ✨ Features

### 💳 Core Features
- **Expense Tracking** - Add, edit, delete, and categorize expenses
- **Income Management** - Track monthly income and remaining balance
- **Multi-Currency Support** - Support for USD, EUR, GBP, INR, and more
- **Custom Categories** - Create personalized expense categories
- **Smart Analytics** - Visual charts and spending insights

### 🎯 Advanced Features
- **Recurring Expenses** - Auto-track subscriptions and regular payments
- **EMI Tracker** - Monitor loans with payment schedules
- **Savings Goals** - Set and track financial goals
- **Financial Health Dashboard** - Comprehensive spending analysis
- **Data Export/Import** - CSV and JSON data portability
- **Search & Filter** - Advanced expense search and filtering

### 🔐 Security
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - bcrypt hashing
- **Protected Routes** - Middleware-based access control
- **CORS Protection** - Restricted API access

### 📱 User Experience
- **Responsive Design** - Works on all devices
- **Guided Onboarding** - Step-by-step setup for new users
- **Quick Actions** - Fast expense entry
- **Real-time Updates** - Instant data synchronization
- **Dark Mode Ready** - Modern UI design

---

## 🏗️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Development Tools
- **Vite** - Build tool
- **ESLint** - Code linting
- **nodemon** - Auto-restart server

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### Quick Start

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd expense-tracker
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd server
npm install
```

#### 4. Configure Environment Variables

**Backend** - Edit `/server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
DB_NAME=expense_tracker
JWT_SECRET=<generate_using_crypto>
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

---

## 📁 Project Structure

```
expense-tracker/
├── components/               # React components
│   ├── ui/                  # Shadcn UI components
│   ├── AuthScreen.tsx       # Login/Register
│   ├── EnhancedMainDashboard.tsx
│   ├── ExpenseForm.tsx
│   ├── SavingsGoals.tsx
│   ├── EMITracker.tsx
│   └── ...
├── services/                # API integration
│   └── api.ts              # API service layer
├── utils/                   # Utility functions
│   ├── constants.ts
│   ├── calculations.ts
│   └── ...
├── styles/                  # Global styles
│   └── globals.css
├── server/                  # Backend
│   ├── config/             # Configuration
│   │   └── database.js
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   └── ...
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── ...
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   └── ...
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json
├── App.tsx                # Main React component
└── package.json          # Frontend dependencies
```

---

## 🔌 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Expenses

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Grocery Shopping",
  "amount": 150.50,
  "category": "Food",
  "date": "2025-10-25",
  "paymentMethod": "Card"
}
```

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer <token>
```

#### Get Expenses by Date Range
```http
GET /api/expenses/range?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer <token>
```

### Full API Documentation
See `/COMPLETE_TESTING_GUIDE.md` for all endpoints.

---

## 🚀 Deployment

### Backend (Render - Free)

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables
6. Deploy!

### Frontend (Vercel - Free)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variable: `VITE_API_URL=<backend-url>/api`
7. Deploy!

### Detailed Guide
See `/DEPLOYMENT_GUIDE.md` for complete deployment instructions.

---

## 🧪 Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

### Frontend Testing Checklist
- ✅ User registration and login
- ✅ Add/edit/delete expenses
- ✅ View analytics and charts
- ✅ Create savings goals
- ✅ Track recurring expenses
- ✅ Manage EMIs
- ✅ Export/import data

See `/COMPLETE_TESTING_GUIDE.md` for comprehensive testing.

---

## 📖 Documentation

- **[QUICK_START.md](./server/QUICK_START.md)** - Get running in 5 minutes
- **[SETUP_INSTRUCTIONS.md](./server/SETUP_INSTRUCTIONS.md)** - Detailed setup
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[COMPLETE_TESTING_GUIDE.md](./COMPLETE_TESTING_GUIDE.md)** - API & testing
- **[FINAL_SETUP_SUMMARY.md](./FINAL_SETUP_SUMMARY.md)** - Complete overview
- **[ENV_SETUP_GUIDE.md](./server/ENV_SETUP_GUIDE.md)** - Environment config

---

## 🎯 User Flow

```
1. Register/Login
   ↓
2. Set Monthly Income
   ↓
3. Add First Expense (or skip)
   ↓
4. Main Dashboard
   ├── View Overview
   ├── Add Expenses
   ├── Track Savings
   ├── Manage EMIs
   └── View Analytics
```

---

## 🛠️ Development

### Backend Development
```bash
cd server
npm run dev  # Auto-restart on changes
```

### Frontend Development
```bash
npm run dev  # Hot reload enabled
```

### Database

**Local MongoDB:**
```bash
mongod  # Start MongoDB
mongo   # MongoDB shell
```

**MongoDB Atlas:**
- Free M0 cluster available
- No credit card required
- 512 MB storage

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
DB_NAME=expense_tracker
JWT_SECRET=<secure_random_string>
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (optional)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Issue:** Can't connect to database

**Solutions:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Whitelist IP (0.0.0.0/0)

### CORS Error
**Issue:** Frontend can't access backend

**Solution:**
- Verify `CORS_ORIGIN` matches frontend URL
- Restart backend after changing `.env`

### Port Already in Use
**Issue:** Port 5000 is busy

**Solution:**
```bash
lsof -i :5000
kill -9 <PID>
```

Or change port in `.env`: `PORT=5001`

---

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  monthlyIncome: Number,
  currency: String,
  createdAt: Date
}
```

### Expense
```javascript
{
  user: ObjectId,
  description: String,
  amount: Number,
  category: String,
  date: Date,
  paymentMethod: String,
  notes: String
}
```

### Savings Goal
```javascript
{
  user: ObjectId,
  name: String,
  targetAmount: Number,
  currentAmount: Number,
  deadline: Date,
  isCompleted: Boolean
}
```

See models in `/server/models/` for complete schemas.

---

## 🎨 Features Walkthrough

### Dashboard
- Income overview
- Total expenses
- Remaining balance
- Savings rate
- Quick expense entry
- Recent transactions
- Category breakdown

### Expense Management
- Add with category selection
- Edit existing expenses
- Delete with confirmation
- Search and filter
- Date range selection
- Export to CSV/JSON

### Analytics
- Spending trends chart
- Category-wise breakdown
- Monthly comparison
- Top expenses
- Financial health score

### Savings Goals
- Create multiple goals
- Track progress
- Set deadlines
- Visual progress bars
- Completion status

### EMI Tracker
- Add loans/EMIs
- Track payments
- View remaining amount
- Interest calculation
- Payment schedule

---

## 🚧 Roadmap

### Planned Features
- [ ] Automated recurring expense creation
- [ ] Budget alerts and notifications
- [ ] Receipt image upload
- [ ] Multi-user household tracking
- [ ] Mobile app (React Native)
- [ ] Bank integration
- [ ] Bill reminders
- [ ] Tax calculation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Your Name / Team Name

---

## 🙏 Acknowledgments

- Shadcn/ui for amazing UI components
- MongoDB for reliable database
- Express.js for robust backend framework
- React team for the awesome frontend library
- All open-source contributors

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation files
- Review troubleshooting section

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using MERN Stack**

**Last Updated:** October 25, 2025
