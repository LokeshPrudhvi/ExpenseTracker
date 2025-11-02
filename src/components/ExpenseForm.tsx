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
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Plus, Calendar } from "lucide-react";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isEMI?: boolean;
  emiEndDate?: string;
  emiStartDate?: string;
}

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  categories: string[];
}

export function ExpenseForm({ onAddExpense, categories }: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isEMI, setIsEMI] = useState(false);
  const [emiStartDate, setEmiStartDate] = useState("");
  const [emiEndDate, setEmiEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); 

    if (!amount || !category || !description) return;
    if (isEMI && !emiEndDate) return;

    const expenseData: Omit<Expense, "id"> = {
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString().split("T")[0],
    };

    if (isEMI) {
      expenseData.isEMI = true;
      expenseData.emiEndDate = emiEndDate;
      expenseData.emiStartDate =
        emiStartDate || new Date().toISOString().split("T")[0];
    }

    onAddExpense(expenseData);

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setIsEMI(false);
    setEmiStartDate("");
    setEmiEndDate("");
  };

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5" />
        Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What did you spend this on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-input-background"
          />
        </div>

        {/* EMI Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="emi-toggle" className="cursor-pointer">
                This is an EMI payment
              </Label>
              <p className="text-xs text-muted-foreground">
                Track recurring monthly installments
              </p>
            </div>
          </div>
          <Switch id="emi-toggle" checked={isEMI} onCheckedChange={setIsEMI} />
        </div>

        {/* EMI Date Fields */}
        {isEMI && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="space-y-2">
              <Label htmlFor="emi-start">EMI Start Date (Optional)</Label>
              <Input
                id="emi-start"
                type="date"
                value={emiStartDate}
                onChange={(e) => setEmiStartDate(e.target.value)}
                className="bg-input-background"
                max={emiEndDate || undefined}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use today's date
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emi-end">EMI End Date *</Label>
              <Input
                id="emi-end"
                type="date"
                value={emiEndDate}
                onChange={(e) => setEmiEndDate(e.target.value)}
                className="bg-input-background"
                required={isEMI}
                min={emiStartDate || new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs text-muted-foreground">
                When will this EMI end?
              </p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          Add Expense
        </Button>
      </form>
    </Card>
  );
}
