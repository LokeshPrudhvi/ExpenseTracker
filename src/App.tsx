import { useState, useEffect } from "react";
import axios from "axios";
import { type Expense } from "./components/ExpenseForm";
import { AuthScreen } from "./components/AuthScreen";
import { QuickOnboarding } from "./components/QuickOnboarding";
import { FirstExpenseWelcome } from "./components/FirstExpenseWelcome";
import { EnhancedMainDashboard } from "./components/EnhancedMainDashboard";
import { FinancialHealthDashboard } from "./components/FinancialHealthDashboard";
import { SimpleExpensesView } from "./components/SimpleExpensesView";
import { SimpleAnalytics } from "./components/SimpleAnalytics";
import { MoreSection } from "./components/MoreSection";
import { QuickExpenseDialog } from "./components/QuickExpenseDialog";
import { MobileNav } from "./components/MobileNav";
import { DesktopNav } from "./components/DesktopNav";
import { ProfilePage } from "./components/ProfilePage";
import { SavingsGoals } from "./components/SavingsGoals";
import { EMITracker } from "./components/EMITracker";
import {
  RecurringExpenses,
  type RecurringExpense,
} from "./components/RecurringExpenses";
import {
  CustomCategories,
  type CustomCategory,
} from "./components/CustomCategories";
import { IncomeSetter } from "./components/IncomeSetter";
import { CurrencySelector } from "./components/CurrencySelector";
import { DataManagement } from "./components/DataManagement";
import { HelpGuide } from "./components/HelpGuide";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { ArrowLeft, Wallet } from "lucide-react";
import { toast } from "sonner";
import { EXPENSE_CATEGORIES } from "./utils/constants";

const API_URL = "https://expensetracker-vt47.onrender.com/api/auth/api";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  monthlyIncome: number;
  currency: string;
  onboardingComplete: boolean;
  createdAt: string;
}

interface SavingsGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFirstExpenseWelcome, setShowFirstExpenseWelcome] = useState(false);

  // Data State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    []
  );
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);

  // UI State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQuickExpense, setShowQuickExpense] = useState(false);
  const [subView, setSubView] = useState<string | null>(null);

  // Get auth config helper
  const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await axios.get(`${API_URL}/auth/me`, getAuthConfig());

      const userData = response.data.data;

      setUserProfile({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        monthlyIncome: userData.monthlyIncome || 0,
        currency: userData.currency || "USD",
        onboardingComplete: userData.onboardingComplete || false, // ADD THIS LINE
        createdAt: userData.createdAt,
      });

      setIncome(userData.monthlyIncome || 0);
      setCurrency(userData.currency || "USD");
      setIsAuthenticated(true);

      // Fetch all user data
      await fetchAllData();

      // Don't show onboarding on page refresh - user is already logged in
    } catch (error: any) {
      console.error("Auth check failed:", error);
      // Token expired or invalid - clear it
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all data from MongoDB
  const fetchAllData = async () => {
    try {
      const config = getAuthConfig();

      const [expensesRes, goalsRes, recurringRes] = await Promise.all([
        axios.get(`${API_URL}/expenses`, config),
        axios.get(`${API_URL}/savings`, config),
        axios.get(`${API_URL}/recurring`, config),
      ]);

      setExpenses(expensesRes.data.data || []);
      setSavingsGoals(goalsRes.data.data || []);
      setRecurringExpenses(recurringRes.data.data || []);

      // Check onboarding status
      const firstExpenseAdded = localStorage.getItem("firstExpenseAdded");
      if (
        (expensesRes.data.data || []).length === 0 &&
        firstExpenseAdded !== "true"
      ) {
        setShowFirstExpenseWelcome(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load some data");
    }
  };

  // Handlers
  const handleAuthSuccess = async (
    profile: any,
    isNewUser: boolean = false
  ) => {
    try {
      setUserProfile({
        id: profile.id || profile._id,
        email: profile.email,
        name: profile.name,
        monthlyIncome: profile.monthlyIncome || 0,
        currency: profile.currency || "USD",
        onboardingComplete: profile.onboardingComplete || false,
        createdAt: profile.createdAt,
      });

      setIncome(profile.monthlyIncome || 0);
      setCurrency(profile.currency || "USD");
      setIsAuthenticated(true);

      // Fetch all data after login
      await fetchAllData();

      // Show onboarding ONLY for new users who haven't completed it
      if (isNewUser && !profile.onboardingComplete) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Authentication error. Please try again.");
    }
  };
  const handleOnboardingComplete = async (data: {
    income: number;
    currency: string;
  }) => {
    try {
      const config = getAuthConfig();

      // Update user profile in backend
      await axios.put(
        `${API_URL}/auth/profile`,
        {
          monthlyIncome: data.income,
          currency: data.currency,
        },
        config
      );

      setIncome(data.income);
      setCurrency(data.currency);

      // Update userProfile state
      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              monthlyIncome: data.income,
              currency: data.currency,
              onboardingComplete: true,
            }
          : null
      );

      setShowOnboarding(false);
      setShowFirstExpenseWelcome(true);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleFirstExpenseComplete = (expenseData: Omit<Expense, "id">) => {
    addExpense(expenseData);
    setShowFirstExpenseWelcome(false);
    localStorage.setItem("firstExpenseAdded", "true");
    toast.success("🎉 Great! Your first expense is tracked!");
  };

  const handleFirstExpenseSkip = () => {
    setShowFirstExpenseWelcome(false);
    localStorage.setItem("firstExpenseAdded", "true");
    toast.success("You can add expenses anytime from the dashboard!");
  };

  const addExpense = async (expenseData: Omit<Expense, "id">) => {
    try {
      const config = getAuthConfig();

      const response = await axios.post(
        `${API_URL}/expenses`,
        expenseData,
        config
      );

      setExpenses((prev) => [...prev, response.data.data]);
      toast.success("Expense added successfully! 💰");

      // Trigger a re-fetch of all data to update dashboard
      await fetchAllData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const config = getAuthConfig();

      await axios.delete(`${API_URL}/expenses/${id}`, config);

      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      toast.success("Expense deleted");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleImportData = (data: {
    expenses: Expense[];
    budget?: number;
    income: number;
    currency: string;
  }) => {
    // This would need backend implementation to bulk import
    toast.info("Import feature needs backend implementation");
  };

  const handleClearAll = async () => {
    try {
      const config = getAuthConfig();

      // Delete all expenses
      await Promise.all(
        expenses.map((exp) =>
          axios.delete(`${API_URL}/expenses/${exp._id}`, config)
        )
      );

      // Delete all savings goals
      await Promise.all(
        savingsGoals.map((goal) =>
          axios.delete(`${API_URL}/savings/${goal._id}`, config)
        )
      );

      // Delete all recurring expenses
      await Promise.all(
        recurringExpenses.map((rec) =>
          axios.delete(`${API_URL}/recurring/${rec._id}`, config)
        )
      );

      setExpenses([]);
      setSavingsGoals([]);
      setRecurringExpenses([]);
      toast.success("All data cleared");
    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Failed to clear all data");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setActiveTab("dashboard");
    setSubView(null);
    setShowOnboarding(false);
    setShowFirstExpenseWelcome(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("onboardingComplete");
    localStorage.removeItem("firstExpenseAdded");
    toast.success("Logged out successfully");
  };

  const handleCompleteReset = () => {
    // Clear all local storage
    localStorage.clear();

    // Reset all state
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowOnboarding(false);
    setShowFirstExpenseWelcome(false);
    setExpenses([]);
    setIncome(0);
    setCurrency("USD");
    setSavingsGoals([]);
    setCustomCategories([]);
    setRecurringExpenses([]);
    setActiveTab("dashboard");
    setSubView(null);

    toast.success("🔄 Complete reset! Starting fresh from login screen");
  };

  const handleUpdateProfile = async (profile: any) => {
    try {
      const config = getAuthConfig();

      await axios.put(
        `${API_URL}/auth/profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        config
      );

      setUserProfile((prev) => (prev ? { ...prev, ...profile } : null));
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSubView(null);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4 animate-pulse">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show onboarding if needed
  if (showOnboarding && userProfile) {
    return (
      <QuickOnboarding
        onComplete={handleOnboardingComplete}
        userName={userProfile.name}
      />
    );
  }

  // Show first expense welcome screen
  if (showFirstExpenseWelcome && userProfile) {
    return (
      <FirstExpenseWelcome
        userName={userProfile.name}
        currency={currency}
        onComplete={handleFirstExpenseComplete}
        onSkip={handleFirstExpenseSkip}
      />
    );
  }

  // Calculate current month total for budget
  const currentMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return (
      expDate.getMonth() === now.getMonth() &&
      expDate.getFullYear() === now.getFullYear()
    );
  });
  const budget = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Sub-view renderer
  const renderSubView = () => {
    switch (subView) {
      case "profile":
        return (
          userProfile && (
            <ProfilePage
              profile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              onCompleteReset={handleCompleteReset}
            />
          )
        );

      case "goals":
        return (
          <SavingsGoals
            goals={savingsGoals}
            onUpdateGoals={setSavingsGoals}
            currency={currency}
          />
        );

      case "emi":
        return <EMITracker currency={currency} />;

      case "settings":
        return (
          <Card className="p-6 shadow-xl">
            <h3 className="mb-6 text-lg font-semibold">Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 font-medium">Currency</h4>
                <CurrencySelector value={currency} onChange={setCurrency} />
              </div>
              <div>
                <h4 className="mb-3 font-medium">Monthly Income</h4>
                <IncomeSetter
                  currentIncome={income}
                  onUpdateIncome={setIncome}
                  currency={currency}
                />
              </div>
            </div>
          </Card>
        );

      case "export":
        return (
          <DataManagement
            expenses={expenses}
            budget={budget}
            income={income}
            currency={currency}
            onImport={handleImportData}
            onClearAll={handleClearAll}
          />
        );

      case "help":
        return <HelpGuide />;

      case "health":
        return (
          <FinancialHealthDashboard
            expenses={expenses}
            income={income}
            currency={currency}
            savingsGoals={savingsGoals}
          />
        );

      case "recurring":
        const allCategories = [...EXPENSE_CATEGORIES, ...customCategories];
        return (
          <RecurringExpenses
            expenses={recurringExpenses}
            onUpdate={setRecurringExpenses}
            currency={currency}
            categories={allCategories}
          />
        );

      case "categories":
        return (
          <CustomCategories
            categories={customCategories}
            onUpdate={setCustomCategories}
          />
        );

      default:
        return null;
    }
  };

  // Main content renderer
  const renderContent = () => {
    if (subView) {
      return renderSubView();
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <EnhancedMainDashboard
            income={income}
            currency={currency}
            expenses={expenses}
            onDeleteExpense={deleteExpense} // ADD THIS LINE
            onQuickAdd={() => setShowQuickExpense(true)}
            onViewExpenses={() => setActiveTab("expenses")}
            onViewAnalytics={() => setActiveTab("analytics")}
            onViewGoals={() => setSubView("goals")}
            onViewHealth={() => setSubView("health")}
            onViewRecurring={() => setSubView("recurring")}
            onViewEMI={() => setSubView("emi")}
          />
        );

      case "expenses":
        return (
          <SimpleExpensesView
            expenses={expenses}
            currency={currency}
            onDelete={deleteExpense}
          />
        );

      case "analytics":
        return (
          <SimpleAnalytics
            expenses={expenses}
            budget={budget}
            income={income}
            currency={currency}
          />
        );

      case "settings":
        return (
          userProfile && (
            <MoreSection
              userProfile={userProfile}
              income={income}
              budget={budget}
              currency={currency}
              expenses={expenses}
              onViewProfile={() => setSubView("profile")}
              onViewSettings={() => setSubView("settings")}
              onViewGoals={() => setSubView("goals")}
              onViewEMI={() => setSubView("emi")}
              onViewRecurring={() => setSubView("recurring")}
              onViewCategories={() => setSubView("categories")}
              onExport={() => setSubView("export")}
              onImport={() => setSubView("export")}
              onClearData={() => setSubView("export")}
              onHelp={() => setSubView("help")}
              onLogout={handleLogout}
            />
          )
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-blue-50/95 to-indigo-100/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm border-b border-blue-200/50 dark:border-gray-700/50">
        <div className="py-4 px-4">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-primary font-semibold">
                    Expense Tracker
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Welcome, {userProfile?.name.split(" ")[0]}!
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              {!subView ? (
                <>
                  <DesktopNav
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onQuickAdd={() => setShowQuickExpense(true)}
                  />
                  {/* Mobile - Date */}
                  <div className="md:hidden text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubView(null)}
                  className="hidden md:flex"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24 md:pb-8 pt-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {!subView ? (
        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onQuickAdd={() => setShowQuickExpense(true)}
        />
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
          <div className="bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900 dark:to-transparent pt-8 pb-safe">
            <div className="px-4 pb-4">
              <Button
                onClick={() => setSubView(null)}
                className="w-full h-12 shadow-2xl"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Expense Dialog */}
      <QuickExpenseDialog
        open={showQuickExpense}
        onClose={() => setShowQuickExpense(false)}
        onAdd={addExpense}
        currency={currency}
        customCategories={customCategories}
      />
    </div>
  );
}
