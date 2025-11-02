import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { Target, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { toast } from "sonner@2.0.3";
import axios from "axios";

interface SavingsGoal {
  _id: string;
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  description?: string;
  isCompleted: boolean;
}

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onUpdateGoals: (goals: SavingsGoal[]) => void;
  currency: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export function SavingsGoals({
  goals,
  onUpdateGoals,
  currency,
}: SavingsGoalsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
  });
  const [editAmount, setEditAmount] = useState("");

  // Get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_URL}/savings`, config);

      // Normalize _id to id
      const normalizedGoals = (response.data.data || []).map((goal: any) => ({
        ...goal,
        id: goal._id,
      }));

      onUpdateGoals(normalizedGoals);
    } catch (error) {
      console.error("Error fetching savings goals:", error);
      toast.error("Failed to load savings goals");
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGoal.name || !newGoal.targetAmount) {
      toast.error("Please fill in goal name and target amount");
      return;
    }

    setIsLoading(true);
    try {
      const config = getAuthConfig();

      const goalData = {
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline || undefined,
        description: newGoal.description || undefined,
      };

      const response = await axios.post(`${API_URL}/savings`, goalData, config);

      // Normalize response
      const newGoalData = {
        ...response.data.data,
        id: response.data.data._id,
      };

      onUpdateGoals([...goals, newGoalData]);
      setNewGoal({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        description: "",
      });
      setIsAdding(false);
      toast.success("Savings goal added!");
    } catch (error) {
      console.error("Error adding goal:", error);
      toast.error("Failed to add savings goal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = async (id: string, currentAmount: number) => {
    setIsLoading(true);
    try {
      const config = getAuthConfig();

      const response = await axios.patch(
        `${API_URL}/savings/${id}`,
        { currentAmount },
        config
      );

      // Normalize response
      const updatedGoal = {
        ...response.data.data,
        id: response.data.data._id,
      };

      const updatedGoals = goals.map((goal) =>
        goal.id === id || goal._id === id ? updatedGoal : goal
      );
      onUpdateGoals(updatedGoals);
      setEditingId(null);
      toast.success("Progress updated!");
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/savings/${deleteId}`, config);

      onUpdateGoals(
        goals.filter((goal) => goal.id !== deleteId && goal._id !== deleteId)
      );
      setDeleteId(null);
      toast.success("Goal deleted");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-sm text-green-900 dark:text-green-100">
          🎯 Set and track your savings goals
        </p>
      </div>

      <Card className="p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Savings Goals
          </h3>
          {!isAdding && (
            <Button
              size="sm"
              onClick={() => setIsAdding(true)}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          )}
        </div>

        {isAdding && (
          <form
            onSubmit={handleAddGoal}
            className="mb-6 p-4 border rounded-lg space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoal.targetAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetAmount: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoal.currentAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, currentAmount: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add notes about this goal..."
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isLoading}>
                <Check className="w-4 h-4 mr-2" />
                {isLoading ? "Adding..." : "Add Goal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewGoal({
                    name: "",
                    targetAmount: "",
                    currentAmount: "",
                    deadline: "",
                    description: "",
                  });
                }}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}

        {goals.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No savings goals yet</p>
            <p className="text-sm">Set a goal to start tracking your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress =
                goal.targetAmount > 0
                  ? (goal.currentAmount / goal.targetAmount) * 100
                  : 0;
              const isEditing = editingId === goal.id || editingId === goal._id;

              return (
                <div key={goal._id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p>{goal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(goal.currentAmount, currency)} of{" "}
                        {formatCurrency(goal.targetAmount, currency)}
                      </p>
                      {goal.deadline && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Deadline:{" "}
                          {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                      {goal.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(goal.id || goal._id);
                              setEditAmount(goal.currentAmount.toString());
                            }}
                            disabled={isLoading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setDeleteId(goal.id || goal._id)
                            }
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleUpdateGoal(
                                goal.id || goal._id,
                                parseFloat(editAmount) || 0
                              )
                            }
                            disabled={isLoading}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Label>Update Current Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {progress.toFixed(1)}% complete
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(
                            goal.targetAmount - goal.currentAmount,
                            currency
                          )}{" "}
                          remaining
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Savings Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The savings goal will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGoal}
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
