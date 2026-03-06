import { cn } from "@/lib/utils";
import { StatTabType } from "@/app/(main)/team-data/_types/player";
import { motion } from "motion/react";

interface DashboardTabMenuProps {
  activeTab: StatTabType;
  onChange: (tab: StatTabType) => void;
}

const DashboardTabMenu = ({ activeTab, onChange }: DashboardTabMenuProps) => {
  const tabs: { type: StatTabType; label: string }[] = [
    { type: "시즌기록", label: "시즌기록" },
    { type: "누적기록", label: "누적 기록" },
    { type: "단일기록", label: "단일 기록" },
  ];

  return (
    <div className="flex items-center my-6 h-10">
      {tabs.map(({ type, label }) => {
        const isActive = activeTab === type;
        return (
          <div className="relative h-full px-1 flex items-center" key={type}>
            <button
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
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardTabMenu;
