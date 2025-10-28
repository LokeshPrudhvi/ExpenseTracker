/**
 * Utility functions for recurring expenses
 */

import type { RecurringExpense } from "../components/RecurringExpenses";
import type { Expense } from "../components/ExpenseForm";

/**
 * Check if a recurring expense is due for this month
 */
export function isRecurringDueThisMonth(
  recurring: RecurringExpense,
  existingExpenses: Expense[]
): boolean {
  if (!recurring.isActive) return false;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Check if we already have an expense for this recurring item this month
  const alreadyCreated = existingExpenses.some((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expense.description.includes(recurring.description) &&
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  return !alreadyCreated;
}

/**
 * Create an expense from a recurring expense template
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

  // If the day has passed, it's for next month
  if (today.getDate() > recurring.dayOfMonth) {
    targetDate.setMonth(targetDate.getMonth() + 1);
  }

  return {
    amount: recurring.amount,
    category: recurring.category,
    description: recurring.description,
    date: targetDate.toISOString().split("T")[0],
  };
}

/**
 * Get all pending recurring expenses for this month
 */
export function getPendingRecurringExpenses(
  recurringExpenses: RecurringExpense[],
  existingExpenses: Expense[]
): RecurringExpense[] {
  return recurringExpenses.filter((recurring) =>
    isRecurringDueThisMonth(recurring, existingExpenses)
  );
}
