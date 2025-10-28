import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  PiggyBank,
  Activity,
  ShieldAlert
} from "lucide-react";
import { type Expense } from "./ExpenseForm";

interface FinancialHealthDashboardProps {
  expenses: Expense[];
  income: number;
  currency: string;
  savingsGoals: Array<{ currentAmount: number; targetAmount: number }>;
}

export function FinancialHealthDashboard({ 
  expenses, 
  income, 
  currency,
  savingsGoals 
}: FinancialHealthDashboardProps) {
  // Get current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const totalSpent = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = income - totalSpent;
  const spendingRate = income > 0 ? (totalSpent / income) * 100 : 0;
  const savingsRate = income > 0 ? ((income - totalSpent) / income) * 100 : 0;

  // Calculate financial health score (0-100)
  let healthScore = 100;
  
  // Deduct points for overspending
  if (spendingRate > 100) healthScore -= 30;
  else if (spendingRate > 80) healthScore -= 15;
  
  // Deduct points for low savings rate
  if (savingsRate < 10) healthScore -= 25;
  else if (savingsRate < 20) healthScore -= 15;
  else healthScore += 10; // Bonus for good savings
  
  // Bonus for having savings goals
  if (savingsGoals.length > 0) healthScore += 10;
  
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Category spending analysis
  const categorySpending = thisMonthExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Categorize as needs vs wants (simplified)
  const needsCategories = ['rent', 'utilities', 'food', 'healthcare', 'transportation'];
  const needsSpending = Object.entries(categorySpending)
    .filter(([cat]) => needsCategories.includes(cat))
    .reduce((sum, [, amt]) => sum + amt, 0);
  const wantsSpending = totalSpent - needsSpending;

  const needsPercentage = income > 0 ? (needsSpending / income) * 100 : 0;
  const wantsPercentage = income > 0 ? (wantsSpending / income) * 100 : 0;

  // Get health status
  const getHealthStatus = () => {
    if (healthScore >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle };
    if (healthScore >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Activity };
    if (healthScore >= 40) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: AlertTriangle };
    return { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: ShieldAlert };
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p className="text-sm text-indigo-900 dark:text-indigo-100">
          💪 Track your financial health and get personalized recommendations
        </p>
      </div>

      {/* Financial Health Score */}
      <Card className="p-6 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <h3>Financial Health Score</h3>
          <Badge className={`${healthStatus.bg} ${healthStatus.color} border-0`}>
            <HealthIcon className="w-3 h-3 mr-1" />
            {healthStatus.label}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div className="text-5xl tabular-nums">{healthScore}</div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
          <Progress value={healthScore} className="h-3" />
        </div>
      </Card>

      {/* Income vs Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Monthly Income</span>
          </div>
          <p className="text-2xl">{currency} {income.toLocaleString()}</p>
        </Card>

        <Card className="p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-2xl tabular-nums">{currency} {totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {spendingRate.toFixed(1)}% of income
          </p>
        </Card>

        <Card className={`p-4 shadow-xl ${remaining < 0 ? 'border-red-300 dark:border-red-800' : 'border-green-300 dark:border-green-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-4 h-4 ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`} />
            <span className="text-sm text-muted-foreground">Remaining</span>
          </div>
          <p className={`text-2xl tabular-nums ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {currency} {Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {remaining < 0 ? 'Over income' : `${savingsRate.toFixed(1)}% savings rate`}
          </p>
        </Card>
      </div>

      {/* 50/30/20 Rule Breakdown */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4">50/30/20 Budget Rule</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Recommended: 50% Needs, 30% Wants, 20% Savings
        </p>
        
        <div className="space-y-4">
          {/* Needs */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Needs (Essential)</span>
              <span className={needsPercentage > 50 ? 'text-red-600' : 'text-green-600'}>
                {needsPercentage.toFixed(1)}% / 50%
              </span>
            </div>
            <Progress value={Math.min(needsPercentage * 2, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {currency} {needsSpending.toLocaleString()}
            </p>
          </div>

          {/* Wants */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Wants (Lifestyle)</span>
              <span className={wantsPercentage > 30 ? 'text-red-600' : 'text-green-600'}>
                {wantsPercentage.toFixed(1)}% / 30%
              </span>
            </div>
            <Progress value={Math.min((wantsPercentage / 30) * 100, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {currency} {wantsSpending.toLocaleString()}
            </p>
          </div>

          {/* Savings */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Savings</span>
              <span className={savingsRate < 20 ? 'text-red-600' : 'text-green-600'}>
                {savingsRate.toFixed(1)}% / 20%
              </span>
            </div>
            <Progress value={Math.min((savingsRate / 20) * 100, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {currency} {remaining > 0 ? remaining.toLocaleString() : '0'}
            </p>
          </div>
        </div>
      </Card>

      {/* Actionable Insights */}
      <Card className="p-6 shadow-xl">
        <h3 className="mb-4 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-blue-600" />
          Personalized Insights
        </h3>
        
        <div className="space-y-3">
          {remaining < 0 && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-900 dark:text-red-100">
                  You're spending more than you earn! Cut back by {currency} {Math.abs(remaining).toLocaleString()} this month.
                </p>
              </div>
            </div>
          )}

          {savingsRate < 10 && remaining >= 0 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  Your savings rate is low ({savingsRate.toFixed(1)}%). Aim for at least 20% to build financial security.
                </p>
              </div>
            </div>
          )}

          {savingsRate >= 20 && (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-900 dark:text-green-100">
                  Excellent! You're saving {savingsRate.toFixed(1)}% of your income. Keep it up!
                </p>
              </div>
            </div>
          )}

          {needsPercentage > 50 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Your essential expenses are {needsPercentage.toFixed(1)}%. Look for ways to reduce bills and subscriptions.
                </p>
              </div>
            </div>
          )}

          {savingsGoals.length === 0 && savingsRate > 10 && (
            <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <PiggyBank className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-indigo-900 dark:text-indigo-100">
                  You have money to save! Set a savings goal to stay motivated.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
