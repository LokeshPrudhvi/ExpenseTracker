/**
 * Financial calculation utilities
 */

import { type Expense } from '../components/ExpenseForm';

/**
 * Calculate total expenses
 */
export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

/**
 * Calculate expenses by category
 */
export function calculateByCategory(expenses: Expense[]): Record<string, number> {
  return expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate spending rate (percentage of income)
 */
export function calculateSpendingRate(totalSpent: number, income: number): number {
  if (income <= 0) return 0;
  return (totalSpent / income) * 100;
}

/**
 * Calculate savings rate
 */
export function calculateSavingsRate(totalSpent: number, income: number): number {
  if (income <= 0) return 0;
  const remaining = income - totalSpent;
  return (remaining / income) * 100;
}

/**
 * Calculate remaining budget
 */
export function calculateRemaining(income: number, totalSpent: number): number {
  return income - totalSpent;
}

/**
 * Calculate average daily spending
 */
export function calculateDailyAverage(totalSpent: number, days: number): number {
  if (days <= 0) return 0;
  return totalSpent / days;
}

/**
 * Calculate category percentage
 */
export function calculateCategoryPercentage(
  categoryAmount: number, 
  total: number
): number {
  if (total <= 0) return 0;
  return (categoryAmount / total) * 100;
}

/**
 * Get top spending categories
 */
export function getTopCategories(
  categoryTotals: Record<string, number>,
  limit: number = 5
): Array<{ category: string; amount: number; percentage: number }> {
  const total = Object.values(categoryTotals).reduce((sum, amt) => sum + amt, 0);
  
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: calculateCategoryPercentage(amount, total)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Calculate financial health score (0-100)
 */
export function calculateFinancialHealthScore(params: {
  totalSpent: number;
  income: number;
  savingsGoalsCount: number;
}): number {
  const { totalSpent, income, savingsGoalsCount } = params;
  
  let score = 100;
  const spendingRate = calculateSpendingRate(totalSpent, income);
  const savingsRate = calculateSavingsRate(totalSpent, income);
  
  // Deduct for overspending
  if (spendingRate > 100) {
    score -= 30;
  } else if (spendingRate > 80) {
    score -= 15;
  }
  
  // Deduct for low savings
  if (savingsRate < 10) {
    score -= 25;
  } else if (savingsRate < 20) {
    score -= 15;
  } else {
    score += 10; // Bonus for good savings
  }
  
  // Bonus for having savings goals
  if (savingsGoalsCount > 0) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get health status label and color
 */
export function getHealthStatus(score: number): {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
} {
  if (score >= 80) {
    return {
      label: 'Excellent',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600'
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600'
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair',
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600'
    };
  }
  return {
    label: 'Needs Attention',
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600'
  };
}

/**
 * Calculate projected monthly total
 */
export function calculateProjectedMonthly(
  currentTotal: number,
  currentDay: number,
  daysInMonth: number
): number {
  if (currentDay <= 0) return currentTotal;
  const dailyAverage = currentTotal / currentDay;
  return dailyAverage * daysInMonth;
}

/**
 * Calculate needs vs wants spending
 */
export function calculateNeedsVsWants(expenses: Expense[]): {
  needs: number;
  wants: number;
  needsPercentage: number;
  wantsPercentage: number;
} {
  const needsCategories = ['rent', 'utilities', 'food', 'healthcare', 'transportation', 'housing'];
  
  const categoryTotals = calculateByCategory(expenses);
  const total = calculateTotal(expenses);
  
  const needs = Object.entries(categoryTotals)
    .filter(([cat]) => needsCategories.includes(cat.toLowerCase()))
    .reduce((sum, [, amt]) => sum + amt, 0);
  
  const wants = total - needs;
  
  return {
    needs,
    wants,
    needsPercentage: total > 0 ? (needs / total) * 100 : 0,
    wantsPercentage: total > 0 ? (wants / total) * 100 : 0
  };
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

/**
 * Round to decimal places
 */
export function roundTo(num: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}
