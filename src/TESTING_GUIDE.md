# 🧪 Testing Guide - Complete User Flow

## How to Start Fresh from Login Screen

There are **3 easy ways** to reset and test the complete onboarding flow:

### Method 1: Use the Reset Button (Recommended)
1. Navigate to **More** tab (bottom nav on mobile, top nav on desktop)
2. Click on **Profile**
3. Scroll down to **Account Actions**
4. Click the **Complete Reset** button (orange warning box)
5. Confirm the reset
6. ✅ You'll be taken back to the Login/Signup screen

### Method 2: Browser Console
1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Type: `resetApp()`
4. Press Enter
5. ✅ The page will reload and show the Login screen

### Method 3: Manual LocalStorage Clear
1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** in the left sidebar
4. Right-click your domain and select **Clear**
5. Refresh the page
6. ✅ You'll see the Login/Signup screen

---

## 📝 Complete User Flow to Test

### Step 1: Authentication (Login/Signup Screen)
- **Quick Demo**: Click "Try Demo Account" button
- **Sign Up**: Create a new account with name, email, and password
- **Login**: Use existing credentials

### Step 2: Onboarding (Income Setup)
After authentication, you'll see the **Quick Onboarding** screen:
1. Select your **Currency** (USD, EUR, GBP, etc.)
2. Enter your **Monthly Income**
3. Click **Start Tracking**

### Step 3: First Expense Welcome ✨ **NEW!**
After onboarding, you'll see the **First Expense Welcome** screen:
1. Choose a **Quick Template** (Lunch, Coffee, Uber, Groceries) OR
2. Manually enter:
   - Description (What did you buy?)
   - Amount (How much?)
   - Category (from dropdown)
3. Click **Add First Expense** or **Skip for Now**

### Step 4: Main Application
You're now in the app! Explore these screens:

#### 🏠 Dashboard Tab
- Financial health score
- Income vs expenses overview
- Quick statistics
- Financial health insights

#### 💰 Expenses Tab
- Add new expenses
- View all transactions
- Search and filter expenses
- Edit or delete expenses

#### 📊 Analytics Tab
- Spending by category (pie chart)
- Monthly trends (line chart)
- Category breakdown
- Spending insights

#### ⚙️ More Tab
Access to:
- 👤 **Profile** - Update personal info, change password
- 🎯 **Savings Goals** - Set and track savings targets
- 💳 **EMI Tracker** - Track loan/EMI payments
- 🔍 **Financial Health** - Detailed health analysis
- ⚙️ **Settings** - Currency & income settings
- 💾 **Data Management** - Export/Import data
- 📖 **Help & Guide** - FAQs and tips

---

## 🎨 Design Consistency Checklist

When testing, verify these design elements are consistent:

✅ **Gradient Backgrounds**: Blue to indigo gradient on all screens  
✅ **Card Shadows**: All cards have `shadow-xl` for depth  
✅ **Color-Coded Banners**: Info banners match each section (blue, green, purple, etc.)  
✅ **Navigation**: 
- Mobile: Bottom nav bar with elevated center button
- Desktop: Top header with horizontal nav buttons  
✅ **Back Buttons**: Appear automatically in sub-views  
✅ **Responsive**: Works on mobile, tablet, and desktop

---

## 🐛 Common Testing Scenarios

### Test New User Experience
1. Reset app → Sign up → Set income → Add expenses → View analytics

### Test Returning User
1. Login → View dashboard → Check existing data

### Test Data Persistence
1. Add some expenses
2. Refresh the page
3. Verify data is still there

### Test Mobile Navigation
1. Resize browser to mobile width (< 768px)
2. Verify bottom nav appears
3. Test tab switching
4. Test quick add button (center button)

### Test Desktop Navigation
1. Resize browser to desktop width (> 768px)
2. Verify top nav appears
3. Verify mobile nav is hidden

---

## 💡 Quick Tips

- **Demo Account**: Use the "Try Demo Account" button for instant access
- **Sample Data**: Add a few expenses to see charts and analytics
- **Console Helper**: The `resetApp()` function is always available in console
- **LocalStorage**: All data is stored locally - nothing is sent to a server
- **Export Data**: Before resetting, you can export your data from Data Management

---

## 🎯 Test Coverage Checklist

Use this checklist to ensure you've tested all features:

### Authentication
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Try demo account
- [ ] Logout
- [ ] Complete reset

### Onboarding
- [ ] Set currency
- [ ] Set monthly income
- [ ] Skip validation (empty fields)

### First Expense Welcome (NEW!)
- [ ] Use quick template to auto-fill
- [ ] Manually enter first expense
- [ ] Skip first expense
- [ ] Validate required fields
- [ ] Verify expense is saved

### Expenses
- [ ] Add new expense
- [ ] Edit expense
- [ ] Delete expense
- [ ] Search expenses
- [ ] Filter by category
- [ ] Quick add dialog

### Dashboard
- [ ] View financial health score
- [ ] Check spending vs income
- [ ] View health insights
- [ ] Navigate to health details

### Analytics
- [ ] View category pie chart
- [ ] View monthly trend
- [ ] Check category breakdown
- [ ] View spending insights

### Savings Goals
- [ ] Add new goal
- [ ] Update progress
- [ ] Delete goal

### EMI Tracker
- [ ] Add new EMI
- [ ] View active EMIs
- [ ] Delete EMI

### Settings
- [ ] Change currency
- [ ] Update monthly income
- [ ] Update profile
- [ ] Change password

### Data Management
- [ ] Export to JSON
- [ ] Export to CSV
- [ ] Import data
- [ ] Clear all data

---

**Happy Testing! 🎉**
