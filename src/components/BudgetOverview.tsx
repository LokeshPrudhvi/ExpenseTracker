import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../utils/currency";

interface BudgetOverviewProps {
  budget: number;
  totalSpent: number;
  currency: string;
}

export function BudgetOverview({ budget, totalSpent, currency }: BudgetOverviewProps) {
  const remaining = budget - totalSpent;
  const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const isOverBudget = totalSpent > budget;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Monthly Budget Overview
        </h2>
        {isOverBudget ? (
          <TrendingDown className="w-5 h-5 text-destructive" />
        ) : (
          <TrendingUp className="w-5 h-5 text-green-600" />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-1">Total Budget</p>
          <p className="text-2xl">{formatCurrency(budget, currency)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground mb-1">Total Spent</p>
          <p className={`text-2xl ${isOverBudget ? 'text-destructive' : ''}`}>
            {formatCurrency(totalSpent, currency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground mb-1">Remaining</p>
          <p className={`text-2xl ${remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
            {formatCurrency(remaining, currency)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Budget Progress</span>
          <span>{spentPercentage.toFixed(1)}%</span>
        </div>
        <Progress 
          value={Math.min(spentPercentage, 100)} 
          className={`w-full ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
        />
        {isOverBudget && (
          <p className="text-destructive text-sm">
            You've exceeded your budget by {formatCurrency(totalSpent - budget, currency)}
          </p>
        )}
      </div>
    </Card>
  );
}