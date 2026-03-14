import { cn } from "@/lib/utils";
import type { StatTabType } from "../_types/player";
import { motion } from "motion/react";

interface DashboardTabMenuProps {
  activeTab: StatTabType;
  onChange: (tab: StatTabType) => void;
}

const TABS: { type: StatTabType; label: string }[] = [
  { type: "시즌기록", label: "시즌기록" },
  { type: "명예의 전당", label: "명예의 전당" },
];

const DashboardTabMenu = ({ activeTab, onChange }: DashboardTabMenuProps) => {
  return (
    <div
      role="tablist"
      id="team-data-tabs"
      aria-label="팀 데이터 탭"
      className="flex items-center my-6 h-10"
    >
      {TABS.map(({ type, label }) => {
        const isActive = activeTab === type;
        const tabId = `tab-${type === "시즌기록" ? "season" : "hall"}`;
        return (
          <div className="relative h-full px-1 flex items-center" key={type}>
            <button
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls="team-data-tabpanel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(type)}
              className={cn(
                "transition-colors cursor-pointer w-25 h-4.75",
                isActive
                  ? "text-Label-AccentPrimary"
                  : "text-white hover:text-gray-300",
              )}
            >
              {label}
            </button>
            {isActive && (
              <motion.div
                layoutId="dashboardTabActiveIndicator"
                className="absolute bottom-0 left-1 w-[calc(100%-0.5rem)] h-px bg-Fill_AccentPrimary"
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardTabMenu;
