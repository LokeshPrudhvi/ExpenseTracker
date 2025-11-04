import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ExpenseList } from "./ExpenseList";
import { DatePicker } from "./DatePicker"; // NEW: Import date picker
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
  ChevronLeft,
  ChevronRight,
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
  onDeleteExpense,
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // NEW: Control picker visibility
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

  // Fetch all data from backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const config = getAuthConfig();

      const [emisRes, recurringRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/emi`, config),
        axios.get(`${API_URL}/recurring`, config),
        axios.get(`${API_URL}/savings`, config),
      ]);

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

  // Helper functions for date navigation
  const goToPreviousMonth = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  // NEW: Handle date change from picker
  const handleDatePickerChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  // Wrap all calculations in useMemo with proper dependencies
  const calculations = useMemo(() => {
    let referenceDate = new Date(selectedDate);
    referenceDate.setHours(0, 0, 0, 0);

    const periodExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      expDate.setHours(0, 0, 0, 0);

      if (selectedPeriod === "month") {
        return (
          expDate.getMonth() === referenceDate.getMonth() &&
          expDate.getFullYear() === referenceDate.getFullYear()
        );
      } else {
        const weekAgo = new Date(referenceDate);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return expDate >= weekAgo && expDate <= referenceDate;
      }
    });

    const activeEMIs = emis.filter((emi) => {
      const endDate = new Date(emi.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= referenceDate;
    });
    const totalMonthlyEMI = activeEMIs.reduce(
      (sum, emi) => sum + (emi.monthlyEMI || 0),
      0
    );

    const activeRecurring = recurringExpenses.filter((rec) => {
      if (rec.endDate) {
        const endDate = new Date(rec.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate >= referenceDate;
      }
      return true;
    });
    const totalMonthlyRecurring = activeRecurring.reduce(
      (sum, rec) => sum + (rec.amount || 0),
      0
    );

    const totalMonthlyObligations = totalMonthlyEMI + totalMonthlyRecurring;

    const totalSpent = periodExpenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    const totalWithObligations = totalSpent + totalMonthlyObligations;
    const remaining = income - totalWithObligations;
    const spendingRate = income > 0 ? (totalWithObligations / income) * 100 : 0;

    const totalSavingsGoal = savingsGoals.reduce(
      (sum, goal) => sum + (goal.targetAmount || 0),
      0
    );
    const totalSavingsCurrent = savingsGoals.reduce(
      (sum, goal) => sum + (goal.currentAmount || 0),
      0
    );
    const savingsProgress =
      totalSavingsGoal > 0 ? (totalSavingsCurrent / totalSavingsGoal) * 100 : 0;

    let healthScore = 100;

    if (spendingRate > 100) healthScore -= 30;
    else if (spendingRate > 80) healthScore -= 15;

    const obligationRate =
      income > 0 ? (totalMonthlyObligations / income) * 100 : 0;
    if (obligationRate > 60) healthScore -= 25;
    else if (obligationRate > 40) healthScore -= 15;

    if (savingsProgress > 80) healthScore += 10;
    else if (savingsProgress > 50) healthScore += 5;

    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      periodExpenses,
      activeEMIs,
      totalMonthlyEMI,
      activeRecurring,
      totalMonthlyRecurring,
      totalMonthlyObligations,
      totalSpent,
      totalWithObligations,
      remaining,
      spendingRate,
      totalSavingsGoal,
      totalSavingsCurrent,
      savingsProgress,
      healthScore,
      obligationRate,
    };
  }, [emis, recurringExpenses, savingsGoals, expenses, income, selectedPeriod, selectedDate]);

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

  const healthStatus = getHealthStatus(calculations.healthScore);

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
      {/* NEW: Date Picker Modal */}
      {showDatePicker && (
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={handleDatePickerChange}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Main Overview Card */}
      <Card className="shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          {/* Date Navigation Controls */}
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            {/* NEW: Clickable month/year to open picker */}
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <Calendar className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium group-hover:underline">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </button>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="h-7 text-xs"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {!isCurrentMonth() && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goToToday}
                  className="h-7 text-xs"
                >
                  Today
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="h-7 text-xs"
                title="Next month"
                disabled={isCurrentMonth()}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="w-px bg-white/20"></div>
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
              <p className="text-sm opacity-90 mb-1">Total Spent & Obligations</p>
              <p className="text-4xl font-bold tabular-nums">
                {currency} {calculations.totalWithObligations.toLocaleString()}
              </p>
            </div>

            <div className="bg-white/20 dark:bg-black/20 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  of {currency} {income.toLocaleString()} income
                </span>
                <span className="font-medium">
                  {calculations.spendingRate.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={Math.min(calculations.spendingRate, 100)}
                className="h-2 bg-white/30 dark:bg-black/30"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              {calculations.remaining >= 0 ? (
                <>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {currency} {calculations.remaining.toLocaleString()}{" "}
                      remaining
                    </span>
                  </span>
                  <span className="opacity-90 shrink-0 ml-2">
                    {calculations.periodExpenses.length} expense
                    {calculations.periodExpenses.length !== 1 ? "s" : ""}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-yellow-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Over by {currency}{" "}
                      {Math.abs(calculations.remaining).toLocaleString()}
                    </span>
                  </span>
                  <span className="opacity-90 shrink-0 ml-2">
                    {calculations.periodExpenses.length} expense
                    {calculations.periodExpenses.length !== 1 ? "s" : ""}
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

      {/* Monthly Obligations Summary */}
      {calculations.totalMonthlyObligations > 0 && (
        <Card className="p-5 shadow-xl border-2 border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">
                Total Monthly Obligations
              </h4>
              <p className="text-xs text-muted-foreground">
                EMI + Recurring expenses
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-3xl font-bold tabular-nums">
                {currency}{" "}
                {calculations.totalMonthlyObligations.toLocaleString()}
              </span>
              <Badge variant="outline" className="shrink-0">
                {income > 0
                  ? `${((calculations.totalMonthlyObligations / income) * 100).toFixed(
                      1
                    )}% of income`
                  : "0%"}
              </Badge>
            </div>

            <Progress
              value={
                income > 0
                  ? Math.min(
                      (calculations.totalMonthlyObligations / income) * 100,
                      100
                    )
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
                    {currency} {calculations.totalMonthlyEMI.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Recurring</p>
                  <p className="text-sm font-medium tabular-nums truncate">
                    {currency}{" "}
                    {calculations.totalMonthlyRecurring.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Financial Health Card */}
      {calculations.periodExpenses.length > 0 && (
        <Card
          className="p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
          onClick={onViewHealth}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  Financial Health Score
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {calculations.healthScore.toFixed(0)}/100 •{" "}
                  {healthStatus.label}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          </div>
        </Card>
      )}

      {/* Finance Widgets Grid */}
      {(calculations.activeEMIs.length > 0 ||
        calculations.activeRecurring.length > 0 ||
        savingsGoals.length > 0) && (
        <div
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {/* EMI Tracker Widget */}
          {calculations.activeEMIs.length > 0 && (
            <Card
              className="p-3 md:p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={onViewEMI}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge className="bg-purple-600 text-xs shrink-0">
                    {calculations.activeEMIs.length}
                  </Badge>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    EMI Tracker
                  </p>
                  <p className="text-xl md:text-2xl font-bold tabular-nums mb-2">
                    {currency} {calculations.totalMonthlyEMI.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{calculations.activeEMIs.length} active</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recurring Expenses Widget */}
          {calculations.activeRecurring.length > 0 && (
            <Card
              className="p-3 md:p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={onViewRecurring}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Repeat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge className="bg-blue-600 text-xs shrink-0">
                    {calculations.activeRecurring.length}
                  </Badge>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Recurring
                  </p>
                  <p className="text-xl md:text-2xl font-bold tabular-nums mb-2">
                    {currency}{" "}
                    {calculations.totalMonthlyRecurring.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{calculations.activeRecurring.length} active</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Savings Goals Widget */}
          {savingsGoals.length > 0 && (
            <Card
              className="p-3 md:p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={onViewGoals}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge className="bg-amber-600 text-xs shrink-0">
                    {savingsGoals.length}
                  </Badge>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Savings Goals
                  </p>
                  <p className="text-xl md:text-2xl font-bold tabular-nums mb-2">
                    {calculations.savingsProgress.toFixed(0)}%
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">
                      {currency}{" "}
                      {calculations.totalSavingsCurrent.toLocaleString()} /{" "}
                      {calculations.totalSavingsGoal.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Recent Expenses List */}
      {expenses.length > 0 && (
        <ExpenseList
          expenses={expenses
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5)}
          onDeleteExpense={onDeleteExpense}
          currency={currency}
        />
      )}
    </div>
  );
}
