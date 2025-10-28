# API Documentation

This document describes the internal APIs, utilities, and interfaces used in the Expense Tracker application.

## 📋 Table of Contents
- [Type Definitions](#type-definitions)
- [Utility Functions](#utility-functions)
- [Components API](#components-api)
- [Constants](#constants)
- [LocalStorage Schema](#localstorage-schema)

---

## 🏗️ Type Definitions

### Expense
```typescript
interface Expense {
  id: string;              // Unique identifier (timestamp-based)
  amount: number;          // Expense amount
  category: string;        // Category slug (e.g., 'food', 'transport')
  description: string;     // User description of expense
  date: string;           // ISO date string (YYYY-MM-DD)
  isEMI?: boolean;        // Optional: Is this an EMI payment?
  emiEndDate?: string;    // Optional: EMI end date
  emiStartDate?: string;  // Optional: EMI start date
}
```

### UserProfile
```typescript
interface UserProfile {
  email: string;          // User email address
  name: string;           // Full name
  password: string;       // Password (stored in localStorage)
  createdAt: string;      // ISO date string of account creation
}
```

### SavingsGoal
```typescript
interface SavingsGoal {
  id: string;             // Unique identifier
  name: string;           // Goal name (e.g., "Vacation Fund")
  targetAmount: number;   // Target amount to save
  currentAmount: number;  // Current saved amount
  deadline?: string;      // Optional: Target date (ISO string)
}
```

### Category
```typescript
interface Category {
  value: string;          // Category slug (e.g., 'food')
  label: string;          // Display name (e.g., 'Food & Dining')
  icon: string;           // Emoji icon
  color: string;          // Tailwind color class (e.g., 'text-orange-500')
}
```

### Currency
```typescript
interface Currency {
  code: string;           // ISO currency code (e.g., 'USD')
  name: string;           // Currency name (e.g., 'US Dollar')
  symbol: string;         // Currency symbol (e.g., '$')
}
```

---

## 🛠️ Utility Functions

### Currency Utilities (`/utils/currency.ts`)

#### `getCurrencySymbol(currencyCode: string): string`
Returns the currency symbol for a given currency code.

```typescript
getCurrencySymbol('USD')  // Returns: '$'
getCurrencySymbol('EUR')  // Returns: '€'
getCurrencySymbol('GBP')  // Returns: '£'
```

#### `formatCurrency(amount: number, currencyCode: string): string`
Formats an amount with proper currency formatting using Intl.NumberFormat.

```typescript
formatCurrency(1234.56, 'USD')  // Returns: '$1,234.56'
formatCurrency(1234, 'JPY')     // Returns: '¥1,234' (no decimals)
formatCurrency(1234.56, 'EUR')  // Returns: '€1,234.56'
```

#### `formatAmount(amount: number, currencyCode: string): string`
Formats amount with currency symbol (compact version).

```typescript
formatAmount(1234.56, 'USD')  // Returns: '$1,234.56'
```

#### `isValidCurrency(currencyCode: string): boolean`
Checks if a currency code is supported.

```typescript
isValidCurrency('USD')  // Returns: true
isValidCurrency('XYZ')  // Returns: false
```

---

### Date Utilities (`/utils/date.ts`)

#### `formatDate(dateString: string): string`
Formats a date string for display.

```typescript
formatDate('2025-10-25')  // Returns: 'Oct 25, 2025'
```

#### `formatRelativeDate(dateString: string): string`
Returns a relative date string.

```typescript
formatRelativeDate(new Date().toISOString())         // Returns: 'Today'
formatRelativeDate(new Date(Date.now() - 86400000))  // Returns: 'Yesterday'
formatRelativeDate('2025-10-01')                     // Returns: 'Oct 1, 2025'
```

#### `getMonthYear(dateString?: string | Date): string`
Returns month and year.

```typescript
getMonthYear()                    // Returns: 'October 2025' (current)
getMonthYear('2025-12-25')        // Returns: 'December 2025'
```

#### `isCurrentMonth(dateString: string): boolean`
Checks if a date is in the current month.

```typescript
isCurrentMonth('2025-10-15')  // Returns: true (if current month is October)
```

#### `isCurrentWeek(dateString: string): boolean`
Checks if a date is within the last 7 days.

```typescript
isCurrentWeek('2025-10-24')  // Returns: true (if today is Oct 25)
```

#### `toISODateString(date: Date = new Date()): string`
Converts date to ISO string (YYYY-MM-DD).

```typescript
toISODateString(new Date('2025-10-25'))  // Returns: '2025-10-25'
```

#### `daysBetween(date1: string | Date, date2: string | Date): number`
Calculates days between two dates.

```typescript
daysBetween('2025-10-01', '2025-10-10')  // Returns: 9
```

---

### Calculation Utilities (`/utils/calculations.ts`)

#### `calculateTotal(expenses: Expense[]): number`
Calculates total of all expenses.

```typescript
calculateTotal([
  { amount: 100, ... },
  { amount: 200, ... }
])  // Returns: 300
```

#### `calculateByCategory(expenses: Expense[]): Record<string, number>`
Groups expenses by category.

```typescript
calculateByCategory(expenses)
// Returns: { food: 300, transport: 150, shopping: 200 }
```

#### `calculateSpendingRate(totalSpent: number, income: number): number`
Calculates spending as percentage of income.

```typescript
calculateSpendingRate(3000, 5000)  // Returns: 60
calculateSpendingRate(6000, 5000)  // Returns: 120 (overspending)
```

#### `calculateSavingsRate(totalSpent: number, income: number): number`
Calculates savings as percentage of income.

```typescript
calculateSavingsRate(3000, 5000)  // Returns: 40
```

#### `calculateRemaining(income: number, totalSpent: number): number`
Calculates remaining budget.

```typescript
calculateRemaining(5000, 3000)  // Returns: 2000
calculateRemaining(5000, 6000)  // Returns: -1000 (overspent)
```

#### `getTopCategories(categoryTotals: Record<string, number>, limit?: number)`
Returns top spending categories sorted by amount.

```typescript
getTopCategories({ food: 300, transport: 200, shopping: 500 }, 2)
// Returns: [
//   { category: 'shopping', amount: 500, percentage: 50 },
//   { category: 'food', amount: 300, percentage: 30 }
// ]
```

#### `calculateFinancialHealthScore(params): number`
Calculates financial health score (0-100).

```typescript
calculateFinancialHealthScore({
  totalSpent: 3000,
  income: 5000,
  savingsGoalsCount: 2
})  // Returns: 85 (Excellent)
```

#### `getHealthStatus(score: number)`
Returns health status details.

```typescript
getHealthStatus(85)
// Returns: {
//   label: 'Excellent',
//   color: 'green',
//   bgColor: 'bg-green-100 dark:bg-green-900/30',
//   textColor: 'text-green-600'
// }
```

#### `calculateNeedsVsWants(expenses: Expense[])`
Categorizes spending into needs and wants.

```typescript
calculateNeedsVsWants(expenses)
// Returns: {
//   needs: 2500,
//   wants: 1500,
//   needsPercentage: 62.5,
//   wantsPercentage: 37.5
// }
```

---

### Validation Utilities (`/utils/validation.ts`)

#### `isValidEmail(email: string): boolean`
Validates email format.

```typescript
isValidEmail('user@example.com')  // Returns: true
isValidEmail('invalid-email')     // Returns: false
```

#### `isValidPassword(password: string): { valid: boolean; message?: string }`
Validates password strength.

```typescript
isValidPassword('12345')    // Returns: { valid: false, message: '...' }
isValidPassword('password123')  // Returns: { valid: true }
```

#### `isValidAmount(amount: string | number): boolean`
Validates positive number.

```typescript
isValidAmount(100)      // Returns: true
isValidAmount(-50)      // Returns: false
isValidAmount('50.50')  // Returns: true
isValidAmount('abc')    // Returns: false
```

#### `validateExpense(expense: object): { valid: boolean; errors: string[] }`
Validates complete expense object.

```typescript
validateExpense({
  description: 'Lunch',
  amount: 15,
  category: 'food'
})  // Returns: { valid: true, errors: [] }

validateExpense({
  description: '',
  amount: -5
})  // Returns: { valid: false, errors: ['Description is required', ...] }
```

---

## 🧩 Components API

### AuthScreen
```typescript
interface AuthScreenProps {
  onAuthSuccess: (profile: UserProfile) => void;
}
```

**Usage:**
```tsx
<AuthScreen 
  onAuthSuccess={(profile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  }}
/>
```

### QuickOnboarding
```typescript
interface QuickOnboardingProps {
  onComplete: (data: { income: number; currency: string }) => void;
  userName: string;
}
```

**Usage:**
```tsx
<QuickOnboarding
  userName="John Doe"
  onComplete={(data) => {
    setIncome(data.income);
    setCurrency(data.currency);
  }}
/>
```

### FirstExpenseWelcome
```typescript
interface FirstExpenseWelcomeProps {
  userName: string;
  currency: string;
  onComplete: (expense: Omit<Expense, 'id'>) => void;
  onSkip: () => void;
}
```

**Usage:**
```tsx
<FirstExpenseWelcome
  userName="John"
  currency="USD"
  onComplete={(expense) => addExpense(expense)}
  onSkip={() => setShowWelcome(false)}
/>
```

### MainDashboard
```typescript
interface MainDashboardProps {
  expenses: Expense[];
  income: number;
  currency: string;
  onQuickAdd: () => void;
  onViewExpenses: () => void;
  onViewAnalytics: () => void;
  onViewGoals: () => void;
  onViewHealth: () => void;
}
```

### SimpleExpensesView
```typescript
interface SimpleExpensesViewProps {
  expenses: Expense[];
  currency: string;
  onDelete: (id: string) => void;
}
```

### FinancialHealthDashboard
```typescript
interface FinancialHealthDashboardProps {
  expenses: Expense[];
  income: number;
  currency: string;
  savingsGoals: SavingsGoal[];
}
```

### QuickExpenseDialog
```typescript
interface QuickExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  currency: string;
}
```

---

## 📊 Constants

### EXPENSE_CATEGORIES
```typescript
const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍔', color: 'text-orange-500' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'text-pink-500' },
  // ... more categories
];
```

### FINANCIAL_RECOMMENDATIONS
```typescript
const FINANCIAL_RECOMMENDATIONS = {
  SAVINGS_GOAL: 20,        // Aim to save 20% of income
  NEEDS_LIMIT: 50,         // Keep needs under 50%
  WANTS_LIMIT: 30,         // Keep wants under 30%
  EMERGENCY_FUND_MONTHS: 6 // 6 months of expenses
};
```

### STORAGE_KEYS
```typescript
const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  IS_LOGGED_IN: 'isLoggedIn',
  MONTHLY_EXPENSES: 'monthlyExpenses',
  MONTHLY_INCOME: 'monthlyIncome',
  SELECTED_CURRENCY: 'selectedCurrency',
  SAVINGS_GOALS: 'savingsGoals',
  ONBOARDING_COMPLETE: 'onboardingComplete',
  FIRST_EXPENSE_ADDED: 'firstExpenseAdded'
};
```

---

## 💾 LocalStorage Schema

### userProfile
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "hashedpassword",
  "createdAt": "2025-10-25T10:00:00.000Z"
}
```

### monthlyExpenses
```json
[
  {
    "id": "1729850000000",
    "description": "Lunch at cafe",
    "amount": 15.50,
    "category": "food",
    "date": "2025-10-25"
  },
  {
    "id": "1729851000000",
    "description": "Uber ride",
    "amount": 12.00,
    "category": "transport",
    "date": "2025-10-24"
  }
]
```

### savingsGoals
```json
[
  {
    "id": "goal1",
    "name": "Vacation Fund",
    "targetAmount": 5000,
    "currentAmount": 1200,
    "deadline": "2026-06-01"
  }
]
```

### Other Keys
- `isLoggedIn`: `"true"` or `"false"`
- `monthlyIncome`: `"5000"`
- `selectedCurrency`: `"USD"`
- `onboardingComplete`: `"true"`
- `firstExpenseAdded`: `"true"`

---

## 🔧 Custom Hooks (Future Enhancement)

### useLocalStorage
```typescript
function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

**Usage:**
```typescript
const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
```

---

## 🎯 Error Codes

### Validation Errors
- `EMAIL_INVALID`: Invalid email format
- `PASSWORD_TOO_SHORT`: Password less than 6 characters
- `AMOUNT_INVALID`: Amount is not a positive number
- `REQUIRED_FIELD`: Required field is empty

### Storage Errors
- `STORAGE_FULL`: LocalStorage quota exceeded
- `STORAGE_UNAVAILABLE`: LocalStorage not available
- `PARSE_ERROR`: JSON parsing failed

---

## 📚 Examples

### Complete Expense Workflow
```typescript
// 1. Create expense
const newExpense: Omit<Expense, 'id'> = {
  description: 'Groceries',
  amount: 75.50,
  category: 'shopping',
  date: toISODateString()
};

// 2. Validate
const validation = validateExpense(newExpense);
if (!validation.valid) {
  console.error(validation.errors);
  return;
}

// 3. Add ID
const expense: Expense = {
  ...newExpense,
  id: Date.now().toString()
};

// 4. Save to state
setExpenses(prev => [...prev, expense]);

// 5. Persist to storage (in useEffect)
useEffect(() => {
  localStorage.setItem('monthlyExpenses', JSON.stringify(expenses));
}, [expenses]);
```

### Financial Health Calculation
```typescript
// 1. Get current month expenses
const currentMonthExpenses = expenses.filter(isCurrentMonth);

// 2. Calculate totals
const totalSpent = calculateTotal(currentMonthExpenses);
const remaining = calculateRemaining(income, totalSpent);

// 3. Calculate rates
const spendingRate = calculateSpendingRate(totalSpent, income);
const savingsRate = calculateSavingsRate(totalSpent, income);

// 4. Calculate health score
const healthScore = calculateFinancialHealthScore({
  totalSpent,
  income,
  savingsGoalsCount: savingsGoals.length
});

// 5. Get status
const status = getHealthStatus(healthScore);
console.log(`Your financial health is ${status.label}`);
```

---

**For more information, see:**
- [README.md](./README.md) - Project overview
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guide
- [USER_GUIDE.md](./USER_GUIDE.md) - User documentation
