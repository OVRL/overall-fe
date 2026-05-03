import {
  PLAYER_TABLE_COLUMNS,
  SORTABLE_COLUMN_KEYS,
  COLUMN_WIDTH_MAP,
  type PlayerTableColumnConfig,
} from "../../../_constants/playerTableColumns";
import { cn } from "@/lib/utils";

export interface PlayerTableHeaderProps {
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
}

const thClass = (col: PlayerTableColumnConfig, sortable: boolean) =>
  cn(
    col.align === "left"
      ? "text-left overflow-hidden text-ellipsis"
      : "text-center",
    "text-gray-800 font-medium whitespace-nowrap text-[0.6875rem] flex items-center justify-center",
    sortable && "cursor-pointer hover:text-white transition-colors",
    COLUMN_WIDTH_MAP[col.key] || COLUMN_WIDTH_MAP.default,
  );

const PlayerTableHeader = ({ sortConfig, onSort }: PlayerTableHeaderProps) => (
  <thead className="block w-full">
    <tr
      className={cn(
        "bg-gray-1200 rounded-t-xl px-2.5 py-3 flex items-center w-full min-w-max md:min-w-full justify-between",
      )}
    >
      {PLAYER_TABLE_COLUMNS.map((col) => {
        const sortable = SORTABLE_COLUMN_KEYS.has(col.key);
        return (
          <th
            key={col.key}
            className={thClass(col, sortable)}
            onClick={() => sortable && onSort?.(col.key)}
            scope="col"
            {...(sortable && {
              "aria-sort":
                sortConfig?.key === col.key
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined,
            })}
          >
            {col.key}
            {sortConfig?.key === col.key && (
              <span
                className="ml-1 text-2.75 text-primary text-center"
                aria-hidden
              >
                {sortConfig.direction === "asc" ? "▲" : "▼"}
              </span>
            )}
          </th>
        );
      })}
    </tr>
  </thead>
);

export default PlayerTableHeader;
