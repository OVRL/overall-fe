"use client";

import Icon from "./Icon";
import arrow_down from "@/public/icons/arrow_down.svg";
import arrow_up from "@/public/icons/arrow_up.svg";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  className,
}: DropdownProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null); // For scrolling to focused item

  const selectedLabel = options?.find((opt) => opt.value === value)?.label;

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  });

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        // Focus first item or selected item
        const idx = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const list = listRef.current;
      const element = list.children[focusedIndex] as HTMLElement;
      if (element) {
        // DOM 마운트 직후 스크롤이 안정적으로 동작하도록 setTimeout 사용
        setTimeout(() => {
          element.scrollIntoView({ block: "center" });
        }, 0);
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            const idx = options.findIndex((opt) => opt.value === value);
            setFocusedIndex(idx >= 0 ? idx : 0);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
        className={cn(
          "flex items-center justify-between w-39.5 h-12 pl-4 pr-1.75 py-3 border rounded-[0.625rem] transition-colors duration-200",
          "bg-Fill_Quatiary border-transparent",
          isOpen ? "border-Fill_AccentPrimary" : "",
          className,
        )}
      >
        <span
          className={cn(
            "text-sm font-normal truncate w-25.25 ",
            selectedLabel ? "text-Label-Secondary" : "text-Label-Primary",
          )}
        >
          {selectedLabel || placeholder}
        </span>
        <motion.div
          animate={{ rotate: 0 }}
          transition={{ duration: 0.2 }}
          className="text-Fill_Tertiary"
        >
          <Icon src={isOpen ? arrow_up : arrow_down} width={24} height={24} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-39.5 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] shadow-lg overflow-hidden py-2"
          >
            <div
              className="flex flex-col gap-1 p-2 max-h-60 overflow-y-auto custom-scrollbar"
              role="listbox"
              ref={listRef}
            >
              {options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                  tabIndex={-1} // Manage focus manually
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-[0.625rem] transition-colors outline-none",
                    value === option.value
                      ? "text-Fill_AccentPrimary bg-Fill_Tertiary" // Selected style
                      : "text-Label-Secondary", // Default
                    focusedIndex === index
                      ? "bg-Fill_Tertiary text-Label-Primary" // Focused style
                      : "",
                  )}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
