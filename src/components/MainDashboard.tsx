import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Plus,
  TrendingUp,
  Calendar,
  PieChart,
  Target,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Activity,
  ArrowRight,
  Repeat,
  Bell
} from "lucide-react";
import { type Expense } from "./ExpenseForm";
import { type RecurringExpense } from "./RecurringExpenses";
import { getPendingRecurringExpenses, createExpenseFromRecurring } from "../utils/recurring";
import { toast } from "sonner@2.0.3";

interface MainDashboardProps {
  expenses: Expense[];
  income: number;
  currency: string;
  recurringExpenses?: RecurringExpense[];
  onQuickAdd: () => void;
  onViewExpenses: () => void;
  onViewAnalytics: () => void;
  onViewGoals: () => void;
  onViewHealth: () => void;
  onViewRecurring?: () => void;
  onAddExpense?: (expense: Omit<Expense, "id">) => void;
}

export function MainDashboard({ 
  expenses, 
  income, 
  currency,
  recurringExpenses = [],
  onQuickAdd,
  onViewExpenses,
  onViewAnalytics,
  onViewGoals,
  onViewHealth,
  onViewRecurring,
  onAddExpense
}: MainDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'week'>('month');

  // Get pending recurring expenses
  const pendingRecurring = getPendingRecurringExpenses(recurringExpenses, expenses);
  
  const handleAddRecurringExpense = (recurring: RecurringExpense) => {
    if (!onAddExpense) return;
    const expense = createExpenseFromRecurring(recurring);
    onAddExpense(expense);
    toast.success(`✅ Added ${recurring.description}!`);
  };

  const handleAddAllRecurring = () => {
    if (!onAddExpense) return;
    pendingRecurring.forEach(recurring => {
      const expense = createExpenseFromRecurring(recurring);
      onAddExpense(expense);
    });
    toast.success(`✅ Added ${pendingRecurring.length} recurring expenses!`);
  };

  // Get current period expenses
  const now = new Date();
  const periodExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    if (selectedPeriod === 'month') {
      return expDate.getMonth() === now.getMonth() && 
             expDate.getFullYear() === now.getFullYear();
    } else {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expDate >= weekAgo;
    }
  });

  const totalSpent = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = income - totalSpent;
  const spendingRate = income > 0 ? (totalSpent / income) * 100 : 0;

  // Recent expenses (last 5)
  const recentExpenses = [...periodExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Category breakdown
  const categoryTotals = periodExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: '🍔',
      transportation: '🚗',
      shopping: '🛍️',
      entertainment: '🎮',
      utilities: '💡',
      healthcare: '🏥',
      rent: '🏠',
      education: '📚',
      savings: '💰',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Pending Recurring Expenses Alert */}
      {pendingRecurring.length > 0 && (
        <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
          <Bell className="w-4 h-4 text-orange-600" />
          <AlertDescription>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-orange-900 dark:text-orange-100 mb-1">
                  <strong>{pendingRecurring.length} recurring expense{pendingRecurring.length > 1 ? 's' : ''}</strong> pending this month
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  {pendingRecurring.map(r => r.description).join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onViewRecurring}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddAllRecurring}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Add All
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Welcome Banner */}
      {expenses.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            👋 Welcome back! You have {periodExpenses.length} expenses this month
          </p>
        </div>
      )}

      {/* Financial Health Quick Access */}
      {expenses.length > 0 && (
        <Card 
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
          onClick={onViewHealth}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm">Financial Health Score</p>
                <p className="text-xs text-muted-foreground">View detailed insights & recommendations</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600" />
          </div>
        </Card>
      )}

      {/* Overview Card */}
      <Card className="shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedPeriod === 'week' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
                className="h-7 text-xs"
              >
                Week
              </Button>
              <Button 
                variant={selectedPeriod === 'month' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
                className="h-7 text-xs"
              >
                Month
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Spent</p>
              <p className="text-4xl tabular-nums">{currency} {totalSpent.toLocaleString()}</p>
            </div>

            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>of {currency} {income.toLocaleString()} income</span>
                <span>{spendingRate.toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(spendingRate, 100)} className="h-2 bg-white/30" />
            </div>

            <div className="flex items-center justify-between text-sm">
              {remaining >= 0 ? (
                <>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {currency} {remaining.toLocaleString()} remaining
                  </span>
                  <span className="opacity-90">{periodExpenses.length} expenses</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-yellow-300">
                    <AlertCircle className="w-4 h-4" />
                    Over by {currency} {Math.abs(remaining).toLocaleString()}
                  </span>
                  <span className="opacity-90">{periodExpenses.length} expenses</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900">
          <Button 
            onClick={onQuickAdd}
            size="lg"
            className="w-full h-14"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Expense
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Card 
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={onViewAnalytics}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs">Analytics</p>
          </div>
        </Card>

        <Card 
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={onViewGoals}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs">Goals</p>
          </div>
        </Card>

        <Card 
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={onViewExpenses}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs">All Expenses</p>
          </div>
        </Card>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Card className="p-6 shadow-xl">
          <h3 className="mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            {topCategories.map(([category, amount]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <span className="capitalize text-sm">{category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm tabular-nums">{currency} {amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {income > 0 ? `${((amount / income) * 100).toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                </div>
                <Progress value={income > 0 ? (amount / income) * 100 : 0} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Expenses */}
      <Card className="p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Expenses</h3>
          {recentExpenses.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onViewExpenses}>
              View All
            </Button>
          )}
        </div>

        {recentExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="mb-2">No expenses yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start tracking by adding your first expense
            </p>
            <Button onClick={onQuickAdd} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <div 
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate capitalize">
                      {expense.description || expense.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(expense.date)} • {expense.category}
                    </p>
                  </div>
                </div>
                <p className="text-sm tabular-nums">
                  {currency} {expense.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
