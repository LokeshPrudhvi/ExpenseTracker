import { CURRENCIES } from '../components/CurrencySelector';

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
}

/**
 * Format amount with proper currency formatting
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  
  if (!currency) {
    return `${amount.toLocaleString()}`;
  }

  // Special formatting for currencies that typically don't use decimal places
  const noDecimalCurrencies = ['JPY', 'KRW'];
  const useDecimals = !noDecimalCurrencies.includes(currencyCode);

  // Use Intl.NumberFormat for proper locale formatting
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: useDecimals ? 2 : 0,
      maximumFractionDigits: useDecimals ? 2 : 0,
    }).format(amount);
  } catch (error) {
    // Fallback to manual formatting if currency code is not supported
    const formattedAmount = useDecimals 
      ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : amount.toLocaleString();
    
    return `${currency.symbol}${formattedAmount}`;
  }
}

/**
 * Format amount with currency symbol (compact)
 */
export function formatAmount(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  const noDecimalCurrencies = ['JPY', 'KRW'];
  const useDecimals = !noDecimalCurrencies.includes(currencyCode);
  
  const formattedAmount = useDecimals 
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString();
  
  return `${symbol}${formattedAmount}`;
}

/**
 * Validate if a currency code is supported
 */
export function isValidCurrency(currencyCode: string): boolean {
  return CURRENCIES.some(c => c.code === currencyCode);
}