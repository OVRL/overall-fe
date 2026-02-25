"use client";

import { useRef } from "react";

/** "HH:mm" 또는 "HH:mm:ss" → "오전 12:00" 형식으로 표시 */
export function formatTimeToKorean(timeStr: string): string {
  if (!timeStr?.trim()) return "오전 12:00";
  const [h, m] = timeStr.split(":").map(Number);
  const hour = Number.isNaN(h) ? 0 : h;
  const minute = Number.isNaN(m) ? 0 : m;
  if (hour === 0) return `오전 12:${String(minute).padStart(2, "0")}`;
  if (hour < 12) return `오전 ${hour}:${String(minute).padStart(2, "0")}`;
  if (hour === 12) return `오후 12:${String(minute).padStart(2, "0")}`;
  return `오후 ${hour - 12}:${String(minute).padStart(2, "0")}`;
}

export interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * "오전 12:00" 형식으로 표시되는 시간 선택기.
 * 네이티브 time input을 숨기고, 클릭 시 showPicker()로 시간 선택.
 */
export function TimePicker({
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  className,
  disabled,
}: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative ${className ?? "w-24"}`}>
      <input
        ref={inputRef}
        type="time"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        aria-label={ariaLabel}
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker?.()}
        disabled={disabled}
        className="w-full h-13 px-3 py-3.5 text-sm text-Label-Tertiary focus:border-Fill_AccentPrimary text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {formatTimeToKorean(value)}
      </button>
    </div>
  );
}
