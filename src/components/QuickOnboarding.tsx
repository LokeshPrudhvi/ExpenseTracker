import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Wallet, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { CurrencySelector } from "./CurrencySelector";

interface QuickOnboardingProps {
  onComplete: (data: { income: number; currency: string }) => void;
  userName: string;
}

export function QuickOnboarding({ onComplete, userName }: QuickOnboardingProps) {
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState("USD");

  const firstName = userName.split(' ')[0];

  const handleComplete = () => {
    const incomeValue = parseFloat(income);
    if (!income || incomeValue <= 0) {
      toast.error("Please enter your monthly income");
      return;
    }

    onComplete({ income: incomeValue, currency });
    toast.success("🎉 All set! Let's start tracking your expenses");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
      <Card className="p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl mb-2">Hi {firstName}! 👋</h2>
          <p className="text-muted-foreground text-lg">
            Let's set up your expense tracker
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3>Tell us about your income</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              We'll help you track your expenses and make sure you're staying within your means.
              We recommend saving at least 20% of your income each month.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currency-select">Currency</Label>
                <CurrencySelector value={currency} onChange={setCurrency} />
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
            onClick={handleComplete} 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Tracking
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}
