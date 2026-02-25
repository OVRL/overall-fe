"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import calendar from "@/public/icons/calendar.svg";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import Icon from "../Icon";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  className,
  disabled,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-x-2.5 rounded-lg py-3.5 text-left text-[0.875rem] cursor-pointer font-normal transition-colors text-Label-Tertiary focus:outline-none focus:ring-1 focus:ring-Fill_AccentPrimary focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <Icon
            src={calendar}
            alt="달력 아이콘"
            width={24}
            height={24}
            className="ml-0.5"
          />
          {value ? (
            format(value, "yyyy. MM. dd.", { locale: ko })
          ) : (
            <span>{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setIsOpen(false);
          }}
          initialFocus
          locale={ko}
          captionLayout="dropdown"
          fromYear={1950}
          toYear={new Date().getFullYear() + 5}
        />
      </PopoverContent>
    </Popover>
  );
}
