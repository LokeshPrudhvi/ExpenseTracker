import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DollarSign, Check } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { toast } from "sonner@2.0.3";

interface IncomeSetterProps {
  currentIncome: number;
  onUpdateIncome: (income: number) => void;
  currency: string;
}

export function IncomeSetter({ currentIncome, onUpdateIncome, currency }: IncomeSetterProps) {
  const [income, setIncome] = useState(currentIncome.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome = parseFloat(income);
    
    if (isNaN(newIncome) || newIncome < 0) {
      toast.error('Please enter a valid income amount');
      return;
    }

    onUpdateIncome(newIncome);
    setIsEditing(false);
    toast.success('Monthly income updated!');
  };

  if (!isEditing) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-green-500">
                {formatCurrency(currentIncome, currency)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          <h3>Set Monthly Income</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="income">Income Amount ({currency})</Label>
          <Input
            id="income"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="bg-input-background"
            autoFocus
          />
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            Save Income
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIncome(currentIncome.toString());
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
