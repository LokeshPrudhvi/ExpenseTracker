/**
 * Validation utilities for expense tracker
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}

/**
 * Validate amount (positive number)
 */
export function isValidAmount(amount: string | number): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > 0;
}

/**
 * Validate date format
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate expense data
 */
export function validateExpense(expense: {
  description?: string;
  amount?: number | string;
  category?: string;
  date?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!expense.description || !expense.description.trim()) {
    errors.push('Description is required');
  }

  if (!expense.amount || !isValidAmount(expense.amount)) {
    errors.push('Please enter a valid amount greater than 0');
  }

  if (!expense.category || !expense.category.trim()) {
    errors.push('Category is required');
  }

  if (expense.date && !isValidDate(expense.date)) {
    errors.push('Invalid date format');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate income amount
 */
export function validateIncome(income: string | number): { valid: boolean; message?: string } {
  if (!income) {
    return { valid: false, message: 'Income is required' };
  }

  const numIncome = typeof income === 'string' ? parseFloat(income) : income;
  
  if (isNaN(numIncome) || numIncome <= 0) {
    return { valid: false, message: 'Please enter a valid income amount' };
  }

  if (numIncome > 10000000) {
    return { valid: false, message: 'Income amount seems unusually high' };
  }

  return { valid: true };
}
