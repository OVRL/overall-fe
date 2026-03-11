"use client";

import { useState } from "react";
import DateTimePicker from "./DateTimePicker";

/** "HH:mm" 또는 "HH:mm:ss" → "오전 12:00" 형식으로 표시 */
export function formatTimeToKorean(timeStr: string): string {
  if (!timeStr?.trim()) return "오전 12:00";
  const [h, m] = timeStr.split(":").map(Number);
  const hour = Number.isNaN(h) ? 0 : h;
  const minute = Number.isNaN(m) ? 0 : m;

  const isPm = hour >= 12;
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = isPm ? "오후" : "오전";

  return `${ampm} ${displayHour}:${String(minute).padStart(2, "0")}`;
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
 * 커스텀 휠 피커를 사용하는 시간 선택기.
 */
export function TimePicker({
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  className,
  disabled,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className ?? "w-full"}`}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="w-full h-13 px-4 py-3.5 text-sm text-Label-Primary rounded-lg bg-Fill_Quaternary/50 border border-transparent focus:border-Fill_AccentPrimary text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        {formatTimeToKorean(value)}
      </button>

      {isOpen && (
        <DateTimePicker
          type="time"
          initialValue={value}
          onClose={() => setIsOpen(false)}
          onConfirm={(val) => {
            onChange(val);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
