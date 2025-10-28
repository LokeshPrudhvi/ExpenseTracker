# 🔄 How to Start Fresh from Login Screen

## Quick Reset Methods

### ⚡ Fastest: Browser Console
1. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Click **Console** tab
3. Type: `resetApp()`
4. Press Enter
5. ✅ **Done!** Page will reload at the login screen

### 🖱️ UI Method: Profile Reset Button  
1. Navigate to **More** → **Profile**
2. Scroll to **Account Actions**
3. Click **Complete Reset** (orange button)
4. Confirm the prompt
5. ✅ **Done!** You're back at the login screen

### 🔧 Manual: Clear Browser Storage
1. Press `F12` to open DevTools
2. Go to **Application** tab
3. Click **Local Storage** → your domain
4. Right-click → **Clear**
5. Refresh page
6. ✅ **Done!** Login screen appears

---

## What Gets Reset?

When you reset, ALL of the following data is cleared:
- ✖️ User authentication (logged out)
- ✖️ User profile (name, email, password)
- ✖️ Monthly income setting
- ✖️ All expenses and transactions
- ✖️ Savings goals
- ✖️ EMI/Loan trackers
- ✖️ Currency preference
- ✖️ Onboarding completion status

**Result**: Fresh start like a brand new user! 🎉

---

## User Flow After Reset

### 1️⃣ Authentication Screen
**You'll see:**
- Beautiful gradient background (blue to indigo)
- Login and Sign Up tabs
- "Try Demo Account" button for instant access

**Options:**
- **Sign Up**: Create new account (name, email, password)
- **Login**: Use existing credentials  
- **Demo**: Click "Try Demo Account" for instant preview

### 2️⃣ Onboarding Screen
**After login/signup:**
- Welcome message with your name
- Currency selector
- Monthly income input
- Helpful financial tips

**Action Required:**
- Select currency (USD, EUR, GBP, etc.)
- Enter your monthly income
- Click "Start Tracking"

### 3️⃣ First Expense Welcome Screen ✨ **NEW!**
**After setting income:**
- Personalized welcome message
- Quick expense templates (Lunch, Coffee, Uber, Groceries)
- Simple form to add your first expense
- Option to skip

**Action:**
- Click a quick template OR manually enter:
  - What you bought
  - Amount spent
  - Category
- Click "Add First Expense" or "Skip for Now"

### 4️⃣ Main Dashboard
**You're in!** 
Now you can:
- Add expenses
- View analytics
- Set savings goals
- Track EMIs
- Manage your profile
- Export/import data

---

## Testing Tips

### Quick Test Path
```
Reset → Sign Up → Set Income → Add First Expense → View Dashboard
```

**Complete New User Journey:**
1. **AuthScreen**: Sign up with name, email, password
2. **QuickOnboarding**: Select currency + enter monthly income
3. **FirstExpenseWelcome**: Add your first expense (or skip)
4. **MainDashboard**: Full app with all features

### Demo Account
- Email: `demo@expensetracker.com`
- Password: `demo123`
- Or just click "Try Demo Account" button

### Sample Data
To see charts and analytics properly:
1. Add at least 3-5 expenses
2. Use different categories
3. Use different dates
4. View Analytics tab to see visualizations

---

## Need Help?

- 📖 Full guide: See `TESTING_GUIDE.md`
- 🐛 Issues: Check browser console for errors
- 💾 Data: All data is stored in browser's localStorage
- 🔒 Privacy: Nothing is sent to any server

---

**Pro Tip**: Bookmark this page or keep the console command handy:
```javascript
resetApp()
```

Happy testing! 🚀
