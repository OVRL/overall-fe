import { memo } from "react";
import PositionChip from "@/components/PositionChip";
import type { Player } from "../../_types/player";
import {
  PLAYER_TABLE_COLUMNS,
  COLUMN_WIDTH_MAP,
} from "../../_constants/playerTableColumns";
import PlayerNameCell from "./PlayerNameCell";
import StatsCell from "./StatsCell";

export interface PlayerTableRowProps {
  player: Player;
  index: number;
  onPlayerClick?: (player: Player) => void;
  getCellClass: (colKey: string) => string;
}

const ROW_BASE_CLASS = "transition-colors cursor-pointer group";
const CELL_BASE_CLASS =
  "text-gray-400 text-center flex items-center justify-center";
const CELL_LEFT_CLASS = "flex items-center overflow-hidden";

const PlayerTableRow = memo(function PlayerTableRow({
  player,
  index,
  onPlayerClick,
  getCellClass,
}: PlayerTableRowProps) {
  return (
    <tr
      className={`${ROW_BASE_CLASS} flex items-center w-full min-w-max md:min-w-full`}
      onClick={() => onPlayerClick?.(player)}
    >
      {PLAYER_TABLE_COLUMNS.map((col) => {
        const colStyle = COLUMN_WIDTH_MAP[col.key] || COLUMN_WIDTH_MAP.default;

        if (col.key === "등수") {
          return (
            <td key={col.key} className={`${CELL_BASE_CLASS} ${colStyle}`}>
              {index + 1}
            </td>
          );
        }
        if (col.key === "포지션") {
          return (
            <td key={col.key} className={`${CELL_BASE_CLASS} ${colStyle}`}>
              <PositionChip
                position={player.position}
                variant="filled"
                className="text-[10px] px-1.5 py-0.5"
              />
            </td>
          );
        }
        if (col.key === "등번호") {
          return (
            <td key={col.key} className={`${CELL_BASE_CLASS} ${colStyle}`}>
              {player.backNumber}
            </td>
          );
        }
        if (col.key === "이름") {
          return (
            <td
              key={col.key}
              className={`${CELL_LEFT_CLASS} ${colStyle} w-full`}
            >
              <PlayerNameCell name={player.name} image={player.image} />
            </td>
          );
        }
        // OVR 및 통계 컬럼
        const value =
          col.key === "OVR"
            ? player.ovr
            : (player.stats?.[col.statsKey!] ?? col.defaultValue ?? "-");
        const highlight = getCellClass(col.key).includes("primary");
        return (
          <div
            key={col.key}
            className={`flex items-center justify-center ${colStyle}`}
          >
            <StatsCell value={value} highlight={highlight} />
          </div>
        );
      })}
    </tr>
  );
});

export default PlayerTableRow;
