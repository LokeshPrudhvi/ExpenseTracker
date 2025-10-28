import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, Receipt, Calendar } from "lucide-react";
import type { Expense } from "./ExpenseForm";
import { formatCurrency } from "../utils/currency";
import { ExpenseSearch } from "./ExpenseSearch";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  currency: string;
  categories?: string[];
}

export function ExpenseList({ expenses, onDeleteExpense, currency, categories = [] }: ExpenseListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string } | null>(null);

  // Filter expenses based on search and filters
  let filteredExpenses = expenses;

  if (searchQuery) {
    filteredExpenses = filteredExpenses.filter(expense =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory !== 'all') {
    filteredExpenses = filteredExpenses.filter(expense =>
      expense.category === selectedCategory
    );
  }

  if (dateFilter) {
    filteredExpenses = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = dateFilter.start ? new Date(dateFilter.start) : null;
      const end = dateFilter.end ? new Date(dateFilter.end) : null;

      if (start && expenseDate < start) return false;
      if (end && expenseDate > end) return false;
      return true;
    });
  }

  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      rent: 'bg-chart-1',
      food: 'bg-chart-2',
      transportation: 'bg-chart-3',
      utilities: 'bg-chart-4',
      entertainment: 'bg-chart-5',
      healthcare: 'bg-destructive',
      shopping: 'bg-purple-500',
      education: 'bg-blue-500',
      savings: 'bg-green-500',
      other: 'bg-muted-foreground'
    };
    return colors[category as keyof typeof colors] || 'bg-muted-foreground';
  };

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5" />
        Recent Expenses
        {filteredExpenses.length !== expenses.length && (
          <Badge variant="secondary" className="ml-2">
            {filteredExpenses.length} of {expenses.length}
          </Badge>
        )}
      </h2>
      
      {categories.length > 0 && (
        <div className="mb-4">
          <ExpenseSearch
            categories={categories}
            onSearch={setSearchQuery}
            onCategoryFilter={setSelectedCategory}
            onDateFilter={setDateFilter}
            selectedCategory={selectedCategory}
          />
        </div>
      )}
      
      {sortedExpenses.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {expenses.length === 0 ? 'No expenses recorded yet' : 'No expenses match your filters'}
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge 
                    variant="secondary" 
                    className={`${getCategoryColor(expense.category)} text-white border-0 capitalize`}
                  >
                    {expense.category}
                  </Badge>
                  {expense.isEMI && (
                    <Badge variant="outline" className="border-blue-500 text-blue-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      EMI
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {formatDate(expense.date)}
                  </span>
                </div>
                <p className="truncate">{expense.description}</p>
                {expense.isEMI && expense.emiEndDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    EMI ends: {new Date(expense.emiEndDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <span className="font-medium">{formatCurrency(expense.amount, currency)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}