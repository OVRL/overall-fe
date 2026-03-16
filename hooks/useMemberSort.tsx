import { useState, useMemo } from "react";
import {
  SortConfig,
  SortKey,
} from "@/components/home/Roster/RosterList/PlayerListCategory";
import { POSITION_CATEGORY_MAP } from "@/constants/position";
import type { RosterMember } from "@/components/home/Roster/useFindManyTeamMemberQuery";
import type { Position } from "@/types/position";

const POS_ORDER = ["FW", "MF", "DF", "GK"];

export function useMemberSort(members: readonly RosterMember[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "position",
    direction: "asc",
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  const sortedMembers = useMemo(() => {
    if (!sortConfig) return members;

    return [...members].sort((a, b) => {
      const { key, direction } = sortConfig;
      const factor = direction === "asc" ? 1 : -1;

      if (key === "position") {
        const posA = (a.position ?? "") as Position;
        const posB = (b.position ?? "") as Position;
        const orderA = POS_ORDER.indexOf(POSITION_CATEGORY_MAP[posA] ?? "");
        const orderB = POS_ORDER.indexOf(POSITION_CATEGORY_MAP[posB] ?? "");
        if (orderA !== orderB) return (orderA - orderB) * factor;
        return 0;
      }

      if (key === "number") {
        const numA = a.backNumber ?? 0;
        const numB = b.backNumber ?? 0;
        return (numA - numB) * factor;
      }

      if (key === "name") {
        const nameA = a.user?.name ?? "";
        const nameB = b.user?.name ?? "";
        return nameA.localeCompare(nameB) * factor;
      }

      if (key === "overall") {
        const ovrA = a.overall?.ovr ?? 0;
        const ovrB = b.overall?.ovr ?? 0;
        return (ovrA - ovrB) * factor;
      }

      return 0;
    });
  }, [members, sortConfig]);

  return { sortedMembers, sortConfig, handleSort };
}
