import { Card } from "./ui/card";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface MonthlyReportProps {
  expenses: Expense[];
  currency: string;
}

export function MonthlyReport({ expenses, currency }: MonthlyReportProps) {
  const [selectedMonth, setSelectedMonth] = useState('current');

  // Get unique months from expenses
  const getMonthsFromExpenses = () => {
    const months = new Set<string>();
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const availableMonths = getMonthsFromExpenses();
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  // Filter expenses by selected month
  const getExpensesForMonth = (monthKey: string) => {
    if (monthKey === 'current') {
      monthKey = currentMonthKey;
    }

    return expenses.filter(expense => {
      const date = new Date(expense.date);
      const expenseMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonthKey === monthKey;
    });
  };

  const selectedMonthExpenses = getExpensesForMonth(selectedMonth);
  const totalSpent = selectedMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate category breakdown
  const categoryTotals = selectedMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get previous month for comparison
  const getPreviousMonthKey = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1);
    date.setMonth(date.getMonth() - 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const previousMonthKey = selectedMonth === 'current' ? getPreviousMonthKey(currentMonthKey) : getPreviousMonthKey(selectedMonth);
  const previousMonthExpenses = getExpensesForMonth(previousMonthKey);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthOverMonthChange = previousMonthTotal > 0 
    ? ((totalSpent - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;

  const formatMonthLabel = (monthKey: string) => {
    if (monthKey === 'current') return 'Current Month';
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Monthly Report
        </h3>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Month</SelectItem>
            {availableMonths.map(month => (
              <SelectItem key={month} value={month}>
                {formatMonthLabel(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-2xl">{formatCurrency(totalSpent, currency)}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Transactions</p>
            <p className="text-2xl">{selectedMonthExpenses.length}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">vs Previous Month</p>
            <div className="flex items-center gap-2">
              {monthOverMonthChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500" />
              )}
              <p className={`text-2xl ${monthOverMonthChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {Math.abs(monthOverMonthChange).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div>
            <h4 className="mb-3">Top Spending Categories</h4>
            <div className="space-y-2">
              {topCategories.map(([category, amount]) => {
                const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="capitalize">{category}</span>
                    <div className="text-right">
                      <p>{formatCurrency(amount, currency)}</p>
                      <p className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedMonthExpenses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No expenses for this month</p>
          </div>
        )}
      </div>
    </Card>
  );
}
