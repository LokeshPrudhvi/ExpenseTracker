import { Card } from "./ui/card";
import { Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface BudgetRecommendationsProps {
  expenses: Expense[];
  currentBudget: number;
  income: number;
  currency: string;
  onApplyBudget: (budget: number) => void;
}

export function BudgetRecommendations({ 
  expenses, 
  currentBudget, 
  income, 
  currency,
  onApplyBudget 
}: BudgetRecommendationsProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate average monthly spending (using current month as reference)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();
  
  // Project monthly spending based on current pace
  const averageDaily = currentDay > 0 ? totalSpent / currentDay : 0;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const projectedMonthly = averageDaily * daysInMonth;

  // Calculate recommendations
  const recommendations = [];

  // 1. Based on current spending pattern
  if (expenses.length >= 5) {
    const recommendedBudget = Math.ceil(projectedMonthly * 1.1); // 10% buffer
    recommendations.push({
      title: "Based on Current Spending",
      amount: recommendedBudget,
      description: `Your current spending pace projects to ${formatCurrency(projectedMonthly, currency)} this month. A 10% buffer provides flexibility.`,
      reason: "Adjusts for your actual spending patterns",
      icon: TrendingUp,
      color: "text-blue-500"
    });
  }

  // 2. 50/30/20 rule based on income
  if (income > 0) {
    const needsBudget = income * 0.5; // 50% for needs
    const wantsBudget = income * 0.3; // 30% for wants
    const savingsBudget = income * 0.2; // 20% for savings
    const totalBudgetRecommendation = needsBudget + wantsBudget;

    recommendations.push({
      title: "50/30/20 Rule",
      amount: Math.round(totalBudgetRecommendation),
      description: `Based on ${formatCurrency(income, currency)} income: 50% for needs, 30% for wants, 20% for savings.`,
      reason: "Popular budgeting framework for balanced finances",
      icon: DollarSign,
      color: "text-green-500",
      breakdown: {
        needs: needsBudget,
        wants: wantsBudget,
        savings: savingsBudget
      }
    });
  }

  // 3. Conservative recommendation (80% of income)
  if (income > 0) {
    const conservativeBudget = Math.round(income * 0.8);
    recommendations.push({
      title: "Conservative Approach",
      amount: conservativeBudget,
      description: `Set budget to 80% of income (${formatCurrency(income, currency)}), allowing 20% for savings and emergencies.`,
      reason: "Prioritizes savings and financial security",
      icon: Sparkles,
      color: "text-purple-500"
    });
  }

  const handleApplyRecommendation = (amount: number, title: string) => {
    onApplyBudget(amount);
    toast.success(`Budget updated to ${formatCurrency(amount, currency)} (${title})`);
  };

  if (recommendations.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5" />
          Budget Recommendations
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Add some expenses and set your income to get personalized budget recommendations</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" />
        Budget Recommendations
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          const isCurrentBudget = Math.abs(currentBudget - rec.amount) < 10;

          return (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-muted`}>
                    <Icon className={`w-5 h-5 ${rec.color}`} />
                  </div>
                  <div>
                    <h4 className="mb-1">{rec.title}</h4>
                    <p className={`text-2xl mb-2 ${rec.color}`}>
                      {formatCurrency(rec.amount, currency)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {rec.reason}
                    </p>
                  </div>
                </div>
              </div>

              {rec.breakdown && (
                <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Needs (50%)</p>
                    <p className="text-sm">{formatCurrency(rec.breakdown.needs, currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Wants (30%)</p>
                    <p className="text-sm">{formatCurrency(rec.breakdown.wants, currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Savings (20%)</p>
                    <p className="text-sm">{formatCurrency(rec.breakdown.savings, currency)}</p>
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant={isCurrentBudget ? "secondary" : "outline"}
                onClick={() => handleApplyRecommendation(rec.amount, rec.title)}
                disabled={isCurrentBudget}
                className="w-full"
              >
                {isCurrentBudget ? "Current Budget" : "Apply This Budget"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 These recommendations are based on common budgeting principles and your personal financial data. 
          Adjust as needed to fit your unique situation and goals.
        </p>
      </div>
    </Card>
  );
}
