/**
 * Application constants
 */

/**
 * Expense categories with icons and colors
 */
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍔', color: 'text-orange-500' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'text-pink-500' },
  { value: 'transport', label: 'Transportation', icon: '🚗', color: 'text-blue-500' },
  { value: 'housing', label: 'Housing', icon: '🏠', color: 'text-green-500' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'text-purple-500' },
  { value: 'healthcare', label: 'Healthcare', icon: '❤️', color: 'text-red-500' },
  { value: 'utilities', label: 'Utilities', icon: '💡', color: 'text-cyan-500' },
  { value: 'education', label: 'Education', icon: '📚', color: 'text-indigo-500' },
  { value: 'coffee', label: 'Coffee & Snacks', icon: '☕', color: 'text-amber-500' },
  { value: 'other', label: 'Other', icon: '📋', color: 'text-gray-500' },
] as const;

/**
 * Financial health recommendations
 */
export const FINANCIAL_RECOMMENDATIONS = {
  SAVINGS_GOAL: 20, // Aim to save 20% of income
  NEEDS_LIMIT: 50,  // Keep needs under 50% of income
  WANTS_LIMIT: 30,  // Keep wants under 30% of income
  EMERGENCY_FUND_MONTHS: 6, // 6 months of expenses
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  IS_LOGGED_IN: 'isLoggedIn',
  MONTHLY_EXPENSES: 'monthlyExpenses',
  MONTHLY_INCOME: 'monthlyIncome',
  SELECTED_CURRENCY: 'selectedCurrency',
  SAVINGS_GOALS: 'savingsGoals',
  ONBOARDING_COMPLETE: 'onboardingComplete',
  FIRST_EXPENSE_ADDED: 'firstExpenseAdded',
  CUSTOM_CATEGORIES: 'customCategories',
  RECURRING_EXPENSES: 'recurringExpenses',
} as const;

/**
 * App configuration
 */
export const APP_CONFIG = {
  NAME: 'Expense Tracker',
  VERSION: '1.0.0',
  MIN_PASSWORD_LENGTH: 6,
  MAX_INCOME: 10000000,
  DEFAULT_CURRENCY: 'USD',
} as const;

/**
 * Time periods for filtering
 */
export const TIME_PERIODS = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
} as const;

/**
 * Chart colors
 */
export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
] as const;

/**
 * Category color mapping
 */
export const CATEGORY_COLORS: Record<string, string> = {
  food: '#f97316',
  shopping: '#ec4899',
  transport: '#3b82f6',
  housing: '#10b981',
  entertainment: '#8b5cf6',
  healthcare: '#ef4444',
  utilities: '#06b6d4',
  education: '#6366f1',
  coffee: '#f59e0b',
  other: '#6b7280',
};

/**
 * Needs vs Wants category classification
 */
export const NEEDS_CATEGORIES = [
  'rent',
  'housing',
  'utilities',
  'food',
  'healthcare',
  'transport',
  'transportation'
] as const;

/**
 * Quick expense templates
 */
export const QUICK_EXPENSE_TEMPLATES = [
  { description: 'Lunch', amount: 15, category: 'food' },
  { description: 'Coffee', amount: 5, category: 'coffee' },
  { description: 'Uber ride', amount: 12, category: 'transport' },
  { description: 'Groceries', amount: 50, category: 'shopping' },
] as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
  MIN_INCOME: 0,
  MAX_INCOME: 10000000,
  MIN_PASSWORD_LENGTH: 6,
  MAX_DESCRIPTION_LENGTH: 200,
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  ENABLE_EMI_TRACKER: true,
  ENABLE_SAVINGS_GOALS: true,
  ENABLE_EXPORT_IMPORT: true,
  ENABLE_FINANCIAL_HEALTH: true,
  ENABLE_ANALYTICS: true,
} as const;
