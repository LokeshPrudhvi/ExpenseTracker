import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Calendar, 
  CreditCard, 
  TrendingDown, 
  Plus,
  Trash2,
  DollarSign
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface EMI {
  id: string;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  category: string;
}

interface EMITrackerProps {
  currency: string;
}

export function EMITracker({ currency }: EMITrackerProps) {
  const [emis, setEmis] = useState<EMI[]>(() => {
    const saved = localStorage.getItem('emiList');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [newEMI, setNewEMI] = useState({
    name: '',
    amount: '',
    startDate: '',
    endDate: '',
    category: 'other'
  });

  const today = new Date();
  const activeEMIs = emis.filter(emi => {
    const endDate = new Date(emi.endDate);
    return endDate >= today;
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

  const totalMonthlyEMI = activeEMIs.reduce((sum, emi) => sum + emi.amount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric'
    });
  };

  const handleAddEMI = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEMI.name || !newEMI.amount || !newEMI.startDate || !newEMI.endDate) {
      toast.error('Please fill in all fields');
      return;
    }

    const emi: EMI = {
      id: Date.now().toString(),
      name: newEMI.name,
      amount: parseFloat(newEMI.amount),
      startDate: newEMI.startDate,
      endDate: newEMI.endDate,
      category: newEMI.category
    };

    const updatedEMIs = [...emis, emi];
    setEmis(updatedEMIs);
    localStorage.setItem('emiList', JSON.stringify(updatedEMIs));
    
    setNewEMI({ name: '', amount: '', startDate: '', endDate: '', category: 'other' });
    setIsAdding(false);
    toast.success('EMI added successfully!');
  };

  const handleDeleteEMI = (id: string) => {
    const updatedEMIs = emis.filter(emi => emi.id !== id);
    setEmis(updatedEMIs);
    localStorage.setItem('emiList', JSON.stringify(updatedEMIs));
    toast.success('EMI deleted');
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <p className="text-sm text-purple-900 dark:text-purple-100">
          💳 Track your EMI payments and loan progress
        </p>
      </div>

      <Card className="p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            EMI & Loan Tracker
          </h3>
          {!isAdding && (
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add EMI
            </Button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAddEMI} className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="mb-4">Add New EMI/Loan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emi-name">EMI Name</Label>
                <Input
                  id="emi-name"
                  placeholder="e.g., Car Loan"
                  value={newEMI.name}
                  onChange={(e) => setNewEMI({ ...newEMI, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emi-amount">Monthly Amount</Label>
                <Input
                  id="emi-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newEMI.amount}
                  onChange={(e) => setNewEMI({ ...newEMI, amount: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emi-start">Start Date</Label>
                <Input
                  id="emi-start"
                  type="date"
                  value={newEMI.startDate}
                  onChange={(e) => setNewEMI({ ...newEMI, startDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emi-end">End Date</Label>
                <Input
                  id="emi-end"
                  type="date"
                  value={newEMI.endDate}
                  onChange={(e) => setNewEMI({ ...newEMI, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button type="submit" size="sm">Add EMI</Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewEMI({ name: '', amount: '', startDate: '', endDate: '', category: 'other' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {activeEMIs.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly EMI</p>
                <p className="text-2xl tabular-nums text-green-900 dark:text-green-100">
                  {currency} {totalMonthlyEMI.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        )}

        {sortedEMIs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="mb-2">No active EMIs</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Track your loans and monthly payments
            </p>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First EMI
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEMIs.map((emi) => {
              const monthsRemaining = calculateMonthsRemaining(emi.endDate);
              const progress = calculateProgress(emi.startDate, emi.endDate);
              const isEndingSoon = monthsRemaining <= 3;

              return (
                <div key={emi.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="truncate">{emi.name}</p>
                        {isEndingSoon && (
                          <Badge variant="outline" className="border-orange-500 text-orange-500">
                            Ending Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm tabular-nums">
                        {currency} {emi.amount.toLocaleString()}/month
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEMI(emi.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {monthsRemaining} {monthsRemaining === 1 ? 'month' : 'months'} remaining
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
        )}
      </Card>
    </div>
  );
}
