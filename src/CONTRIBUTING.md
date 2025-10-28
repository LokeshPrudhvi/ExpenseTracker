# Contributing to Expense Tracker

Thank you for your interest in contributing to the Expense Tracker! This document provides guidelines and information for developers who want to understand, modify, or extend this application.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Code Style](#code-style)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Documentation](#documentation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Modern web browser
- Text editor or IDE
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup
1. Clone or download the project
2. Install dependencies (if using a build system)
3. Run the development server
4. Open in browser

### Quick Development Test
```javascript
// In browser console
resetApp()  // Resets all data and reloads
```

## 📁 Project Structure

```
expense-tracker/
├── App.tsx                      # Main application component
├── components/                  # React components
│   ├── AuthScreen.tsx          # Authentication UI
│   ├── QuickOnboarding.tsx     # Onboarding flow
│   ├── FirstExpenseWelcome.tsx # First expense screen
│   ├── MainDashboard.tsx       # Dashboard home
│   ├── SimpleExpensesView.tsx  # Expenses list
│   ├── SimpleAnalytics.tsx     # Analytics charts
│   ├── FinancialHealthDashboard.tsx # Health score
│   ├── SavingsGoals.tsx        # Goals management
│   ├── EMITracker.tsx          # EMI tracking
│   ├── ProfilePage.tsx         # User profile
│   ├── QuickExpenseDialog.tsx  # Quick add dialog
│   ├── MobileNav.tsx           # Mobile navigation
│   ├── DesktopNav.tsx          # Desktop navigation
│   ├── MoreSection.tsx         # More menu
│   ├── ExpenseForm.tsx         # Expense form
│   ├── ExpenseList.tsx         # Expense list component
│   ├── CategoryBreakdown.tsx   # Category charts
│   ├── IncomeSetter.tsx        # Income setter
│   ├── CurrencySelector.tsx    # Currency dropdown
│   ├── DataManagement.tsx      # Export/Import
│   ├── HelpGuide.tsx           # Help documentation
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...
├── utils/                       # Utility functions
│   ├── currency.ts             # Currency utilities
│   ├── date.ts                 # Date helpers
│   ├── calculations.ts         # Financial calculations
│   ├── validation.ts           # Input validation
│   ├── constants.ts            # App constants
│   └── index.ts                # Barrel export
├── styles/
│   └── globals.css             # Global styles
└── docs/                        # Documentation files
    ├── README.md
    ├── USER_GUIDE.md
    ├── TESTING_GUIDE.md
    └── ...
```

## 💻 Development Guidelines

### Component Structure
Each component should follow this pattern:

```typescript
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
// ... other imports

interface ComponentProps {
  // Define props with types
  data: string;
  onAction: () => void;
}

export function Component({ data, onAction }: ComponentProps) {
  // State declarations
  const [state, setState] = useState<Type>(initialValue);

  // Event handlers
  const handleEvent = () => {
    // Handle logic
  };

  // Render
  return (
    <div className="container">
      {/* Component JSX */}
    </div>
  );
}
```

### State Management Pattern
```typescript
// 1. Declare state
const [expenses, setExpenses] = useState<Expense[]>([]);

// 2. Create handler
const addExpense = (expense: Omit<Expense, 'id'>) => {
  const newExpense = {
    ...expense,
    id: Date.now().toString()
  };
  setExpenses(prev => [...prev, newExpense]);
};

// 3. Persist to localStorage
useEffect(() => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}, [expenses]);

// 4. Load from localStorage
useEffect(() => {
  const saved = localStorage.getItem('expenses');
  if (saved) setExpenses(JSON.parse(saved));
}, []);
```

### LocalStorage Keys
Always use constants from `/utils/constants.ts`:

```typescript
import { STORAGE_KEYS } from './utils/constants';

// Good ✅
localStorage.setItem(STORAGE_KEYS.MONTHLY_EXPENSES, data);

// Bad ❌
localStorage.setItem('monthlyExpenses', data);
```

## 🎨 Code Style

### TypeScript
- Use explicit types for all props and state
- Avoid `any` type
- Use interfaces for object types
- Use type inference where obvious

```typescript
// Good ✅
interface UserProfile {
  name: string;
  email: string;
}

const user: UserProfile = { name: "John", email: "john@example.com" };

// Bad ❌
const user: any = { name: "John", email: "john@example.com" };
```

### React Patterns
- Use functional components only
- Use hooks (useState, useEffect, etc.)
- Keep components focused (single responsibility)
- Extract reusable logic into custom hooks

### Tailwind CSS
- Use utility classes
- Follow the design system (gradient backgrounds, card shadows)
- Don't override font sizes, weights, or line heights unless necessary
- Use color variables from globals.css

```typescript
// Good ✅
<div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-xl">

// Bad ❌
<div className="padding: 24px; background: linear-gradient(...); ...">
```

### Naming Conventions
- Components: PascalCase (`ExpenseForm.tsx`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`STORAGE_KEYS`)
- Interfaces: PascalCase with descriptive names (`ExpenseFormProps`)

## ➕ Adding Features

### Adding a New Category
1. Edit `/utils/constants.ts`:
```typescript
export const EXPENSE_CATEGORIES = [
  // ... existing categories
  { 
    value: 'newcategory', 
    label: 'New Category', 
    icon: '🎉', 
    color: 'text-purple-500' 
  },
];
```

2. Add color to `CATEGORY_COLORS`:
```typescript
export const CATEGORY_COLORS: Record<string, string> = {
  // ... existing colors
  newcategory: '#8b5cf6',
};
```

### Adding a New Currency
Edit `/components/CurrencySelector.tsx`:
```typescript
export const CURRENCIES = [
  // ... existing currencies
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];
```

### Adding a New Quick Template
Edit `/utils/constants.ts`:
```typescript
export const QUICK_EXPENSE_TEMPLATES = [
  // ... existing templates
  { description: 'New Template', amount: 25, category: 'shopping' },
];
```

### Creating a New Component
1. Create file in `/components/`:
```typescript
// components/NewFeature.tsx
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface NewFeatureProps {
  data: string;
  onAction: () => void;
}

export function NewFeature({ data, onAction }: NewFeatureProps) {
  return (
    <Card className="p-6">
      <h3>New Feature</h3>
      <p>{data}</p>
      <Button onClick={onAction}>Action</Button>
    </Card>
  );
}
```

2. Import and use in parent component
3. Add to navigation if needed
4. Update documentation

### Adding a New Utility Function
1. Choose appropriate file in `/utils/`:
   - Currency operations → `currency.ts`
   - Date operations → `date.ts`
   - Calculations → `calculations.ts`
   - Validation → `validation.ts`

2. Add function with JSDoc comment:
```typescript
/**
 * Calculate average spending per day
 * @param expenses - Array of expenses
 * @param days - Number of days
 * @returns Average amount per day
 */
export function calculateDailyAverage(
  expenses: Expense[], 
  days: number
): number {
  const total = calculateTotal(expenses);
  return days > 0 ? total / days : 0;
}
```

3. Export from `/utils/index.ts` if needed
4. Add tests (when test system is in place)

## 🧪 Testing

### Manual Testing Checklist
Before submitting changes:

- [ ] Test on mobile viewport (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test with empty state (no expenses)
- [ ] Test with lots of data (100+ expenses)
- [ ] Test dark mode
- [ ] Test all user flows
- [ ] Test error states
- [ ] Check console for errors
- [ ] Verify localStorage persistence

### Testing User Flows
```javascript
// 1. Reset app
resetApp()

// 2. Test signup flow
// - Fill all fields
// - Submit
// - Verify onboarding appears

// 3. Test onboarding
// - Set income
// - Select currency
// - Complete

// 4. Test first expense
// - Use quick template
// - Verify form fills
// - Submit
// - Verify dashboard shows expense

// 5. Test navigation
// - Switch between tabs
// - Go to sub-views
// - Use back button
// - Verify state persists
```

### Testing Edge Cases
- Empty inputs
- Very large numbers
- Special characters
- Negative numbers
- Future dates
- Invalid emails
- Short passwords
- LocalStorage full
- Browser without localStorage

## 📚 Documentation

### Code Comments
- Add JSDoc comments for complex functions
- Explain "why" not "what"
- Document edge cases
- Include usage examples

```typescript
/**
 * Calculate financial health score based on spending habits
 * 
 * Score ranges from 0-100 where:
 * - 80-100: Excellent financial health
 * - 60-79: Good financial health  
 * - 40-59: Fair, needs improvement
 * - 0-39: Poor, needs immediate attention
 * 
 * @param params - Object containing totalSpent, income, and savingsGoalsCount
 * @returns Score between 0-100
 * 
 * @example
 * const score = calculateFinancialHealthScore({
 *   totalSpent: 3000,
 *   income: 5000,
 *   savingsGoalsCount: 2
 * });
 * // Returns: 85 (Excellent)
 */
```

### Updating Documentation
When adding features, update:
1. README.md - Add to features list
2. CHANGELOG.md - Add to version section
3. USER_GUIDE.md - Add user instructions
4. Component file - Add inline comments

## 🔧 Common Patterns

### Error Handling
```typescript
try {
  const data = JSON.parse(localStorage.getItem('data') || '[]');
  setData(data);
} catch (error) {
  console.error('Error loading data:', error);
  toast.error('Failed to load data');
  setData([]); // Fallback to empty array
}
```

### Form Validation
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  if (!description.trim()) {
    toast.error("Description is required");
    return;
  }
  
  if (!amount || parseFloat(amount) <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }
  
  // Process
  onSubmit({ description, amount: parseFloat(amount) });
};
```

### Conditional Rendering
```typescript
// Empty state
{expenses.length === 0 && (
  <div className="text-center p-8">
    <p className="text-muted-foreground">No expenses yet</p>
    <Button onClick={onAdd}>Add First Expense</Button>
  </div>
)}

// Loading state
{isLoading && <Spinner />}

// Error state
{error && <Alert variant="destructive">{error}</Alert>}

// Success state
{data && <DataDisplay data={data} />}
```

## 🐛 Debugging Tips

### Common Issues

**"Data not saving"**
- Check if localStorage is enabled
- Check browser storage quota
- Verify JSON serialization works
- Check for console errors

**"Component not updating"**
- Verify state updates trigger re-render
- Check useEffect dependencies
- Ensure immutable state updates
- Check if props are changing

**"Styles not applying"**
- Check Tailwind class names
- Verify globals.css is imported
- Check for class conflicts
- Inspect element in DevTools

### Debugging Commands
```javascript
// Check localStorage
Object.keys(localStorage)
  .filter(key => key.includes('expense'))
  .forEach(key => {
    console.log(key, localStorage.getItem(key));
  });

// Check state
console.log('Expenses:', expenses);
console.log('Income:', income);
console.log('User:', userProfile);

// Clear specific storage
localStorage.removeItem('monthlyExpenses');

// Full reset
resetApp();
```

## 📝 Pull Request Guidelines

If submitting changes:

1. **Clear Description**
   - What does this change do?
   - Why is it needed?
   - How does it work?

2. **Test Coverage**
   - What did you test?
   - Any edge cases?
   - Screenshots if UI changes

3. **Documentation**
   - Update relevant docs
   - Add code comments
   - Update CHANGELOG.md

4. **Code Quality**
   - Follow style guide
   - No console.logs in production
   - TypeScript type safety
   - Responsive design

## 🎯 Best Practices

### Performance
- Avoid unnecessary re-renders
- Use `useCallback` for event handlers passed as props
- Memoize expensive calculations
- Lazy load heavy components

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers
- High contrast support

### Security
- Validate all inputs
- Sanitize user data
- No eval() or dangerous HTML
- Handle errors gracefully
- Don't expose sensitive data

## 📞 Getting Help

### Resources
- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs/
- Tailwind Docs: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

### Project Documentation
- `/README.md` - Project overview
- `/USER_GUIDE.md` - User documentation
- `/TESTING_GUIDE.md` - Testing instructions
- This file - Development guide

---

## 🙏 Thank You!

Thank you for contributing to making Expense Tracker better! Your efforts help create a more useful and accessible tool for everyone.

**Happy Coding! 💻✨**
