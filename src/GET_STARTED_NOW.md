# 🚀 Get Started NOW - Quick Reference

## Your MERN Stack Expense Tracker is Ready!

### ⚡ 3-Step Quick Start

```bash
# STEP 1: Setup Backend (2 minutes)
cd server
npm install
# Edit .env file - update JWT_SECRET (see below)
npm run dev

# STEP 2: Setup Frontend (1 minute)  
# Open NEW terminal
cd ..
npm install
npm run dev

# STEP 3: Open Browser
# Visit: http://localhost:3000
```

---

## 🔑 IMPORTANT: Update JWT Secret

Before starting, generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it in `/server/.env`:

```env
JWT_SECRET=<paste_your_generated_secret_here>
```

---

## 📋 Quick Checklist

### Before Starting

- [ ] Node.js installed? Check: `node --version`
- [ ] MongoDB running? 
  - **Local:** Run `mongod`
  - **Atlas:** Have connection string ready

### Start Development

**Terminal 1 - Backend:**
```bash
cd server
npm install          # First time only
npm run dev         # Start server
```

**Terminal 2 - Frontend:**
```bash
npm install          # First time only
npm run dev         # Start app
```

### Verify It Works

1. Backend: http://localhost:5000/health
   - Should show: `"success": true`

2. Frontend: http://localhost:3000
   - Should show login screen

---

## 🎯 First Time Using the App

1. **Register** new account
2. **Set** monthly income
3. **Add** your first expense
4. **Explore** the dashboard!

---

## 📁 Key Files You Might Edit

### Backend Configuration
```
/server/.env          ← Update this first!
/server/server.js     ← Main server file
```

### Frontend
```
/App.tsx              ← Main app logic
/components/          ← UI components
/services/api.ts      ← API calls
```

---

## 🗄️ MongoDB Setup Options

### Option A: Local MongoDB (Easiest)
```bash
# Install MongoDB, then:
mongod

# .env already configured for local:
MONGODB_URI=mongodb://localhost:27017
```

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to mongodb.com/cloud/atlas
2. Create FREE cluster (no credit card)
3. Get connection string
4. Update in `/server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

---

## 🔧 Common Commands

### Backend
```bash
cd server
npm run dev          # Start with auto-reload
npm start           # Start production
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
```

### Database
```bash
mongod              # Start local MongoDB
mongo               # MongoDB shell
```

---

## 🐛 Quick Fixes

### "Port 5000 already in use"
```bash
# Option 1: Kill process
lsof -i :5000
kill -9 <PID>

# Option 2: Change port in /server/.env
PORT=5001
```

### "MongoDB connection failed"
```bash
# Local: Start MongoDB
mongod

# Atlas: Check connection string and IP whitelist
```

### "Module not found"
```bash
# Backend
cd server
rm -rf node_modules
npm install

# Frontend
rm -rf node_modules
npm install
```

---

## 📊 What You Get

✅ Full expense tracking
✅ Income management  
✅ Custom categories
✅ Savings goals
✅ EMI tracker
✅ Recurring expenses
✅ Analytics & charts
✅ Data export/import
✅ Multi-currency support
✅ Secure authentication
✅ Responsive design

---

## 📚 Full Documentation

- **Quick Start:** `/server/QUICK_START.md`
- **Setup Guide:** `/server/SETUP_INSTRUCTIONS.md`
- **API Testing:** `/COMPLETE_TESTING_GUIDE.md`
- **Deployment:** `/DEPLOYMENT_GUIDE.md`
- **Verification:** `/VERIFICATION_CHECKLIST.md`
- **Complete README:** `/COMPLETE_PROJECT_README.md`

---

## 🎨 Development Workflow

```
1. Start backend   → npm run dev (in /server)
2. Start frontend  → npm run dev (in root)
3. Code changes    → Auto-reload ⚡
4. Test features   → http://localhost:3000
5. Check API       → http://localhost:5000/health
```

---

## 🚀 Ready to Deploy?

### Free Hosting Options:

**Backend:**
- Render.com (Recommended)
- Railway.app
- Heroku

**Frontend:**
- Vercel.com (Recommended)
- Netlify.com
- Render.com

**Database:**
- MongoDB Atlas M0 (Free tier)

See `/DEPLOYMENT_GUIDE.md` for step-by-step instructions!

---

## 🎯 API Endpoints Quick Reference

```
POST   /api/auth/register      Register
POST   /api/auth/login         Login
GET    /api/auth/me            Get user (protected)
GET    /api/expenses           Get expenses (protected)
POST   /api/expenses           Create expense (protected)
DELETE /api/expenses/:id       Delete expense (protected)
GET    /api/savings            Get goals (protected)
POST   /api/savings            Create goal (protected)
```

See `/COMPLETE_TESTING_GUIDE.md` for all endpoints.

---

## ✅ Success Indicators

### Backend Running:
```
✅ MongoDB Connected: localhost
📊 Database: expense_tracker
🚀 Server running in development mode on port 5000
```

### Frontend Running:
```
VITE ready in xxx ms
➜  Local:   http://localhost:3000/
```

### App Working:
- ✅ Can register/login
- ✅ Can add expenses
- ✅ Dashboard shows data
- ✅ No console errors

---

## 🆘 Need Help?

1. **Check logs** in terminal
2. **Review** `/VERIFICATION_CHECKLIST.md`
3. **Read** specific guide for your issue:
   - Setup issues → `/server/SETUP_INSTRUCTIONS.md`
   - API issues → `/COMPLETE_TESTING_GUIDE.md`
   - Deploy issues → `/DEPLOYMENT_GUIDE.md`

---

## 💡 Pro Tips

1. **Use MongoDB Atlas** for hassle-free database
2. **Keep terminals open** to see real-time logs
3. **Use Postman** for easy API testing
4. **Test features** as you build
5. **Commit often** with Git
6. **Check console** for errors

---

## 🎊 You're Ready!

Everything is set up and ready to go. Just run the commands above and start building your financial tracking application!

### Start Now:

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2 (new terminal)
npm install && npm run dev

# Browser
# Open http://localhost:3000
```

---

**Happy Coding! 🚀**

**Last Updated:** October 25, 2025
