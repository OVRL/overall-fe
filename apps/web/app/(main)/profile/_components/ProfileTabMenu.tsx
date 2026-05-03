"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion } from "motion/react";

export type ProfileTabType = "개인 프로필" | "팀 프로필";

interface ProfileTabMenuProps {
  activeTab: ProfileTabType;
  onChange: (tab: ProfileTabType) => void;
}

const TABS: { type: ProfileTabType; label: string }[] = [
  { type: "개인 프로필", label: "개인 프로필" },
  { type: "팀 프로필", label: "팀 프로필" },
];

export default function ProfileTabMenu({
  activeTab,
  onChange,
}: ProfileTabMenuProps) {
  const isMobile = useIsMobile(768);

  return (
    <div className={cn("flex items-center mb-6 gap-4", isMobile && "w-full")}>
      <div
        role="tablist"
        id="profile-tabs"
        aria-label="프로필 탭"
        className={cn("flex items-center h-12", isMobile && "w-full")}
      >
        {TABS.map(({ type, label }) => {
          const isActive = activeTab === type;
          const tabId = `tab-${type === "개인 프로필" ? "personal" : "team"}`;
          return (
            <div
              className={cn(
                "relative h-full flex items-center",
                isMobile ? "w-1/2 px-1" : "px-1",
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
                  "transition-colors cursor-pointer h-auto text-base font-semibold",
                  isMobile ? "w-full" : "w-28",
                  isActive
                    ? "text-Label-AccentPrimary"
                    : "text-white hover:text-gray-300",
                )}
              >
                {label}
              </button>
              {isActive && (
                <motion.div
                  layoutId="profileTabActiveIndicator"
                  className={cn(
                    "absolute bottom-0 h-px bg-Fill_AccentPrimary",
                    isMobile
                      ? "left-1 right-1"
                      : "left-1 w-[calc(100%-0.5rem)]",
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
