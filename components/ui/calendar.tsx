"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { motion, AnimatePresence } from "motion/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import Icon from "./Icon";
import arrow_down from "@/public/icons/arrow_down.svg";
import arrow_up from "@/public/icons/arrow_up.svg";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 bg-surface-card rounded-md w-fit text-Label-Primary",
        className,
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center w-full absolute top-0 inset-x-0 justify-between h-8 z-10 pointer-events-none",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center text-Label-Primary cursor-pointer pointer-events-auto",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center text-Label-Primary cursor-pointer pointer-events-auto",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-8 w-full font-medium text-sm text-Label-Primary",
          defaultClassNames.month_caption,
        ),
        caption_label: cn("hidden", defaultClassNames.caption_label),
        dropdowns: cn("flex items-center justify-center gap-2"),
        dropdown: cn(
          "appearance-none bg-transparent outline-none cursor-pointer focus:ring-1 focus:ring-Fill_AccentPrimary rounded-md p-1 pr-3 text-sm font-medium hover:bg-gray-1000 text-Label-Primary",
        ),
        table: cn("w-full border-collapse space-y-1 mt-2"),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-Label-Tertiary rounded-md w-9 font-normal text-[0.8rem]",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 aria-selected:border aria-selected:border-Fill_AccentPrimary aria-selected:bg-transparent aria-selected:font-medium aria-selected:text-Label-Primary text-center hover:bg-gray-1000 rounded-md transition-colors cursor-pointer text-Label-Primary flex items-center justify-center m-0",
          defaultClassNames.day,
        ),
        today: cn("font-bold text-Fill_AccentPrimary", defaultClassNames.today),
        outside: cn(
          "text-Label-Disable opacity-50 aria-selected:bg-transparent/50 aria-selected:text-Label-Disable aria-selected:opacity-30",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-Label-Disable opacity-50 cursor-not-allowed",
          defaultClassNames.disabled,
        ),
        ...classNames,
      }}
      components={{
        Dropdown: ({ value, onChange, className, options, name, disabled }) => {
          const [isOpen, setIsOpen] = useState(false);
          const containerRef = useRef<HTMLDivElement>(null);

          useClickOutside(containerRef, () => setIsOpen(false));

          const isYear =
            name === "years" ||
            (options?.[0]?.value !== undefined &&
              Number(options[0].value) > 1000);
          const isMonth =
            name === "months" ||
            (options?.[0]?.value !== undefined &&
              Number(options[0].value) <= 12);

          const selectedOption = options?.find(
            (opt) => String(opt.value) === String(value),
          );

          const formatLabel = (
            label: string,
            isYear: boolean,
            isMonth: boolean,
          ) => {
            if (isYear && !label.endsWith("년")) return `${label}년`;
            if (isMonth && !label.endsWith("월")) return `${label}월`;
            return label;
          };

          const handleSelect = (val: string | number) => {
            const syntheticEvent = {
              target: {
                value: String(val),
                name: name,
              },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(syntheticEvent);
            setIsOpen(false);
          };

          return (
            <div className="relative inline-block text-left" ref={containerRef}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "flex items-center justify-between min-w-22.5 h-8 px-3 border rounded-[0.625rem] transition-colors duration-200 gap-2 pointer-events-auto",
                  "bg-Fill_Quatiary border-transparent",
                  isOpen ? "border-Fill_AccentPrimary" : "",
                  className,
                )}
              >
                <span className="text-sm font-normal truncate text-Label-Primary">
                  {selectedOption
                    ? formatLabel(selectedOption.label, isYear, isMonth)
                    : ""}
                </span>
                <div className="text-Fill_Tertiary">
                  <Icon
                    src={isOpen ? arrow_up : arrow_down}
                    width={16}
                    height={16}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-100 mt-1 w-full min-w-28 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] shadow-lg overflow-hidden py-2"
                  >
                    <div className="flex flex-col gap-1 p-2 max-h-60 overflow-y-auto custom-scrollbar overscroll-contain">
                      {options?.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelect(option.value)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-[0.625rem] transition-all outline-none border border-transparent",
                            String(value) === String(option.value)
                              ? "text-Fill_AccentPrimary"
                              : "text-Label-Secondary hover:bg-gray-1000",
                          )}
                        >
                          {formatLabel(option.label, isYear, isMonth)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        },
        Chevron: ({ orientation, className, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRight className={cn("h-4 w-4", className)} {...props} />
            );
          }
          return <></>;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
