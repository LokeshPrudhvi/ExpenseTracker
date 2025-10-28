import { Card } from "./ui/card";
import { Lightbulb, AlertCircle, CheckCircle, Info } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface QuickTipsProps {
  expenses: Expense[];
  budget: number;
  income: number;
}

export function QuickTips({ expenses, budget, income }: QuickTipsProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;
  const savingsRate = income > 0 ? ((income - totalSpent) / income) * 100 : 0;

  // Calculate category spending
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const tips = [];

  // Budget tips
  if (remaining < 0) {
    tips.push({
      icon: AlertCircle,
      type: 'warning',
      title: 'Over Budget',
      message: 'You\'ve exceeded your monthly budget. Consider reviewing your expenses.',
      color: 'text-red-500'
    });
  } else if (remaining < budget * 0.2) {
    tips.push({
      icon: AlertCircle,
      type: 'warning',
      title: 'Budget Alert',
      message: 'You\'re approaching your budget limit. Monitor your spending closely.',
      color: 'text-yellow-500'
    });
  } else {
    tips.push({
      icon: CheckCircle,
      type: 'success',
      title: 'Budget On Track',
      message: 'Great job! You\'re managing your budget well.',
      color: 'text-green-500'
    });
  }

  // Savings tips
  if (savingsRate < 10) {
    tips.push({
      icon: Info,
      type: 'info',
      title: 'Increase Savings',
      message: 'Financial experts recommend saving at least 10-20% of your income.',
      color: 'text-blue-500'
    });
  } else if (savingsRate >= 20) {
    tips.push({
      icon: CheckCircle,
      type: 'success',
      title: 'Excellent Savings',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
      color: 'text-green-500'
    });
  }

  // Category-specific tips
  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [cat, amount]) => amount > max.amount ? { category: cat, amount } : max,
    { category: '', amount: 0 }
  );

  if (highestCategory.category && totalSpent > 0) {
    const percentage = (highestCategory.amount / totalSpent) * 100;
    if (percentage > 40) {
      tips.push({
        icon: Lightbulb,
        type: 'tip',
        title: 'Category Alert',
        message: `${highestCategory.category} accounts for ${percentage.toFixed(1)}% of your spending. Look for ways to optimize this category.`,
        color: 'text-purple-500'
      });
    }
  }

  // Daily spending tip
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const averageDaily = currentDay > 0 ? totalSpent / currentDay : 0;
  const projectedSpending = averageDaily * daysInMonth;

  if (projectedSpending > budget && budget > 0) {
    tips.push({
      icon: AlertCircle,
      type: 'warning',
      title: 'Spending Pace',
      message: `At your current pace, you may exceed your budget by month end. Daily average: ${averageDaily.toFixed(2)}`,
      color: 'text-yellow-500'
    });
  }

  return (
    <Card className="p-6">
      <h3 className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5" />
        Quick Tips & Insights
      </h3>

      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
              <Icon className={`w-5 h-5 ${tip.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="mb-1">{tip.title}</p>
                <p className="text-sm text-muted-foreground">{tip.message}</p>
              </div>
            </div>
          );
        })}

        {tips.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Add some expenses to get personalized insights
          </p>
        )}
      </div>
    </Card>
  );
}
