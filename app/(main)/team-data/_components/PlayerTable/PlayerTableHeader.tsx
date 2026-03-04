import {
  PLAYER_TABLE_COLUMNS,
  SORTABLE_COLUMN_KEYS,
  COLUMN_WIDTH_MAP,
  type PlayerTableColumnConfig,
} from "../../_constants/playerTableColumns";

export interface PlayerTableHeaderProps {
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
}

const thClass = (col: PlayerTableColumnConfig, sortable: boolean) =>
  [
    col.align === "left"
      ? "text-left overflow-hidden text-ellipsis"
      : "text-center",
    "text-gray-500 font-medium whitespace-nowrap text-xs flex items-center justify-center",
    sortable ? "cursor-pointer hover:text-white transition-colors" : "",
    COLUMN_WIDTH_MAP[col.key] || COLUMN_WIDTH_MAP.default,
  ]
    .filter(Boolean)
    .join(" ");

const PlayerTableHeader = ({ sortConfig, onSort }: PlayerTableHeaderProps) => (
  <thead className="block w-full">
    <tr className="bg-gray-1100 rounded-t-xl px-2.5 py-3 flex items-center w-full min-w-max md:min-w-full">
      {PLAYER_TABLE_COLUMNS.map((col) => {
        const sortable = SORTABLE_COLUMN_KEYS.has(col.key);
        return (
          <th
            key={col.key}
            className={thClass(col, sortable)}
            onClick={() => sortable && onSort?.(col.key)}
          >
            {col.key}
            {sortConfig?.key === col.key && (
              <span className="ml-1 text-2.75 text-primary text-center">
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
