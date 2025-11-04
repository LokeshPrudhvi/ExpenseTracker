import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
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
import {
  Calendar,
  CreditCard,
  TrendingDown,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import axios from "axios";

interface EMI {
  _id: string;
  id?: string;
  name: string;
  monthlyEMI: number;
  totalAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  dueDate: number;
  category: string;
  isActive: boolean;
  interestRate?: number;
  notes?: string;
}

interface EMITrackerProps {
  currency: string;
  isOnboarding?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export function EMITracker({
  currency,
  isOnboarding = false,
}: EMITrackerProps) {
  const [emis, setEmis] = useState<EMI[]>([]);
  const [isAdding, setIsAdding] = useState(isOnboarding);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newEMI, setNewEMI] = useState({
    name: "",
    monthlyEMI: "",
    startDate: "",
    endDate: "",
    dueDate: "1",
    category: "EMI",
    interestRate: "0",
    notes: "",
  });

  // NEW: Helper to calculate months between dates
  const calculateMonthsBetween = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );
  };

  // NEW: Calculate total amount based on monthly EMI and dates
  const calculateTotalAmount = (): string => {
    if (!newEMI.monthlyEMI || !newEMI.startDate || !newEMI.endDate) {
      return "0";
    }
    const monthlyEMI = parseFloat(newEMI.monthlyEMI);
    const months = calculateMonthsBetween(newEMI.startDate, newEMI.endDate);
    return (monthlyEMI * months).toFixed(2);
  };

  // Fetch EMIs on mount
  useEffect(() => {
    if (!isOnboarding) {
      fetchEMIs();
    }
  }, [isOnboarding]);

  const fetchEMIs = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/emi`, config);

      const normalizedEMIs = (response.data.data || []).map((emi: any) => ({
        ...emi,
        id: emi._id,
      }));

      setEmis(normalizedEMIs);
    } catch (error) {
      console.error("Error fetching EMIs:", error);
      toast.error("Failed to load EMIs");
    }
  };

  const today = new Date();
  const activeEMIs = emis.filter((emi) => {
    const endDate = new Date(emi.endDate);
    return endDate >= today && emi.isActive;
  });

  const sortedEMIs = [...activeEMIs].sort((a, b) => {
    const dateA = new Date(a.endDate);
    const dateB = new Date(b.endDate);
    return dateA.getTime() - dateB.getTime();
  });

  const calculateMonthsRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    const progress = (elapsed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const totalMonthlyEMI = activeEMIs.reduce(
    (sum, emi) => sum + emi.monthlyEMI,
    0
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const handleAddEMI = async (e: React.FormEvent) => {
    e.preventDefault();

    // NEW: Check only required fields (removed totalAmount)
    if (
      !newEMI.name ||
      !newEMI.monthlyEMI ||
      !newEMI.startDate ||
      !newEMI.endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // NEW: Calculate total amount
    const totalAmount = parseFloat(calculateTotalAmount());

    if (totalAmount <= 0) {
      toast.error("Invalid date range or monthly EMI");
      return;
    }

    setIsLoading(true);
    try {
      const config = getAuthConfig();

      const emiData = {
        name: newEMI.name,
        totalAmount: totalAmount, // Auto-calculated
        monthlyEMI: parseFloat(newEMI.monthlyEMI),
        remainingAmount: totalAmount, // Auto-calculated
        startDate: newEMI.startDate,
        endDate: newEMI.endDate,
        dueDate: parseInt(newEMI.dueDate),
        category: newEMI.category,
        interestRate: newEMI.interestRate
          ? parseFloat(newEMI.interestRate)
          : undefined,
        notes: newEMI.notes || undefined,
      };

      const response = await axios.post(`${API_URL}/emi`, emiData, config);

      const normalizedEMI = {
        ...response.data.data,
        id: response.data.data._id,
      };

      setEmis((prev) => [...prev, normalizedEMI]);

      setNewEMI({
        name: "",
        monthlyEMI: "",
        startDate: "",
        endDate: "",
        dueDate: "1",
        category: "EMI",
        interestRate: "0",
        notes: "",
      });

      if (!isOnboarding) {
        setIsAdding(false);
      }

      toast.success("EMI added successfully!");
    } catch (error) {
      console.error("Error adding EMI:", error);
      toast.error("Failed to add EMI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEMI = async () => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/emi/${deleteId}`, config);

      setEmis((prev) =>
        prev.filter((emi) => emi.id !== deleteId && emi._id !== deleteId)
      );
      setDeleteId(null);
      toast.success("EMI deleted successfully!");
    } catch (error) {
      console.error("Error deleting EMI:", error);
      toast.error("Failed to delete EMI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isOnboarding ? "p-4" : "p-6 shadow-xl"}>
        {!isOnboarding && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              EMI & Loan Tracker
            </h3>
            {!isAdding && (
              <Button
                size="sm"
                onClick={() => setIsAdding(true)}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add EMI
              </Button>
            )}
          </div>
        )}

        {isAdding && (
          <form
            onSubmit={handleAddEMI}
            className={`${
              isOnboarding ? "mb-4" : "mb-6"
            } p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800`}
          >
            <h4 className="mb-4">Add New EMI/Loan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emi-name">EMI Name *</Label>
                <Input
                  id="emi-name"
                  placeholder="e.g., Car Loan"
                  value={newEMI.name}
                  onChange={(e) =>
                    setNewEMI({ ...newEMI, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-emi">Monthly EMI Amount *</Label>
                <Input
                  id="monthly-emi"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newEMI.monthlyEMI}
                  onChange={(e) =>
                    setNewEMI({ ...newEMI, monthlyEMI: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emi-start">Start Date *</Label>
                <Input
                  id="emi-start"
                  type="date"
                  value={newEMI.startDate}
                  onChange={(e) =>
                    setNewEMI({ ...newEMI, startDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emi-end">End Date *</Label>
                <Input
                  id="emi-end"
                  type="date"
                  value={newEMI.endDate}
                  onChange={(e) =>
                    setNewEMI({ ...newEMI, endDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date (Day of Month) *</Label>
                <Input
                  id="due-date"
                  type="number"
                  min="1"
                  max="31"
                  value={newEMI.dueDate}
                  onChange={(e) =>
                    setNewEMI({ ...newEMI, dueDate: e.target.value })
                  }
                />
              </div>

              {/* NEW: Display calculated total (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="total-amount">Total Amount (Auto)</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
                  <span className="text-sm font-medium">
                    {currency}{" "}
                    {parseFloat(calculateTotalAmount()).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated automatically
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add EMI"}
              </Button>
              {!isOnboarding && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewEMI({
                      name: "",
                      monthlyEMI: "",
                      startDate: "",
                      endDate: "",
                      dueDate: "1",
                      category: "EMI",
                      interestRate: "0",
                      notes: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}

        {!isOnboarding && activeEMIs.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Monthly EMI
                </p>
                <p className="text-2xl tabular-nums text-green-900 dark:text-green-100">
                  {currency} {totalMonthlyEMI.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        )}

        {!isOnboarding && sortedEMIs.length === 0 && !isAdding ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="mb-2">No active EMIs</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Track your loans and monthly payments
            </p>
            <Button onClick={() => setIsAdding(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First EMI
            </Button>
          </div>
        ) : !isOnboarding && sortedEMIs.length > 0 ? (
          <div className="space-y-4">
            {sortedEMIs.map((emi) => {
              const monthsRemaining = calculateMonthsRemaining(emi.endDate);
              const progress = calculateProgress(emi.startDate, emi.endDate);
              const isEndingSoon = monthsRemaining <= 3;

              return (
                <div
                  key={emi._id}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="truncate">{emi.name}</p>
                        {isEndingSoon && (
                          <Badge
                            variant="outline"
                            className="border-orange-500 text-orange-500"
                          >
                            Ending Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm tabular-nums">
                        {currency} {emi.monthlyEMI.toLocaleString()}/month
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(emi.id || emi._id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {monthsRemaining}{" "}
                        {monthsRemaining === 1 ? "month" : "months"} remaining
                      </span>
                      <span className="text-muted-foreground">
                        Ends {formatDate(emi.endDate)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started {formatDate(emi.startDate)}</span>
                      <span>{progress.toFixed(0)}% complete</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete EMI?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The EMI record will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEMI}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
