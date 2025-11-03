import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Plus, Trash2, Calendar, Repeat, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import axios from "axios";

export interface RecurringExpense {
  _id: string;
  id?: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  notes?: string;
  lastProcessed?: string;
}

interface RecurringExpensesProps {
  expenses: RecurringExpense[];
  onUpdate: (expenses: RecurringExpense[]) => void;
  currency: string;
  categories: Array<{ value: string; label: string; icon: string }>;
  isOnboarding?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export function RecurringExpenses({
  expenses,
  onUpdate,
  currency,
  categories,
  isOnboarding = false,
}: RecurringExpensesProps) {
  const [showDialog, setShowDialog] = useState(isOnboarding); // Start with dialog open if onboarding
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [frequency, setFrequency] = useState("monthly");
  const [notes, setNotes] = useState("");

  // Get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch recurring expenses on mount - SKIP if onboarding
  useEffect(() => {
    if (!isOnboarding) {
      fetchRecurringExpenses();
    }
  }, [isOnboarding]);

  const fetchRecurringExpenses = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/recurring`, config);

      // Normalize _id to id
      const normalizedExpenses = (response.data.data || []).map((exp: any) => ({
        ...exp,
        id: exp._id,
      }));

      onUpdate(normalizedExpenses);
    } catch (error) {
      console.error("Error fetching recurring expenses:", error);
      toast.error("Failed to load recurring expenses");
    }
  };

  const handleAdd = async () => {
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

    const day = parseInt(dayOfMonth);
    if (frequency === "monthly" && (day < 1 || day > 31)) {
      toast.error("Day must be between 1 and 31");
      return;
    }

    setIsLoading(true);
    try {
      const config = getAuthConfig();

      const expenseData = {
        name: description.trim(),
        amount: parseFloat(amount),
        category,
        frequency,
        dayOfMonth: frequency === "monthly" ? day : undefined,
        startDate: new Date().toISOString(),
        isActive: true,
        notes: notes || undefined,
      };

      const response = await axios.post(
        `${API_URL}/recurring`,
        expenseData,
        config
      );

      // Normalize response
      const newExpense = {
        ...response.data.data,
        id: response.data.data._id,
      };

      onUpdate([...expenses, newExpense]);
      toast.success("✅ Recurring expense added!");

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("");
      setDayOfMonth("1");
      setFrequency("monthly");
      setNotes("");

      // Only close dialog if not onboarding
      if (!isOnboarding) {
        setShowDialog(false);
      }
    } catch (error) {
      console.error("Error adding recurring expense:", error);
      toast.error("Failed to add recurring expense");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/recurring/${deleteId}`, config);

      onUpdate(
        expenses.filter((exp) => exp.id !== deleteId && exp._id !== deleteId)
      );
      setDeleteId(null);
      toast.success("Recurring expense deleted");
    } catch (error) {
      console.error("Error deleting recurring expense:", error);
      toast.error("Failed to delete recurring expense");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const config = getAuthConfig();
      const expense = expenses.find((e) => e.id === id || e._id === id);

      if (!expense) return;

      const response = await axios.patch(
        `${API_URL}/recurring/${id}`,
        { isActive: !expense.isActive },
        config
      );

      // Normalize response
      const updatedExpense = {
        ...response.data.data,
        id: response.data.data._id,
      };

      const updated = expenses.map((exp) =>
        exp.id === id || exp._id === id ? updatedExpense : exp
      );
      onUpdate(updated);

      toast.success(
        expense.isActive
          ? "Recurring expense paused"
          : "Recurring expense activated"
      );
    } catch (error) {
      console.error("Error toggling recurring expense:", error);
      toast.error("Failed to update recurring expense");
    }
  };

  const getNextPaymentDate = (dayOfMonth?: number) => {
    if (!dayOfMonth) return "N/A";

    const today = new Date();
    const currentDay = today.getDate();
    const nextDate = new Date(today);

    if (currentDay >= dayOfMonth) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    nextDate.setDate(dayOfMonth);

    return nextDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dayOfMonth?: number) => {
    if (!dayOfMonth) return 0;

    const today = new Date();
    const currentDay = today.getDate();
    const targetDate = new Date(today);

    if (currentDay >= dayOfMonth) {
      targetDate.setMonth(targetDate.getMonth() + 1);
    }

    targetDate.setDate(dayOfMonth);

    const diff = targetDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getCategoryIcon = (cat: string) => {
    const found = categories.find((c) => c.value === cat);
    return found?.icon || "📋";
  };

  const totalMonthly = expenses
    .filter((e) => e.isActive && e.frequency === "monthly")
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      {!isOnboarding && (
        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm text-purple-900 dark:text-purple-100">
            🔄 Set up expenses that repeat regularly, like monthly rent or
            subscriptions.
          </p>
        </div>
      )}

      {/* Summary Card */}
      {!isOnboarding && (
        <Card className="p-6 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Monthly Recurring Total</h3>
              <p className="text-xs text-muted-foreground">
                {
                  expenses.filter(
                    (e) => e.isActive && e.frequency === "monthly"
                  ).length
                }{" "}
                active recurring expenses
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-lg px-4 py-2">
              {currency} {totalMonthly.toLocaleString()}
            </Badge>
          </div>
          <Button
            onClick={() => setShowDialog(true)}
            className="w-full"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Recurring Expense
          </Button>
        </Card>
      )}

      {/* Expenses List */}
      {!isOnboarding && expenses.length === 0 ? (
        <Card className="p-8 text-center shadow-xl">
          <Repeat className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h4>No Recurring Expenses</h4>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Add expenses that repeat regularly, like rent, EMIs, or
            subscriptions
          </p>
          <Button onClick={() => setShowDialog(true)} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Recurring Expense
          </Button>
        </Card>
      ) : !isOnboarding && expenses.length > 0 ? (
        <div className="space-y-3">
          {expenses.map((expense) => {
            const daysUntil =
              expense.frequency === "monthly"
                ? getDaysUntil(expense.dayOfMonth)
                : 0;
            const isUpcoming = daysUntil <= 7 && daysUntil > 0;

            return (
              <Card
                key={expense._id}
                className={`p-4 shadow-lg ${
                  !expense.isActive ? "opacity-60" : ""
                } ${
                  isUpcoming && expense.isActive
                    ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/10"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl mt-1">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4>{expense.name}</h4>
                        {!expense.isActive && (
                          <Badge variant="outline" className="text-xs">
                            Paused
                          </Badge>
                        )}
                        {isUpcoming && expense.isActive && (
                          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-0 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Due in {daysUntil} days
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {expense.frequency === "monthly"
                              ? `Every ${expense.dayOfMonth} of month`
                              : expense.frequency.charAt(0).toUpperCase() +
                                expense.frequency.slice(1)}
                          </span>
                        </div>
                        <span>•</span>
                        <span className="capitalize">{expense.category}</span>
                      </div>
                      {expense.frequency === "monthly" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Next: {getNextPaymentDate(expense.dayOfMonth)}
                        </p>
                      )}
                      {expense.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">
                      {currency} {expense.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={expense.isActive ? "outline" : "default"}
                        onClick={() => handleToggle(expense.id || expense._id)}
                        disabled={isLoading}
                      >
                        {expense.isActive ? "Pause" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(expense.id || expense._id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {/* Add Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Recurring Expense</DialogTitle>
            <DialogDescription>
              Set up an expense that repeats regularly, like monthly rent or
              subscriptions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Car EMI, Rent, Netflix"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {currency}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2 bg-input-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-2 bg-input-background">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === "monthly" && (
              <div>
                <Label htmlFor="dayOfMonth">Payment Day (1-31)</Label>
                <Input
                  id="dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  className="mt-2"
                  placeholder="e.g., 1, 15, 30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Day of the month when this payment is due
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Recurring Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the recurring expense. Past expenses created from
              this won't be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
