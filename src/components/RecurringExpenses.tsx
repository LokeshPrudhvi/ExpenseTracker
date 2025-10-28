import { useState } from "react";
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

export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  dayOfMonth: number; // 1-31
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

interface RecurringExpensesProps {
  expenses: RecurringExpense[];
  onUpdate: (expenses: RecurringExpense[]) => void;
  currency: string;
  categories: Array<{ value: string; label: string; icon: string }>;
}

export function RecurringExpenses({
  expenses,
  onUpdate,
  currency,
  categories,
}: RecurringExpensesProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("1");

  const handleAdd = () => {
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
    if (day < 1 || day > 31) {
      toast.error("Day must be between 1 and 31");
      return;
    }

    const newExpense: RecurringExpense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      dayOfMonth: day,
      isActive: true,
      startDate: new Date().toISOString(),
    };

    onUpdate([...expenses, newExpense]);
    toast.success("✅ Recurring expense added!");

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("");
    setDayOfMonth("1");
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(expenses.filter((exp) => exp.id !== id));
    setDeleteId(null);
    toast.success("Recurring expense deleted");
  };

  const handleToggle = (id: string) => {
    const updated = expenses.map((exp) =>
      exp.id === id ? { ...exp, isActive: !exp.isActive } : exp
    );
    onUpdate(updated);
    const expense = expenses.find((e) => e.id === id);
    toast.success(
      expense?.isActive
        ? "Recurring expense paused"
        : "Recurring expense activated"
    );
  };

  const getNextPaymentDate = (dayOfMonth: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    const nextDate = new Date(today);

    if (currentDay >= dayOfMonth) {
      // Next month
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    nextDate.setDate(dayOfMonth);

    return nextDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dayOfMonth: number) => {
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
    .filter((e) => e.isActive)
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <p className="text-sm text-purple-900 dark:text-purple-100">
          🔄 Set up expenses that repeat every month on specific dates (e.g.,
          Car EMI on 4th, Rent on 1st)
        </p>
      </div>

      {/* Summary Card */}
      <Card className="p-6 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3>Monthly Recurring Total</h3>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.isActive).length} active recurring
              expenses
            </p>
          </div>
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-lg px-4 py-2">
            {currency} {totalMonthly.toLocaleString()}
          </Badge>
        </div>
        <Button onClick={() => setShowDialog(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Recurring Expense
        </Button>
      </Card>

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <Card className="p-8 text-center shadow-xl">
          <Repeat className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h4>No Recurring Expenses</h4>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Add expenses that repeat monthly, like rent, EMIs, or
            subscriptions
          </p>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Recurring Expense
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => {
            const daysUntil = getDaysUntil(expense.dayOfMonth);
            const isUpcoming = daysUntil <= 7;

            return (
              <Card
                key={expense.id}
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
                        <h4>{expense.description}</h4>
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
                          <span>Every {expense.dayOfMonth}</span>
                          <span className="text-xs">
                            of the month
                          </span>
                        </div>
                        <span>•</span>
                        <span className="capitalize">{expense.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Next: {getNextPaymentDate(expense.dayOfMonth)}
                      </p>
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
                        onClick={() => handleToggle(expense.id)}
                      >
                        {expense.isActive ? "Pause" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(expense.id)}
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
      )}

      {/* Add Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Recurring Expense</DialogTitle>
            <DialogDescription>
              Set up an expense that repeats regularly, like monthly rent or subscriptions.
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Recurring Expense</Button>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
