import { Card } from "./ui/card";
import { Home, Receipt, Plus, PieChart, Menu } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAdd: () => void;
}

export function MobileNav({ activeTab, onTabChange, onQuickAdd }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'More', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900 dark:to-transparent pt-8 pb-safe">
        <div className="px-4 pb-4">
          <Card className="shadow-2xl border-2 bg-white dark:bg-gray-900">
            <div className="grid grid-cols-5 divide-x divide-gray-200 dark:divide-gray-700">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isAddButton = item.id === 'add';

                if (isAddButton) {
                  return (
                    <button
                      key={item.id}
                      onClick={onQuickAdd}
                      className="flex flex-col items-center justify-center py-3 gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
                    >
                      <div className="absolute -top-8 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs mt-6 text-primary font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex flex-col items-center justify-center py-3 gap-1 transition-all ${
                      isActive
                        ? 'text-primary bg-blue-50 dark:bg-blue-950/30'
                        : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                    <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
