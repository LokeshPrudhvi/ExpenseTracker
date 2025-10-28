import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Upload, Trash2, AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface DataManagementProps {
  expenses: Expense[];
  budget: number;
  income: number;
  currency: string;
  onImport: (data: { expenses: Expense[]; budget: number; income: number; currency: string }) => void;
  onClearAll: () => void;
}

export function DataManagement({ 
  expenses, 
  budget, 
  income,
  currency,
  onImport,
  onClearAll 
}: DataManagementProps) {

  const exportToJSON = () => {
    const data = {
      expenses,
      budget,
      income,
      currency,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const exportToCSV = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = expenses.map(exp => [
      exp.date,
      exp.category,
      `"${exp.description.replace(/"/g, '""')}"`,
      exp.amount.toString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully!');
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate data structure
        if (!data.expenses || !Array.isArray(data.expenses)) {
          throw new Error('Invalid data format');
        }

        onImport({
          expenses: data.expenses,
          budget: data.budget || 0,
          income: data.income || 0,
          currency: data.currency || 'USD'
        });
        
        toast.success(`Imported ${data.expenses.length} expenses successfully!`);
      } catch (error) {
        toast.error('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p className="text-sm text-indigo-900 dark:text-indigo-100">
          💾 Export, import, and manage your expense data
        </p>
      </div>

    <Card className="p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5" />
        <h3>Data Management</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Export your data for backup or analysis
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportToJSON} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Import previously exported data
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={importFromJSON}
                />
              </label>
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Remove all data and start fresh
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your
                  expenses, budget settings, and income data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="bg-muted rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-1">Export your data regularly to prevent data loss.</p>
            <p>Your data is stored locally in your browser.</p>
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
}
