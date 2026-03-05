import { useCallback } from "react";
import type { Player } from "../../_types/player";
import PlayerTableHeader from "./PlayerTableHeader";
import PlayerTableRow from "./PlayerTableRow";
import { cn } from "@/lib/utils";

export interface PlayerTableProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
}

const PlayerTable = ({
  players,
  onPlayerClick,
  sortConfig,
  onSort,
}: PlayerTableProps) => {
  const getCellClass = useCallback(
    (colKey: string) => {
      if (sortConfig?.key === colKey) return "text-primary font-bold";
      if (!sortConfig && colKey === "OVR") return "text-primary font-bold";
      return "text-gray-300";
    },
    [sortConfig],
  );

  return (
    <div className={cn("mt-12 overflow-x-auto select-none")}>
      <table className={cn("block w-full text-sm")}>
        <PlayerTableHeader sortConfig={sortConfig} onSort={onSort} />
        <tbody className={cn("block w-full")}>
          {players.map((player, index) => (
            <PlayerTableRow
              key={player.id}
              player={player}
              index={index}
              onPlayerClick={onPlayerClick}
              getCellClass={getCellClass}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
