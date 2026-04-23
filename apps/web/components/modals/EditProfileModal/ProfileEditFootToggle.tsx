"use client";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProfileEditFoot } from "./types";

type Props = {
  value: ProfileEditFoot;
  onChange: (next: ProfileEditFoot) => void;
};

const OPTIONS: { key: ProfileEditFoot; label: string }[] = [
  { key: "B", label: "양발" },
  { key: "L", label: "왼발" },
  { key: "R", label: "오른발" },
];

export default function ProfileEditFootToggle({ value, onChange }: Props) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <span className="text-sm font-semibold text-Label-Primary">주발</span>
      <div className="flex gap-x-2">
        {OPTIONS.map(({ key, label }) => (
          <label key={key} className="min-w-0 flex-1 cursor-pointer">
            <input
              type="radio"
              name="profile-edit-foot"
              className="sr-only"
              checked={value === key}
              onChange={() => onChange(key)}
            />
            <div
              className={cn(
                buttonVariants({
                  variant: value === key ? "primary" : "line",
                  size: "m",
                }),
                "w-full border-gray-1000",
                value !== key
                  ? "text-Label-Tertiary"
                  : "text-Label-AccentPrimary font-semibold bg-Fill_AccentPrimary/30",
              )}
            >
              {label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
