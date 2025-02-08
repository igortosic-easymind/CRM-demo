import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  className?: string;
}

export function DateFilter({ startDate, endDate, onDateChange, className }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onDateChange(null, null);
    setIsOpen(false);
  };

  const displayText =
    startDate && endDate ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}` : "Select dates";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`justify-start text-left font-normal ${className}`}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
          {startDate && endDate && (
            <X
              className="ml-2 h-4 w-4 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={{
            from: startDate || undefined,
            to: endDate || undefined,
          }}
          onSelect={(range) => {
            onDateChange(range?.from || null, range?.to || null);
            if (range?.from && range?.to) {
              setIsOpen(false);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
