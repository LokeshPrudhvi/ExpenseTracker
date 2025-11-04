import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

export function DatePicker({ selectedDate, onDateChange, onClose }: DatePickerProps) {
  const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();
  const isCurrentYear = pickerYear === currentDate.getFullYear();

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(pickerYear);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
    onClose();
  };

  const canSelectMonth = (monthIndex: number) => {
    if (isCurrentYear && monthIndex > currentDate.getMonth()) {
      return false;
    }
    if (pickerYear > currentDate.getFullYear()) {
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Select Month & Year</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPickerYear(pickerYear - 1)}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {pickerYear - 1}
          </Button>
          <span className="text-center font-bold text-xl px-6 py-2 bg-primary/10 rounded-lg flex-1">
            {pickerYear}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPickerYear(pickerYear + 1)}
            disabled={pickerYear + 1 > currentDate.getFullYear()}
            className="flex-1"
          >
            {pickerYear + 1}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Months Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {months.map((month, index) => {
            const isSelected =
              selectedDate.getMonth() === index &&
              selectedDate.getFullYear() === pickerYear;
            const isDisabled = !canSelectMonth(index);

            return (
              <Button
                key={month}
                onClick={() => handleMonthSelect(index)}
                disabled={isDisabled}
                variant={isSelected ? "default" : "outline"}
                className="text-sm py-2 h-auto font-medium"
              >
                {month.slice(0, 3)}
              </Button>
            );
          })}
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center">
          {pickerYear > currentDate.getFullYear()
            ? "Future dates unavailable"
            : "Select a month to view expenses"}
        </p>
      </Card>
    </div>
  );
}
