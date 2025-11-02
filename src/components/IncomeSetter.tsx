import { useState } from "react";
import axios from "axios";
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

const API_URL = import.meta.env.VITE_API_URL;

export function IncomeSetter({
  currentIncome,
  onUpdateIncome,
  currency,
}: IncomeSetterProps) {
  const [income, setIncome] = useState(currentIncome.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome = parseFloat(income);

    if (isNaN(newIncome) || newIncome < 0) {
      toast.error("Please enter a valid income amount");
      return;
    }

    setIsLoading(true);
    try {
      const config = getAuthConfig();

      // Update income in backend
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        { monthlyIncome: newIncome },
        config
      );

      // Update local state
      onUpdateIncome(newIncome);
      setIsEditing(false);
      toast.success("Monthly income updated!");
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income");
    } finally {
      setIsLoading(false);
    }
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
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
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            <Check className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Income"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIncome(currentIncome.toString());
              setIsEditing(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
