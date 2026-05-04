"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion } from "motion/react";

export type ProfileTabType = "상세 정보" | "팀 프로필";

interface ProfileTabMenuProps {
  activeTab: ProfileTabType;
  onChange: (tab: ProfileTabType) => void;
}

const TABS: { type: ProfileTabType; label: string }[] = [
  { type: "상세 정보", label: "상세 정보" },
  { type: "팀 프로필", label: "팀 프로필" },
];

export default function ProfileTabMenu({
  activeTab,
  onChange,
}: ProfileTabMenuProps) {
  const isMobile = useIsMobile(768);

  return (
    <div className={cn("flex items-baseline", isMobile && "w-full mb-3")}>
      <div
        role="tablist"
        id="profile-tabs"
        aria-label="프로필 탭"
        className={cn("flex items-baseline gap-4", isMobile && "w-full h-12")}
      >
        {TABS.map(({ type, label }) => {
          const isActive = activeTab === type;
          const tabId = `tab-${type === "상세 정보" ? "personal" : "team"}`;
          return (
            <div
              className={cn(
                "relative h-full flex items-center px-0",
                "w-auto",
              )}
              key={type}
            >
              <button
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isActive}
                aria-controls="profile-tabpanel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(type)}
                className={cn(
                  "transition-colors cursor-pointer h-auto w-auto px-1",
                  isMobile ? "text-xl" : "text-lg",
                  isActive
                    ? "text-white font-bold"
                    : "text-gray-500 hover:text-gray-300 font-semibold",
                )}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
