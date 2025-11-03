import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Wallet, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { CurrencySelector } from "./CurrencySelector";
import { EMITracker } from "./EMITracker";
import { RecurringExpenses, RecurringExpense } from "./RecurringExpenses";

interface QuickOnboardingProps {
  onComplete: (data: {
    income: number;
    currency: string;
    emis?: any[];
    recurringExpenses?: RecurringExpense[];
  }) => void;
  userName: string;
  categories: Array<{ value: string; label: string; icon: string }>;
}

type OnboardingStep = "income" | "emi" | "recurring" | "complete";

export function QuickOnboarding({
  onComplete,
  userName,
  categories,
}: QuickOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("income");
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [emis, setEmis] = useState<any[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);

  const firstName = userName.split(" ")[0];

  const handleIncomeComplete = () => {
    const incomeValue = parseFloat(income);
    if (!income || incomeValue <= 0) {
      toast.error("Please enter your monthly income");
      return;
    }
    setCurrentStep("emi");
  };

  const handleSkipEMI = () => {
    setCurrentStep("recurring");
  };

  const handleEMIComplete = () => {
    setCurrentStep("recurring");
  };

  const handleSkipRecurring = () => {
    setCurrentStep("complete");
  };

  const handleRecurringComplete = () => {
    setCurrentStep("complete");
  };

  const handleFinalComplete = () => {
    const incomeValue = parseFloat(income);
    onComplete({
      income: incomeValue,
      currency,
      emis,
      recurringExpenses,
    });
    toast.success("🎉 All set! Let's start tracking your expenses");
  };

  const handleBack = () => {
    if (currentStep === "emi") {
      setCurrentStep("income");
    } else if (currentStep === "recurring") {
      setCurrentStep("emi");
    } else if (currentStep === "complete") {
      setCurrentStep("recurring");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step{" "}
              {currentStep === "income"
                ? 1
                : currentStep === "emi"
                ? 2
                : currentStep === "recurring"
                ? 3
                : 4}{" "}
              of 4
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{
                width:
                  currentStep === "income"
                    ? "25%"
                    : currentStep === "emi"
                    ? "50%"
                    : currentStep === "recurring"
                    ? "75%"
                    : "100%",
              }}
            />
          </div>
        </div>

        <Card className="p-8 shadow-xl">
          {/* Income Step */}
          {currentStep === "income" && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl mb-2">Hi {firstName}! 👋</h2>
                <p className="text-muted-foreground text-lg">
                  Let's set up your expense tracker
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3>Tell us about your income</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    We'll help you track your expenses and make sure you're
                    staying within your means. We recommend saving at least 20%
                    of your income each month.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currency-select">Currency</Label>
                      <CurrencySelector
                        value={currency}
                        onChange={setCurrency}
                      />
                    </div>

                    <div>
                      <Label htmlFor="income-input">Monthly Income</Label>
                      <Input
                        id="income-input"
                        type="number"
                        placeholder="e.g., 5000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="text-xl h-14 mt-2"
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Your total monthly income after taxes
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm mb-2 flex items-center gap-2">
                    💡 Financial Health Tips
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Aim to save at least 20% of your income</li>
                    <li>• Keep essential expenses under 50% of income</li>
                    <li>• Build an emergency fund (3-6 months expenses)</li>
                    <li>• Avoid spending more than you earn</li>
                  </ul>
                </div>

                <Button
                  onClick={handleIncomeComplete}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* EMI Step */}
          {currentStep === "emi" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Add Your EMIs 💳</h2>
                <p className="text-muted-foreground text-lg">
                  Track your loans and monthly EMI payments (optional)
                </p>
              </div>

              <div className="mb-6">
                <EMITracker currency={currency} isOnboarding={true} />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSkipEMI}
                  variant="ghost"
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleEMIComplete}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Recurring Expenses Step */}
          {currentStep === "recurring" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Add Recurring Expenses 🔄
                </h2>
                <p className="text-muted-foreground text-lg">
                  Set up expenses that repeat regularly like rent or
                  subscriptions (optional)
                </p>
              </div>

              <div className="mb-6">
                <RecurringExpenses
                  expenses={recurringExpenses}
                  onUpdate={setRecurringExpenses}
                  currency={currency}
                  categories={categories}
                  isOnboarding={true}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSkipRecurring}
                  variant="ghost"
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleRecurringComplete}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">You're All Set! 🎉</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Your expense tracker is ready to go. Let's start managing your
                finances!
              </p>

              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-8">
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Monthly Income:
                    </span>
                    <span className="font-semibold">
                      {currency} {parseFloat(income).toLocaleString()}
                    </span>
                  </div>
                  {emis.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">EMIs Added:</span>
                      <span className="font-semibold">{emis.length}</span>
                    </div>
                  )}
                  {recurringExpenses.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Recurring Expenses:
                      </span>
                      <span className="font-semibold">
                        {recurringExpenses.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleFinalComplete}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                >
                  Start Tracking
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
