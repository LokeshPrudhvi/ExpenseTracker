import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Trash2,
  Filter,
  Calendar,
  Wallet,
  X,
  TrendingDown,
} from "lucide-react";
import { type Expense } from "./ExpenseForm";
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

interface SimpleExpensesViewProps {
  expenses: Expense[];
  currency: string;
  onDelete: (id: string) => void;
}

export function SimpleExpensesView({
  expenses,
  currency,
  onDelete,
}: SimpleExpensesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Get current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return (
      expDate.getMonth() === currentMonth &&
      expDate.getFullYear() === currentYear
    );
  });

  // Filter expenses
  const filteredExpenses = monthExpenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique categories
  const categories = Array.from(
    new Set(monthExpenses.map((exp) => exp.category))
  );

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "🍔",
      transportation: "🚗",
      shopping: "🛍️",
      entertainment: "🎮",
      utilities: "💡",
      healthcare: "🏥",
      rent: "🏠",
      education: "📚",
      savings: "💰",
      other: "📋",
    };
    return icons[category] || "📋";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalAmount = sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAllExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageExpense =
    sortedExpenses.length > 0 ? totalAmount / sortedExpenses.length : 0;

  return (
    <div className="space-y-6">
      {/* All Expenses Summary Card */}

      <Card className="p-6 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-3xl font-bold">
              {currency} {totalAllExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </Card>


      {/* Search and Filter */}
      <Card className="p-4 shadow-xl">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Filter by category:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filterCategory === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterCategory(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      filterCategory === category ? "default" : "outline"
                    }
                    className="cursor-pointer capitalize"
                    onClick={() => setFilterCategory(category)}
                  >
                    {getCategoryIcon(category)} {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active Filter */}
          {(searchTerm || filterCategory) && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <span className="text-sm text-blue-900 dark:text-blue-100">
                Active filters: {searchTerm && `"${searchTerm}"`}
                {searchTerm && filterCategory && ", "}
                {filterCategory && `Category: ${filterCategory}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory(null);
                }}
                className="ml-auto h-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Expenses List */}
      {sortedExpenses.length === 0 ? (
        <Card className="p-12 shadow-xl text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="mb-2">No expenses found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterCategory
              ? "Try adjusting your search filters"
              : "Add your first expense to get started"}
          </p>
        </Card>
      ) : (
        <Card className="divide-y shadow-xl">
          {sortedExpenses.map((expense) => (
            <div
              key={expense._id || expense.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-3xl mt-1">
                    {getCategoryIcon(expense.category)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate capitalize">
                      {expense.description || expense.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="tabular-nums">
                      {currency} {expense.amount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(expense._id || expense.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The expense will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
