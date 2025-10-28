import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ExpenseList } from "./ExpenseList";
import {
  Plus,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Activity,
  ArrowRight,
  Repeat,
  CreditCard,
  Clock,
  Zap,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = "https://expensetracker-vt47.onrender.com/api";

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod?: string;
  notes?: string;
}

interface EMI {
  _id: string;
  name: string;
  totalAmount: number;
  monthlyEMI: number;
  remainingAmount: number;
  interestRate?: number;
  startDate: string;
  endDate: string;
  dueDate: number;
  notes?: string;
}

interface RecurringExpense {
  _id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  notes?: string;
}

interface SavingsGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  description?: string;
}

interface EnhancedMainDashboardProps {
  income: number;
  currency: string;
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onQuickAdd: () => void;
  onViewExpenses: () => void;
  onViewAnalytics: () => void;
  onViewGoals: () => void;
  onViewHealth: () => void;
  onViewRecurring?: () => void;
  onViewEMI?: () => void;
}

export function EnhancedMainDashboard({
  income,
  currency,
  expenses,
  onDeleteExpense, // ADD THIS LINE
  onQuickAdd,
  onViewExpenses,
  onViewAnalytics,
  onViewGoals,
  onViewHealth,
  onViewRecurring,
  onViewEMI,
}: EnhancedMainDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "week">(
    "month"
  );
  // REMOVED: const [expenses, setExpenses] = useState<Expense[]>([]);
  const [emis, setEmis] = useState<EMI[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get auth token helper
  const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // Fetch all data from your backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const config = getAuthConfig();

      // Fetch only EMI, recurring, and goals - expenses come from props
      const [emisRes, recurringRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/emi`, config),
        axios.get(`${API_URL}/recurring`, config),
        axios.get(`${API_URL}/savings`, config),
      ]);

      // Your backend returns data in response.data.data
      // REMOVED: setExpenses(expensesRes.data.data || []);
      setEmis(emisRes.data.data || []);
      setRecurringExpenses(recurringRes.data.data || []);
      setSavingsGoals(goalsRes.data.data || []);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get current period expenses
  const now = new Date();
  const periodExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    if (selectedPeriod === "month") {
      return (
        expDate.getMonth() === now.getMonth() &&
        expDate.getFullYear() === now.getFullYear()
      );
    } else {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expDate >= weekAgo;
    }
  });

  const totalSpent = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = income - totalSpent;
  const spendingRate = income > 0 ? (totalSpent / income) * 100 : 0;

  // Calculate active EMI total
  const activeEMIs = emis.filter((emi) => {
    const endDate = new Date(emi.endDate);
    return endDate >= now;
  });
  const totalMonthlyEMI = activeEMIs.reduce(
    (sum, emi) => sum + emi.monthlyEMI,
    0
  );

  // Calculate active recurring total
  const activeRecurring = recurringExpenses.filter((rec) => {
    if (rec.endDate) {
      const endDate = new Date(rec.endDate);
      return endDate >= now;
    }
    return true; // No end date means it's active
  });
  const totalMonthlyRecurring = activeRecurring.reduce(
    (sum, rec) => sum + rec.amount,
    0
  );

  // Calculate total monthly obligations
  const totalMonthlyObligations = totalMonthlyEMI + totalMonthlyRecurring;

  // Savings goals stats
  const totalSavingsGoal = savingsGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalSavingsCurrent = savingsGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const savingsProgress =
    totalSavingsGoal > 0 ? (totalSavingsCurrent / totalSavingsGoal) * 100 : 0;

  // Calculate financial health score
  const calculateHealthScore = () => {
    let score = 100;

    if (spendingRate > 100) score -= 30;
    else if (spendingRate > 80) score -= 15;

    const obligationRate =
      income > 0 ? (totalMonthlyObligations / income) * 100 : 0;
    if (obligationRate > 60) score -= 25;
    else if (obligationRate > 40) score -= 15;

    if (savingsProgress > 80) score += 10;
    else if (savingsProgress > 50) score += 5;

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  const getHealthStatus = (score: number) => {
    if (score >= 80)
      return {
        label: "Excellent",
        color: "text-green-600 dark:text-green-400",
      };
    if (score >= 60)
      return { label: "Good", color: "text-blue-600 dark:text-blue-400" };
    if (score >= 40)
      return { label: "Fair", color: "text-orange-600 dark:text-orange-400" };
    return {
      label: "Needs Attention",
      color: "text-red-600 dark:text-red-400",
    };
  };

  const healthStatus = getHealthStatus(healthScore);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {expenses.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            👋 Welcome back! You have {periodExpenses.length} expense
            {periodExpenses.length !== 1 ? "s" : ""} this {selectedPeriod}
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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Financial Health Score</p>
                <p className="text-xs text-muted-foreground truncate">
                  {healthScore.toFixed(0)}/100 • {healthStatus.label}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          </div>
        </Card>
      )}

      {/* Finance Widgets Grid */}
      {(activeEMIs.length > 0 ||
        activeRecurring.length > 0 ||
        savingsGoals.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* EMI Tracker Widget */}
          {activeEMIs.length > 0 && (
            <Card
              className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={onViewEMI}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge className="bg-purple-600 shrink-0">
                  {activeEMIs.length}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-1">EMI Tracker</p>
              <p className="text-2xl font-bold tabular-nums mb-1">
                {currency} {totalMonthlyEMI.toLocaleString()}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {activeEMIs.length} active EMI
                  {activeEMIs.length !== 1 ? "s" : ""}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          )}

          {/* Recurring Expenses Widget */}
          {activeRecurring.length > 0 && (
            <Card
              className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={onViewRecurring}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                  <Repeat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge className="bg-blue-600 shrink-0">
                  {activeRecurring.length}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-1">Recurring</p>
              <p className="text-2xl font-bold tabular-nums mb-1">
                {currency} {totalMonthlyRecurring.toLocaleString()}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{activeRecurring.length} active</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          )}

          {/* Savings Goals Widget */}
          {savingsGoals.length > 0 && (
            <Card
              className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={onViewGoals}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge className="bg-amber-600 shrink-0">
                  {savingsGoals.length}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-1">
                Savings Goals
              </p>
              <p className="text-2xl font-bold tabular-nums mb-1">
                {savingsProgress.toFixed(0)}%
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate">
                  {currency} {totalSavingsCurrent.toLocaleString()} /{" "}
                  {totalSavingsGoal.toLocaleString()}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Monthly Obligations Summary */}
      {totalMonthlyObligations > 0 && (
        <Card className="p-5 shadow-xl border-2 border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">Total Monthly Obligations</h4>
              <p className="text-xs text-muted-foreground">
                EMI + Recurring expenses
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-3xl font-bold tabular-nums">
                {currency} {totalMonthlyObligations.toLocaleString()}
              </span>
              <Badge variant="outline" className="shrink-0">
                {income > 0
                  ? `${((totalMonthlyObligations / income) * 100).toFixed(
                      1
                    )}% of income`
                  : "0%"}
              </Badge>
            </div>

            <Progress
              value={
                income > 0
                  ? Math.min((totalMonthlyObligations / income) * 100, 100)
                  : 0
              }
              className="h-2"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">EMI</p>
                  <p className="text-sm font-medium tabular-nums truncate">
                    {currency} {totalMonthlyEMI.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Recurring</p>
                  <p className="text-sm font-medium tabular-nums truncate">
                    {currency} {totalMonthlyRecurring.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Overview Card */}
      <Card className="shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === "week" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
                className="h-7 text-xs"
              >
                Week
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
                className="h-7 text-xs"
              >
                Month
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Spent</p>
              <p className="text-4xl font-bold tabular-nums">
                {currency} {totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="bg-white/20 dark:bg-black/20 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  of {currency} {income.toLocaleString()} income
                </span>
                <span className="font-medium">{spendingRate.toFixed(0)}%</span>
              </div>
              <Progress
                value={Math.min(spendingRate, 100)}
                className="h-2 bg-white/30 dark:bg-black/30"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              {remaining >= 0 ? (
                <>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {currency} {remaining.toLocaleString()} remaining
                    </span>
                  </span>
                  <span className="opacity-90 shrink-0 ml-2">
                    {periodExpenses.length} expense
                    {periodExpenses.length !== 1 ? "s" : ""}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-yellow-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Over by {currency} {Math.abs(remaining).toLocaleString()}
                    </span>
                  </span>
                  <span className="opacity-90 shrink-0 ml-2">
                    {periodExpenses.length} expense
                    {periodExpenses.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-card">
          <Button
            onClick={onQuickAdd}
            size="lg"
            className="w-full h-14 text-base font-medium"
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
              <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs font-medium">Analytics</p>
          </div>
        </Card>

        <Card
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={onViewGoals}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs font-medium">Goals</p>
          </div>
        </Card>

        <Card
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={onViewExpenses}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs font-medium">Expenses</p>
          </div>
        </Card>
      </div>
      {/* Recent Expenses List */}
      {expenses.length > 0 && (
        <ExpenseList
          expenses={expenses.slice(0, 5)} // Show only last 5 expenses
          onDeleteExpense={onDeleteExpense}
          currency={currency}
        />
      )}
    </div>
  );
}
