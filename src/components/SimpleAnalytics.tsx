import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { type Expense } from "./ExpenseForm";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Activity } from "lucide-react";

interface SimpleAnalyticsProps {
  expenses: Expense[];
  budget: number;
  income: number;
  currency: string;
}

export function SimpleAnalytics({ expenses, budget, income, currency }: SimpleAnalyticsProps) {
  // Get current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  // Category breakdown
  const categoryData = thisMonthExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      percentage: income > 0 ? ((amount / income) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS = [
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', 
    '#ec4899', '#f43f5e', '#f97316', '#f59e0b',
    '#84cc16', '#10b981'
  ];

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
    return icons[category.toLowerCase()] || '📋';
  };

  const totalSpent = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = income - totalSpent;
  const savingsRate = income > 0 ? ((income - totalSpent) / income * 100) : 0;
  const spendingRate = income > 0 ? (totalSpent / income * 100) : 0;

  if (thisMonthExpenses.length === 0) {
    return (
      <Card className="p-12 text-center shadow-xl">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        <h4 className="mb-2">No data to analyze yet</h4>
        <p className="text-sm text-muted-foreground">
          Add some expenses to see your spending analytics
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <p className="text-sm text-purple-900 dark:text-purple-100">
          📊 Analyzing {thisMonthExpenses.length} expenses • {Object.keys(categoryData).length} categories
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <p className="text-2xl mb-1 tabular-nums">
            {currency} {totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {spendingRate.toFixed(1)}% of income
          </p>
        </Card>

        <Card className={`p-4 shadow-xl ${remaining < 0 ? 'border-red-300 dark:border-red-800' : 'border-green-300 dark:border-green-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            {remaining >= 0 ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
          <p className={`text-2xl mb-1 tabular-nums ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {currency} {Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {remaining < 0 ? 'Over income' : 'Available to save'}
          </p>
        </Card>

        <Card className="p-4 shadow-xl border-blue-300 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-muted-foreground">Savings Rate</p>
          </div>
          <p className={`text-2xl mb-1 tabular-nums ${savingsRate >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">
            {savingsRate >= 20 ? 'Excellent!' : 'Aim for 20%'}
          </p>
        </Card>
      </div>

      {/* 50/30/20 Rule */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4">50/30/20 Budget Rule</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Recommended: 50% Needs, 30% Wants, 20% Savings
        </p>

        {/* Calculate needs vs wants */}
        {(() => {
          const needsCategories = ['rent', 'utilities', 'food', 'healthcare', 'transportation'];
          const needsSpending = Object.entries(categoryData)
            .filter(([cat]) => needsCategories.includes(cat))
            .reduce((sum, [, amt]) => sum + amt, 0);
          const wantsSpending = totalSpent - needsSpending;
          
          const needsPercentage = income > 0 ? (needsSpending / income) * 100 : 0;
          const wantsPercentage = income > 0 ? (wantsSpending / income) * 100 : 0;

          return (
            <div className="space-y-4">
              {/* Needs */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Needs (Essential)</span>
                  <Badge variant={needsPercentage > 50 ? "destructive" : "default"}>
                    {needsPercentage.toFixed(1)}% / 50%
                  </Badge>
                </div>
                <Progress value={Math.min(needsPercentage * 2, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {currency} {needsSpending.toLocaleString()}
                </p>
              </div>

              {/* Wants */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Wants (Lifestyle)</span>
                  <Badge variant={wantsPercentage > 30 ? "destructive" : "default"}>
                    {wantsPercentage.toFixed(1)}% / 30%
                  </Badge>
                </div>
                <Progress value={Math.min((wantsPercentage / 30) * 100, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {currency} {wantsSpending.toLocaleString()}
                </p>
              </div>

              {/* Savings */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Savings</span>
                  <Badge variant={savingsRate < 20 ? "destructive" : "default"}>
                    {savingsRate.toFixed(1)}% / 20%
                  </Badge>
                </div>
                <Progress value={Math.min((savingsRate / 20) * 100, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {currency} {remaining > 0 ? remaining.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Category Distribution */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4">Spending by Category</h3>
        
        {categoryChartData.length > 0 && (
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${currency} ${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category List */}
        <div className="space-y-3">
          {categoryChartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xl">{getCategoryIcon(item.name)}</span>
                <span className="capitalize">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="tabular-nums">{currency} {item.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{item.percentage}% of income</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4">Insights & Recommendations</h3>
        <div className="space-y-3">
          {remaining < 0 && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-900 dark:text-red-100">
                  ⚠️ You're overspending by {currency} {Math.abs(remaining).toLocaleString()}. 
                  Review your expenses and cut back where possible.
                </p>
              </div>
            </div>
          )}

          {savingsRate < 20 && remaining >= 0 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  💡 Your savings rate is {savingsRate.toFixed(1)}%. Try to save at least 20% of your income for financial security.
                </p>
              </div>
            </div>
          )}

          {savingsRate >= 20 && (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-900 dark:text-green-100">
                  🎉 Great job! You're saving {savingsRate.toFixed(1)}% of your income. Keep up the excellent work!
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
