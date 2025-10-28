/**
 * Auto-calculation utilities for EMI and Recurring Expenses
 */

import type { Expense } from "../components/ExpenseForm";

export interface EMI {
  id: string;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  category: string;
}

export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  dayOfMonth: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Check if an EMI has been added to expenses this month
 */
export function hasEMIBeenAddedThisMonth(
  emi: EMI,
  expenses: Expense[]
): boolean {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return expenses.some((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expense.description.includes(emi.name) &&
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear &&
      Math.abs(expense.amount - emi.amount) < 0.01 // Check amount matches
    );
  });
}

/**
 * Check if a recurring expense has been added this month
 */
export function hasRecurringBeenAddedThisMonth(
  recurring: RecurringExpense,
  expenses: Expense[]
): boolean {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return expenses.some((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expense.description.includes(recurring.description) &&
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear &&
      Math.abs(expense.amount - recurring.amount) < 0.01
    );
  });
}

/**
 * Check if EMI is still active
 */
export function isEMIActive(emi: EMI): boolean {
  const today = new Date();
  const endDate = new Date(emi.endDate);
  const startDate = new Date(emi.startDate);
  
  return today >= startDate && today <= endDate;
}

/**
 * Create expense from EMI
 */
export function createExpenseFromEMI(emi: EMI): Omit<Expense, "id"> {
  const today = new Date();
  
  return {
    amount: emi.amount,
    category: emi.category,
    description: `${emi.name} - EMI Payment`,
    date: today.toISOString().split("T")[0],
  };
}

/**
 * Create expense from recurring expense
 */
export function createExpenseFromRecurring(
  recurring: RecurringExpense
): Omit<Expense, "id"> {
  const today = new Date();
  const targetDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    recurring.dayOfMonth
  );

  // If the day has passed, use today's date
  if (today.getDate() > recurring.dayOfMonth) {
    targetDate.setMonth(targetDate.getMonth() + 1);
  }

  return {
    amount: recurring.amount,
    category: recurring.category,
    description: recurring.description,
    date: today.toISOString().split("T")[0],
  };
}

/**
 * Get pending EMIs that need to be added this month
 */
export function getPendingEMIs(
  emis: EMI[],
  expenses: Expense[]
): EMI[] {
  return emis.filter(
    (emi) => isEMIActive(emi) && !hasEMIBeenAddedThisMonth(emi, expenses)
  );
}

/**
 * Get pending recurring expenses that need to be added this month
 */
export function getPendingRecurring(
  recurring: RecurringExpense[],
  expenses: Expense[]
): RecurringExpense[] {
  return recurring.filter(
    (rec) => rec.isActive && !hasRecurringBeenAddedThisMonth(rec, expenses)
  );
}

/**
 * Get all pending auto-expenses (EMI + Recurring)
 */
export function getAllPendingAutoExpenses(
  emis: EMI[],
  recurring: RecurringExpense[],
  expenses: Expense[]
): {
  pendingEMIs: EMI[];
  pendingRecurring: RecurringExpense[];
  totalCount: number;
  totalAmount: number;
} {
  const pendingEMIs = getPendingEMIs(emis, expenses);
  const pendingRecurring = getPendingRecurring(recurring, expenses);
  
  const totalAmount = 
    pendingEMIs.reduce((sum, emi) => sum + emi.amount, 0) +
    pendingRecurring.reduce((sum, rec) => sum + rec.amount, 0);

  return {
    pendingEMIs,
    pendingRecurring,
    totalCount: pendingEMIs.length + pendingRecurring.length,
    totalAmount,
  };
}
