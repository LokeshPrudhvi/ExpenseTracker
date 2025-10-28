import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Calendar, Target, CreditCard } from "lucide-react";
import { formatCurrency } from "../utils/currency";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface StatisticsDashboardProps {
  expenses: Expense[];
  budget: number;
  currency: string;
  income: number;
}

export function StatisticsDashboard({ 
  expenses, 
  budget, 
  currency,
  income 
}: StatisticsDashboardProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;
  const remainingPercentage = budget > 0 ? (remaining / budget) * 100 : 0;
  
  // Calculate average daily spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const averageDaily = currentDay > 0 ? totalSpent / currentDay : 0;
  const projectedMonthly = averageDaily * daysInMonth;
  
  // Find highest expense
  const highestExpense = expenses.length > 0 
    ? expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max)
    : null;
  
  // Calculate savings (income - spent)
  const savings = income - totalSpent;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  // Category insights
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryTotals).length > 0
    ? Object.entries(categoryTotals).reduce((max, [cat, amount]) => 
        amount > max.amount ? { category: cat, amount } : max,
        { category: '', amount: 0 }
      )
    : null;
  
  // EMI calculations
  const today = new Date();
  const activeEMIs = expenses.filter(exp => {
    if (!exp.isEMI || !exp.emiEndDate) return false;
    const endDate = new Date(exp.emiEndDate);
    return endDate >= today;
  });
  const totalMonthlyEMI = activeEMIs.reduce((sum, exp) => sum + exp.amount, 0);

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent, currency),
      subtext: `${expenses.length} transactions`,
      icon: TrendingDown,
      color: "text-red-500"
    },
    {
      label: "Remaining Budget",
      value: formatCurrency(remaining, currency),
      subtext: `${remainingPercentage.toFixed(1)}% left`,
      icon: TrendingUp,
      color: remaining >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      label: "Avg Daily Spending",
      value: formatCurrency(averageDaily, currency),
      subtext: `Projected: ${formatCurrency(projectedMonthly, currency)}`,
      icon: Calendar,
      color: "text-blue-500"
    },
    {
      label: "Savings This Month",
      value: formatCurrency(savings, currency),
      subtext: `${savingsRate.toFixed(1)}% savings rate`,
      icon: Target,
      color: savings >= 0 ? "text-green-500" : "text-red-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className={stat.color}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtext}
                  </p>
                </div>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Insights */}
      <Card className="p-6">
        <h3 className="mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Highest Single Expense</p>
            {highestExpense ? (
              <div>
                <p>{formatCurrency(highestExpense.amount, currency)}</p>
                <p className="text-sm text-muted-foreground">
                  {highestExpense.description} ({highestExpense.category})
                </p>
              </div>
            ) : (
              <p className="text-sm">No expenses yet</p>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Top Spending Category</p>
            {topCategory && topCategory.category ? (
              <div>
                <p className="capitalize">{topCategory.category}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(topCategory.amount, currency)} total
                </p>
              </div>
            ) : (
              <p className="text-sm">No expenses yet</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Active EMI Commitments
            </p>
            {activeEMIs.length > 0 ? (
              <div>
                <p>{formatCurrency(totalMonthlyEMI, currency)}/month</p>
                <p className="text-sm text-muted-foreground">
                  {activeEMIs.length} active {activeEMIs.length === 1 ? 'EMI' : 'EMIs'}
                </p>
              </div>
            ) : (
              <p className="text-sm">No active EMIs</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
