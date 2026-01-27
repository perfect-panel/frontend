"use client";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { intlFormat } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import * as React from "react";
import type { DayPicker } from "react-day-picker";

export function DatePicker({
  placeholder,
  value,
  onChange,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  placeholder?: string;
  value?: number;
  onChange?: (value?: number) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate?.getTime() || 0);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDate(undefined);
    if (onChange) {
      onChange(0);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
          variant="outline"
        >
          {value ? intlFormat(value) : <span>{placeholder}</span>}
          <div className="flex items-center gap-2">
            {value && (
              <button
                className="flex items-center"
                onClick={handleClear}
                onMouseDown={handleClear}
                type="button"
              >
                <X className="size-4 opacity-50 hover:opacity-100" />
              </button>
            )}
            <CalendarIcon className="size-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          {...props}
          initialFocus
          mode="single"
          onSelect={handleSelect}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
}
