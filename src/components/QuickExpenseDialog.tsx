import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
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
import { DollarSign, Tag, Calendar, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface QuickExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
  currency: string;
  customCategories?: Array<{ value: string; label: string; icon: string }>;
}

const CATEGORIES = [
  { id: "food", name: "Food & Groceries", icon: "🍔" },
  { id: "transportation", name: "Transportation", icon: "🚗" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
  { id: "entertainment", name: "Entertainment", icon: "🎮" },
  { id: "utilities", name: "Utilities", icon: "💡" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "rent", name: "Rent/Mortgage", icon: "🏠" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "savings", name: "Savings", icon: "💰" },
  { id: "other", name: "Other", icon: "📋" },
];

export function QuickExpenseDialog({
  open,
  onClose,
  onAdd,
  currency,
  customCategories = [],
}: QuickExpenseDialogProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Merge default and custom categories
  const allCategories = [
    ...CATEGORIES.map((cat) => ({
      value: cat.id,
      label: cat.name,
      icon: cat.icon,
    })),
    ...customCategories,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const selectedCat = allCategories.find((c) => c.value === category);
    onAdd({
      amount: parseFloat(amount),
      category,
      description: description || `${selectedCat?.label || category} expense`,
      date,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            Quick Add Expense
          </DialogTitle>
          <DialogDescription>
            Add a new expense quickly with amount, category, and optional
            details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="quick-amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount ({currency})
            </Label>
            <Input
              id="quick-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="quick-category" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="quick-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description (Optional) */}
          <div className="space-y-2">
            <Label
              htmlFor="quick-description"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Description (Optional)
            </Label>
            <Input
              id="quick-description"
              placeholder="E.g., Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="quick-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="quick-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
