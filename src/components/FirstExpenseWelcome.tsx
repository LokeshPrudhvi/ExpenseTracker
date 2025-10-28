import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  ShoppingCart, 
  Home, 
  Car, 
  Utensils, 
  Heart, 
  Sparkles,
  TrendingUp,
  Wifi,
  GraduationCap,
  ShoppingBag,
  Coffee,
  Film
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface FirstExpenseWelcomeProps {
  userName: string;
  currency: string;
  onComplete: (expense: Omit<Expense, 'id'>) => void;
  onSkip: () => void;
}

const categories = [
  { value: 'food', label: 'Food & Dining', icon: Utensils, color: 'text-orange-500' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-500' },
  { value: 'transport', label: 'Transportation', icon: Car, color: 'text-blue-500' },
  { value: 'housing', label: 'Housing', icon: Home, color: 'text-green-500' },
  { value: 'entertainment', label: 'Entertainment', icon: Film, color: 'text-purple-500' },
  { value: 'healthcare', label: 'Healthcare', icon: Heart, color: 'text-red-500' },
  { value: 'utilities', label: 'Utilities', icon: Wifi, color: 'text-cyan-500' },
  { value: 'education', label: 'Education', icon: GraduationCap, color: 'text-indigo-500' },
  { value: 'coffee', label: 'Coffee & Snacks', icon: Coffee, color: 'text-amber-500' },
  { value: 'other', label: 'Other', icon: TrendingUp, color: 'text-gray-500' },
];

const quickExpenseTemplates = [
  { description: 'Lunch', amount: 15, category: 'food' },
  { description: 'Coffee', amount: 5, category: 'coffee' },
  { description: 'Uber ride', amount: 12, category: 'transport' },
  { description: 'Groceries', amount: 50, category: 'shopping' },
];

export function FirstExpenseWelcome({ userName, currency, onComplete, onSkip }: FirstExpenseWelcomeProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const expense = {
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    };

    onComplete(expense);
  };

  const handleQuickTemplate = (template: typeof quickExpenseTemplates[0]) => {
    setDescription(template.description);
    setAmount(template.amount.toString());
    setCategory(template.category);
  };

  const getCurrencySymbol = (curr: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
      AUD: 'A$', CAD: 'C$', CNY: '¥', KRW: '₩', BRL: 'R$'
    };
    return symbols[curr] || curr;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-primary mb-2">You're All Set, {userName.split(' ')[0]}! 🎉</h1>
          <p className="text-muted-foreground">
            Let's add your first expense to get started
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Tip:</strong> Start simple! Add any recent purchase - coffee, lunch, or transport. You can add more later.
          </p>
        </div>

        {/* Quick Templates */}
        <Card className="p-4 shadow-xl mb-6">
          <p className="text-sm mb-3">Quick Templates:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickExpenseTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickTemplate(template)}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <span className="text-xs">{template.description}</span>
                <span className="font-semibold">{getCurrencySymbol(currency)}{template.amount}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Main Form */}
        <Card className="p-6 shadow-xl">
          <h3 className="mb-6">Add Your First Expense</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">What did you buy?</Label>
              <Input
                id="description"
                placeholder="e.g., Lunch at cafe, Uber to office, Morning coffee..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">How much did it cost?</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {getCurrencySymbol(currency)}
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-base"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${cat.color}`} />
                          {cat.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Current Date Display */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                📅 Date: <strong>{new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</strong>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add First Expense
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onSkip}
                className="sm:w-auto"
                size="lg"
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </Card>

        {/* Bottom Tip */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-900 dark:text-green-100 text-center">
            ✨ Don't worry! You can add, edit, or delete expenses anytime from the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
