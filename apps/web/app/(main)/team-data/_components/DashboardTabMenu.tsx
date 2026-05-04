import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { StatTabType } from "../_types/player";
import { motion } from "motion/react";

interface DashboardTabMenuProps {
  activeTab: StatTabType;
  onChange: (tab: StatTabType) => void;
  /** 데스크톱(768 초과)에서만 탭 행 오른쪽 끝에 렌더됩니다. 모바일에서는 부모에서 별도 배치하세요. */
  trailingContent?: ReactNode;
}

const TABS: { type: StatTabType; label: string }[] = [
  { type: "시즌기록", label: "시즌기록" },
  { type: "명예의 전당", label: "명예의 전당" },
];

const DashboardTabMenu = ({
  activeTab,
  onChange,
  trailingContent,
}: DashboardTabMenuProps) => {
  const isMobile = useIsMobile(768);

  return (
    <div className={cn("flex items-baseline flex-1", isMobile && "w-full my-3")}>
      <div
        role="tablist"
        id="team-data-tabs"
        aria-label="팀 데이터 탭"
        className={cn("flex items-baseline gap-4", isMobile && "w-full")}
      >
        {TABS.map(({ type, label }) => {
          const isActive = activeTab === type;
          const tabId = `tab-${type === "시즌기록" ? "season" : "hall"}`;
          return (
            <div
              className="relative h-full flex items-center px-0 w-auto"
              key={type}
            >
              <button
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isActive}
                aria-controls="team-data-tabpanel"
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
      {!isMobile && trailingContent != null ? (
        <div className="ml-auto shrink-0">{trailingContent}</div>
      ) : null}
    </div>
  );
};

export default DashboardTabMenu;
