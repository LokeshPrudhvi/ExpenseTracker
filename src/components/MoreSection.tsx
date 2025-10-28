import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  User, 
  Settings, 
  Target, 
  CreditCard,
  Download,
  Upload,
  Trash2,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wallet,
  TrendingUp,
  Repeat,
  FolderPlus
} from "lucide-react";

interface MoreSectionProps {
  userProfile: {
    name: string;
    email: string;
  };
  income: number;
  budget: number;
  currency: string;
  expenses: any[];
  onViewProfile: () => void;
  onViewSettings: () => void;
  onViewGoals: () => void;
  onViewEMI: () => void;
  onViewRecurring: () => void;
  onViewCategories: () => void;
  onExport: () => void;
  onImport: () => void;
  onClearData: () => void;
  onHelp: () => void;
  onLogout: () => void;
}

export function MoreSection({
  userProfile,
  income,
  budget,
  currency,
  expenses,
  onViewProfile,
  onViewSettings,
  onViewGoals,
  onViewEMI,
  onViewRecurring,
  onViewCategories,
  onExport,
  onHelp,
  onLogout
}: MoreSectionProps) {
  const menuItems = [
    {
      section: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          description: "Manage your personal information",
          onClick: onViewProfile,
          color: "text-blue-600",
          bg: "bg-blue-100 dark:bg-blue-900/30"
        }
      ]
    },
    {
      section: "Finance",
      items: [
        {
          icon: Target,
          label: "Savings Goals",
          description: "Track your savings targets",
          onClick: onViewGoals,
          color: "text-green-600",
          bg: "bg-green-100 dark:bg-green-900/30"
        },
        {
          icon: CreditCard,
          label: "EMI Tracker",
          description: "Manage loans and payments",
          onClick: onViewEMI,
          color: "text-purple-600",
          bg: "bg-purple-100 dark:bg-purple-900/30"
        },
        {
          icon: Repeat,
          label: "Recurring Expenses",
          description: "Monthly recurring payments",
          onClick: onViewRecurring,
          color: "text-indigo-600",
          bg: "bg-indigo-100 dark:bg-indigo-900/30"
        },
        {
          icon: FolderPlus,
          label: "Custom Categories",
          description: "Create your own categories",
          onClick: onViewCategories,
          color: "text-pink-600",
          bg: "bg-pink-100 dark:bg-pink-900/30"
        }
      ]
    },
    {
      section: "Settings",
      items: [
        {
          icon: Settings,
          label: "Preferences",
          description: "Currency and income settings",
          onClick: onViewSettings,
          color: "text-gray-600",
          bg: "bg-gray-100 dark:bg-gray-800"
        },
        {
          icon: Download,
          label: "Export & Import",
          description: "Backup and restore data",
          onClick: onExport,
          color: "text-indigo-600",
          bg: "bg-indigo-100 dark:bg-indigo-900/30"
        }
      ]
    },
    {
      section: "Help",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Guide",
          description: "Learn how to use the app",
          onClick: onHelp,
          color: "text-orange-600",
          bg: "bg-orange-100 dark:bg-orange-900/30"
        }
      ]
    }
  ];

  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && 
           expDate.getFullYear() === now.getFullYear();
  });

  const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savingsRate = income > 0 ? ((income - totalSpent) / income * 100) : 0;

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3>{userProfile.name}</h3>
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-muted-foreground">Monthly Income</p>
            </div>
            <p className="text-lg tabular-nums">{currency} {income.toLocaleString()}</p>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs text-muted-foreground">Savings Rate</p>
            </div>
            <p className="text-lg tabular-nums">{savingsRate.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Menu Sections */}
      {menuItems.map((section) => (
        <div key={section.section}>
          <h4 className="text-sm text-muted-foreground mb-3 px-2">
            {section.section}
          </h4>
          <Card className="divide-y shadow-xl">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p>{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </Card>
        </div>
      ))}

      {/* Logout Button */}
      <Card className="p-4 shadow-xl">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </Card>

      {/* App Info */}
      <div className="text-center space-y-2 pb-4">
        <p className="text-xs text-muted-foreground">
          🔒 Your data is stored locally on your device
        </p>
        <p className="text-xs text-muted-foreground">
          Expense Tracker v1.0 • Built with ❤️
        </p>
      </div>
    </div>
  );
}
