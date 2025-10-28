# 🧪 Complete Testing Guide

## Testing Your MERN Stack Expense Tracker

This guide covers testing both backend API and frontend functionality.

---

## 🔧 Prerequisites

- Backend server running on `http://localhost:5000`
- Frontend app running on `http://localhost:3000`
- REST client installed (Postman, Insomnia, or curl)

---

## 🚀 Backend API Testing

### 1. Health Check

**Test server is running:**

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

---

### 2. Authentication Tests

#### A. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyIncome": 0,
    "currency": "USD",
    "createdAt": "2025-10-25T12:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token** - you'll need it for authenticated requests!

#### B. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### C. Get Current User (Protected)

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### D. Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "monthlyIncome": 50000,
    "currency": "USD"
  }'
```

---

### 3. Expense Tests

#### A. Create Expense

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "description": "Grocery Shopping",
    "amount": 150.50,
    "category": "Food",
    "date": "2025-10-25",
    "paymentMethod": "Card",
    "notes": "Weekly groceries"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "description": "Grocery Shopping",
    "amount": 150.50,
    "category": "Food",
    "date": "2025-10-25T00:00:00.000Z",
    "paymentMethod": "Card",
    "notes": "Weekly groceries",
    "createdAt": "2025-10-25T12:00:00.000Z"
  }
}
```

#### B. Get All Expenses

```bash
curl http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### C. Get Expenses by Date Range

```bash
curl "http://localhost:5000/api/expenses/range?startDate=2025-10-01&endDate=2025-10-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### D. Update Expense

```bash
curl -X PUT http://localhost:5000/api/expenses/EXPENSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 175.00,
    "notes": "Updated amount"
  }'
```

#### E. Delete Expense

```bash
curl -X DELETE http://localhost:5000/api/expenses/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Savings Goals Tests

#### A. Create Savings Goal

```bash
curl -X POST http://localhost:5000/api/savings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Emergency Fund",
    "targetAmount": 10000,
    "currentAmount": 2500,
    "deadline": "2025-12-31",
    "description": "6 months of expenses"
  }'
```

#### B. Get All Goals

```bash
curl http://localhost:5000/api/savings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### C. Update Goal

```bash
curl -X PUT http://localhost:5000/api/savings/GOAL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentAmount": 3500
  }'
```

#### D. Delete Goal

```bash
curl -X DELETE http://localhost:5000/api/savings/GOAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 5. Custom Categories Tests

#### A. Create Category

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Freelance Work",
    "icon": "💼",
    "color": "#10B981"
  }'
```

#### B. Get All Categories

```bash
curl http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### C. Delete Category

```bash
curl -X DELETE http://localhost:5000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 6. Recurring Expenses Tests

#### A. Create Recurring Expense

```bash
curl -X POST http://localhost:5000/api/recurring \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Netflix Subscription",
    "amount": 15.99,
    "category": "Entertainment",
    "frequency": "monthly",
    "startDate": "2025-10-01",
    "dayOfMonth": 1,
    "notes": "Premium plan"
  }'
```

#### B. Get All Recurring Expenses

```bash
curl http://localhost:5000/api/recurring \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### C. Update Recurring Expense

```bash
curl -X PUT http://localhost:5000/api/recurring/RECURRING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 17.99,
    "isActive": true
  }'
```

#### D. Delete Recurring Expense

```bash
curl -X DELETE http://localhost:5000/api/recurring/RECURRING_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7. EMI Tests

#### A. Create EMI

```bash
curl -X POST http://localhost:5000/api/emi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Car Loan",
    "totalAmount": 25000,
    "monthlyEMI": 500,
    "remainingAmount": 20000,
    "interestRate": 7.5,
    "startDate": "2024-01-01",
    "endDate": "2028-12-31",
    "dueDate": 5,
    "notes": "Honda Civic 2024"
  }'
```

#### B. Get All EMIs

```bash
curl http://localhost:5000/api/emi \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### C. Update EMI

```bash
curl -X PUT http://localhost:5000/api/emi/EMI_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "remainingAmount": 19500
  }'
```

#### D. Delete EMI

```bash
curl -X DELETE http://localhost:5000/api/emi/EMI_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 Frontend Testing Checklist

### 1. Authentication Flow

- [ ] **Register:**
  - Can create new account
  - Password validation works
  - Shows error for existing email
  - Success message appears

- [ ] **Login:**
  - Can login with correct credentials
  - Shows error for wrong password
  - Shows error for non-existent email
  - Token is saved correctly

### 2. Onboarding Flow

- [ ] Shows onboarding screen for new users
- [ ] Can set monthly income
- [ ] Can select currency
- [ ] Shows first expense welcome screen
- [ ] Can skip first expense
- [ ] Can add first expense

### 3. Dashboard

- [ ] **Overview Cards:**
  - Income display is correct
  - Total expenses calculated correctly
  - Remaining balance accurate
  - Savings rate calculated

- [ ] **Quick Actions:**
  - Add expense button works
  - Quick expense dialog opens
  - Can add expense from dialog

- [ ] **Charts:**
  - Spending chart displays
  - Category breakdown shows
  - Data updates after adding expense

### 4. Expenses Management

- [ ] **Add Expense:**
  - Form validation works
  - Can select category
  - Can select date
  - Can add notes
  - Success toast appears
  - Expense appears in list

- [ ] **View Expenses:**
  - All expenses display
  - Sorted by date (newest first)
  - Shows correct amounts
  - Category colors work

- [ ] **Edit Expense:**
  - Can update amount
  - Can change category
  - Changes save correctly

- [ ] **Delete Expense:**
  - Delete confirmation works
  - Expense removed from list
  - Total recalculated

- [ ] **Search/Filter:**
  - Can search by description
  - Can filter by category
  - Can filter by date range

### 5. Custom Categories

- [ ] Can create new category
- [ ] Custom categories appear in dropdown
- [ ] Can select icon and color
- [ ] Can delete category
- [ ] Validation prevents duplicates

### 6. Recurring Expenses

- [ ] Can add recurring expense
- [ ] Shows in recurring list
- [ ] Can set frequency (daily/weekly/monthly/yearly)
- [ ] Can set day of month
- [ ] Can toggle active/inactive
- [ ] Can edit recurring expense
- [ ] Can delete recurring expense

### 7. EMI Tracker

- [ ] Can add EMI
- [ ] Shows total and remaining amount
- [ ] Shows monthly payment
- [ ] Shows due date
- [ ] Shows interest rate
- [ ] Progress bar displays correctly
- [ ] Can mark payment as paid
- [ ] Can edit EMI details
- [ ] Can delete EMI

### 8. Savings Goals

- [ ] Can create goal
- [ ] Shows target amount
- [ ] Shows current amount
- [ ] Progress bar accurate
- [ ] Can update current amount
- [ ] Shows deadline
- [ ] Can mark as complete
- [ ] Can delete goal

### 9. Analytics

- [ ] Spending chart displays
- [ ] Category breakdown accurate
- [ ] Top expenses shown
- [ ] Monthly comparison works
- [ ] Export works

### 10. Settings

- [ ] Can update monthly income
- [ ] Can change currency
- [ ] Currency changes reflect everywhere
- [ ] Can update profile
- [ ] Can change password
- [ ] Can logout

### 11. Data Management

- [ ] **Export:**
  - CSV export works
  - JSON export works
  - Contains all data

- [ ] **Import:**
  - Can import CSV
  - Can import JSON
  - Data validates correctly
  - Duplicates handled

- [ ] **Clear Data:**
  - Confirmation dialog shows
  - All data cleared
  - App resets properly

### 12. Responsive Design

- [ ] Works on desktop (1920px+)
- [ ] Works on laptop (1280px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)
- [ ] Navigation adapts
- [ ] Charts responsive
- [ ] Forms usable on mobile

### 13. Performance

- [ ] App loads quickly
- [ ] No lag when adding expenses
- [ ] Charts render smoothly
- [ ] Smooth scrolling
- [ ] No console errors

---

## 🐛 Common Issues & Solutions

### Backend Issues

**Issue:** `MongooseError: buffering timed out`
- **Fix:** Check MongoDB is running, verify connection string

**Issue:** `401 Unauthorized`
- **Fix:** Check token is being sent, verify token hasn't expired

**Issue:** `CORS error`
- **Fix:** Verify CORS_ORIGIN in .env matches frontend URL

### Frontend Issues

**Issue:** Expenses not showing
- **Fix:** Check API connection, verify token in localStorage

**Issue:** Charts not rendering
- **Fix:** Check if data format is correct, verify recharts dependency

**Issue:** Login redirects to onboarding always
- **Fix:** Clear localStorage and re-login

---

## 📊 Test Coverage Goals

- ✅ All API endpoints functional
- ✅ Authentication and authorization working
- ✅ CRUD operations for all features
- ✅ Data validation working
- ✅ Error handling present
- ✅ UI responsive on all devices
- ✅ State management correct
- ✅ Data persistence working

---

## 🔄 Automated Testing (Future)

### Backend (Jest + Supertest):

```javascript
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

### Frontend (Vitest + Testing Library):

```javascript
describe('Login Component', () => {
  it('should login user successfully', async () => {
    render(<AuthScreen />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });
  });
});
```

---

**Happy Testing! 🧪**

**Last Updated:** October 25, 2025
