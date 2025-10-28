import { Button } from "./ui/button";
import { Home, Receipt, PieChart, Menu, Plus } from "lucide-react";

interface DesktopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAdd: () => void;
}

export function DesktopNav({ activeTab, onTabChange, onQuickAdd }: DesktopNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'More', icon: Menu },
  ];

  return (
    <div className="hidden md:flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={isActive ? '' : 'text-muted-foreground'}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
      
      <div className="ml-2 pl-2 border-l">
        <Button onClick={onQuickAdd} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}
