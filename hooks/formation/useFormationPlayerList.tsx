"use client";

import { useState, useMemo } from "react";
import { Player } from "@/types/formation";
import { getMainPositionFromRole } from "@/lib/positionUtils";
import { isMercenaryFormationPlayer } from "@/lib/formation/roster/isMercenaryFormationPlayer";

export interface UseFormationPlayerListArgs {
  players: Player[];
  targetPosition?: string | null;
  activePosition?: {
    quarterId: number;
    index: number;
    role: string;
  } | null;
}

/** 보드/상위에서 넘어온 역할 → 명단 칩 탭 (용병은 MF가 아닌 `용병` 탭) */
function tabFromTargetRole(role: string): string | null {
  if (role === "용병") return "용병";
  const main = getMainPositionFromRole(role);
  if (main === "전체") return null;
  return main;
}

export function useFormationPlayerList({
  players,
  targetPosition,
  activePosition,
}: UseFormationPlayerListArgs) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTab, setUserTab] = useState<string>("전체");

  const positionDerivedTab = useMemo(() => {
    const target = activePosition?.role || targetPosition;
    if (target == null || target === "") return null;
    return tabFromTargetRole(target);
  }, [targetPosition, activePosition]);

  const activePosTab = positionDerivedTab ?? userTab;
  const setActivePosTab = (tab: string) => setUserTab(tab);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      if (searchTerm && !p.name.includes(searchTerm)) return false;
      if (activePosTab === "전체") return true;

      if (isMercenaryFormationPlayer(p)) {
        return activePosTab === "용병";
      }
      if (activePosTab === "용병") return false;

      const mapped = getMainPositionFromRole(p.position);
      return mapped === activePosTab;
    });
  }, [players, searchTerm, activePosTab]);

  return {
    searchTerm,
    setSearchTerm,
    activePosTab,
    setActivePosTab,
    filteredPlayers,
  };
}
