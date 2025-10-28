import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Target, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { toast } from "sonner@2.0.3";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onUpdateGoals: (goals: SavingsGoal[]) => void;
  currency: string;
}

export function SavingsGoals({ goals, onUpdateGoals, currency }: SavingsGoalsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: '', deadline: '' });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.name || !newGoal.targetAmount) {
      toast.error('Please fill in goal name and target amount');
      return;
    }

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline || undefined
    };

    onUpdateGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
    setIsAdding(false);
    toast.success('Savings goal added!');
  };

  const handleUpdateGoal = (id: string, currentAmount: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount } : goal
    );
    onUpdateGoals(updatedGoals);
    setEditingId(null);
    toast.success('Progress updated!');
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateGoals(goals.filter(goal => goal.id !== id));
    toast.success('Goal deleted');
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
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddGoal} className="mb-6 p-4 border rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                placeholder="e.g., Emergency Fund"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
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
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
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
                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              <Check className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
              }}
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
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const isEditing = editingId === goal.id;
            const [editAmount, setEditAmount] = useState(goal.currentAmount.toString());

            return (
              <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p>{goal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
                    </p>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
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
                            setEditingId(goal.id);
                            setEditAmount(goal.currentAmount.toString());
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleUpdateGoal(goal.id, parseFloat(editAmount) || 0)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingId(null)}
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
                        {formatCurrency(goal.targetAmount - goal.currentAmount, currency)} remaining
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
    </div>
  );
}
