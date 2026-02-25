"use client";

import { useState, useMemo } from "react";
import { Player } from "@/types/formation";
import { getMainPositionFromRole } from "@/lib/positionUtils";

export interface UseFormationPlayerListArgs {
  players: Player[];
  targetPosition?: string | null;
  activePosition?: {
    quarterId: number;
    index: number;
    role: string;
  } | null;
}

export function useFormationPlayerList({
  players,
  targetPosition,
  activePosition,
}: UseFormationPlayerListArgs) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTab, setUserTab] = useState<string>("전체");

  // 포지션이 지정되면 그에 맞는 탭, 없으면 사용자 선택 탭
  const positionDerivedTab = useMemo(() => {
    const target = activePosition?.role || targetPosition;
    return target ? getMainPositionFromRole(target) : null;
  }, [targetPosition, activePosition]);
  const activePosTab = positionDerivedTab ?? userTab;
  const setActivePosTab = (tab: string) => setUserTab(tab);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      if (searchTerm && !p.name.includes(searchTerm)) return false;
      if (activePosTab === "전체") return true;
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
