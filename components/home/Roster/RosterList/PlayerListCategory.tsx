import React from "react";
import { cn } from "@/lib/utils";

export type SortKey = "position" | "number" | "name" | "overall";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface PlayerListCategoryProps {
  sortConfig?: SortConfig | null;
  onSort?: (key: SortKey) => void;
}

interface HeaderCellProps {
  title: string;
  sortKey: SortKey;
  className?: string;
  align?: "left" | "center" | "right";
  sortConfig?: SortConfig | null;
  onSort?: (key: SortKey) => void;
}

const HeaderCell = ({
  title,
  sortKey,
  className,
  align = "center",
  sortConfig,
  onSort,
}: HeaderCellProps) => {
  const handleSort = () => {
    if (onSort) {
      onSort(sortKey);
    }
  };

  const renderSortIcon = () => {
    if (!sortConfig || sortConfig.key !== sortKey) return null;
    return (
      <span className="ml-1 text-[0.6rem]">
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div
      role="columnheader"
      className={cn(
        "font-normal cursor-pointer hover:text-gray-900 transition-colors select-none",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      onClick={handleSort}
    >
      <div
        className={cn(
          "flex items-center",
          align === "center" && "justify-center",
        )}
      >
        {title}
        {renderSortIcon()}
      </div>
    </div>
  );
};

const PlayerListCategory = ({
  sortConfig,
  onSort,
}: PlayerListCategoryProps) => {
  const handleSort = (key: SortKey) => {
    if (onSort) {
      onSort(key);
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return (
      <span className="ml-1 text-[0.6rem]">
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div className="w-full text-[0.6875rem] text-gray-800" role="rowgroup">
      <div
        className="flex items-center w-full h-6.25 p-1.5 bg-gray-1100 rounded-[1.25rem]"
        role="row"
      >
        <div
          className="flex items-center font-normal"
          role="columnheader"
          aria-sort="none"
        >
          <div className="flex items-center">
            <div
              className="w-12.25 h-3.25 flex items-center justify-center cursor-pointer hover:text-gray-900 transition-colors select-none"
              onClick={() => handleSort("position")}
            >
              포지션
              {renderSortIcon("position")}
            </div>
            <div
              className="w-9.75 h-3.25 flex items-center justify-center cursor-pointer hover:text-gray-900 transition-colors select-none"
              onClick={() => handleSort("number")}
            >
              등번호
              {renderSortIcon("number")}
            </div>
          </div>
        </div>
        <HeaderCell
          title="선수명"
          sortKey="name"
          className="flex-1"
          align="center"
          sortConfig={sortConfig}
          onSort={onSort}
        />
        <HeaderCell
          title="OVR"
          sortKey="overall"
          className="w-12.25"
          align="center"
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </div>
    </div>
  );
};

export default PlayerListCategory;
