import { memo } from "react";
import PositionChip from "@/components/PositionChip";
import type { Player } from "../../../_types/player";
import {
  PLAYER_TABLE_COLUMNS,
  COLUMN_WIDTH_MAP,
} from "../../../_constants/playerTableColumns";
import PlayerNameCell from "./PlayerNameCell";
import StatsCell from "./StatsCell";
import { cn } from "@/lib/utils";

export interface PlayerTableRowProps {
  player: Player;
  index: number;
  onPlayerClick?: (player: Player) => void;
  getCellClass: (colKey: string) => string;
}

const ROW_BASE_CLASS = "transition-colors cursor-pointer group";
const CELL_BASE_CLASS =
  "text-Label-Tertiary text-center flex items-center justify-center text-sm";
const CELL_LEFT_CLASS = "flex items-center overflow-hidden";

const PlayerTableRow = memo(function PlayerTableRow({
  player,
  index,
  onPlayerClick,
  getCellClass,
}: PlayerTableRowProps) {
  return (
    <tr
      className={cn(
        ROW_BASE_CLASS,
        "bg-gray-1300 h-[42px] flex items-center w-full min-w-max md:min-w-full justify-between pl-2 pr-1.5 relative",
        "after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-Fill_Quatiary after:z-50",
      )}
      onClick={() => onPlayerClick?.(player)}
    >
      {PLAYER_TABLE_COLUMNS.map((col) => {
        const colStyle = COLUMN_WIDTH_MAP[col.key] || COLUMN_WIDTH_MAP.default;

        if (col.key === "등수") {
          return (
            <td
              key={col.key}
              className={cn(
                CELL_BASE_CLASS,
                colStyle,
                "font-medium",
                "text-Label-Primary",
              )}
            >
              {index + 1}
            </td>
          );
        }
        if (col.key === "포지션") {
          return (
            <td key={col.key} className={cn(CELL_BASE_CLASS, colStyle)}>
              <PositionChip position={player.position} variant="outline" />
            </td>
          );
        }
        if (col.key === "등번호") {
          return (
            <td key={col.key} className={cn(CELL_BASE_CLASS, colStyle)}>
              {player.backNumber}
            </td>
          );
        }
        if (col.key === "이름") {
          return (
            <td key={col.key} className={cn(CELL_LEFT_CLASS, colStyle)}>
              <PlayerNameCell
                name={player.name}
                image={player.image}
                imageFallbackUrl={player.imageFallbackUrl}
                playerId={player.id}
              />
            </td>
          );
        }
        const value =
          col.key === "OVR"
            ? player.ovr
            : player.stats?.[col.statsKey!] ?? col.defaultValue ?? "-";
        const highlight = getCellClass(col.key).includes("primary");
        return (
          <StatsCell
            key={col.key}
            value={value}
            highlight={highlight}
            className={colStyle}
          />
        );
      })}
    </tr>
  );
});

export default PlayerTableRow;
