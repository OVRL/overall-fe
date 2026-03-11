import React from "react";
import { cn } from "@/lib/utils";

import { StatTabType } from "@/app/(main)/team-data/_types/player";

interface StatTabMenuProps {
  activeTab: StatTabType;
  onChange: (tab: StatTabType) => void;
}

const StatTabMenu = ({ activeTab, onChange }: StatTabMenuProps) => {
  const tabs: StatTabType[] = ["시즌기록", "누적기록", "단일기록"];

  return (
    <div className="flex items-center justify-between gap-2 px-10.5 py-4">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab}>
          {index !== 0 && (
            <div className="w-0.5 h-2 bg-Fill_Tertiary" aria-hidden="true" />
          )}
          <button
            onClick={() => onChange(tab)}
            className={cn(
              "px-1 py-1 text-sm font-medium transition-colors",
              activeTab === tab
                ? "text-Label-AccentPrimary"
                : "text-Label-Tertiary hover:text-gray-200",
            )}
          >
            {tab}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatTabMenu;
