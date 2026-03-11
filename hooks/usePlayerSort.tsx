import { useState, useMemo } from "react";
import { Player } from "@/types/player";
import {
  SortConfig,
  SortKey,
} from "@/components/home/Roster/RosterList/PlayerListCategory";
import { POSITION_CATEGORY_MAP } from "@/constants/position";

const POS_ORDER = ["FW", "MF", "DF", "GK"];

export const usePlayerSort = (players: Player[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "position",
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((current: SortConfig | null) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  const sortedPlayers = useMemo(() => {
    if (!sortConfig) return players;

    return [...players].sort((a, b) => {
      const { key, direction } = sortConfig;
      const factor = direction === "asc" ? 1 : -1;

      if (key === "position") {
        const orderA = POS_ORDER.indexOf(
          POSITION_CATEGORY_MAP[
            a.position as import("@/types/position").Position
          ] || "",
        );
        const orderB = POS_ORDER.indexOf(
          POSITION_CATEGORY_MAP[
            b.position as import("@/types/position").Position
          ] || "",
        );
        if (orderA !== orderB) return (orderA - orderB) * factor;
        return 0;
      }

      if (key === "number") {
        return (a.number - b.number) * factor;
      }

      if (key === "name") {
        return a.name.localeCompare(b.name) * factor;
      }

      if (key === "overall") {
        return (a.overall - b.overall) * factor;
      }

      return 0;
    });
  }, [players, sortConfig]);

  return { sortedPlayers, sortConfig, handleSort };
};
