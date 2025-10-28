import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { PieChart } from "lucide-react";
import { formatCurrency } from "../utils/currency";

interface CategoryBreakdownProps {
  expenses: Array<{ category: string; amount: number }>;
  budget: number;
  currency: string;
}

export function CategoryBreakdown({ expenses, budget, currency }: CategoryBreakdownProps) {
  // Calculate spending by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by spending amount
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6); // Show top 6 categories

  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-chart-1',
      'bg-chart-2', 
      'bg-chart-3',
      'bg-chart-4',
      'bg-chart-5',
      'bg-muted'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5" />
        Spending by Category
      </h2>
      
      {sortedCategories.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No expenses recorded yet
        </p>
      ) : (
        <div className="space-y-4">
          {sortedCategories.map(([category, amount], index) => {
            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            const budgetPercentage = budget > 0 ? (amount / budget) * 100 : 0;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)}`} />
                    <span className="capitalize">{category}</span>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(amount, currency)}</p>
                    <p className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}% of spending
                    </p>
                  </div>
                </div>
                <Progress value={budgetPercentage} className="h-2" />
              </div>
            );
          })}
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span>Total Spending</span>
              <span>{formatCurrency(totalSpent, currency)}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}