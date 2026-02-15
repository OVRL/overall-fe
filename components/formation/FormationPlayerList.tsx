"use client";

import React, { useState } from "react";
import { Player } from "@/app/formation/page";
import PlayerListFilter from "./PlayerListFilter";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import plus from "@/public/icons/plus.svg";
import FormationPlayerGroupList from "./FormationPlayerGroupList";

interface FormationPlayerListProps {
  players: Player[];
  currentQuarterLineups: Record<number, Player | null>[];
  selectedPlayer: Player | null; // For Mobile Tap-to-Place
  onSelectPlayer: (player: Player) => void;
  isLineupFull: boolean;
  onAddPlayer?: (name: string) => void;
  onRemovePlayer?: (id: number) => void;
  targetPosition?: string | null; // e.g., "ST", "CDM"
}

export default function FormationPlayerList({
  players,
  currentQuarterLineups,
  selectedPlayer,
  onSelectPlayer,
  isLineupFull,
  onAddPlayer,
  onRemovePlayer,
  targetPosition,
}: FormationPlayerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePosTab, setActivePosTab] = useState<string>("전체");

  // Auto-switch Position Tab when targetPosition changes
  React.useEffect(() => {
    if (!targetPosition) return;

    const pos = targetPosition.toUpperCase();
    if (["ST", "CF", "RW", "LW", "RF", "LF"].includes(pos))
      setActivePosTab("FW");
    else if (["CAM", "CM", "CDM", "RM", "LM"].includes(pos))
      setActivePosTab("MF");
    else if (["CB", "LB", "RB", "LWB", "RWB", "SW"].includes(pos))
      setActivePosTab("DF");
    else if (["GK"].includes(pos)) setActivePosTab("GK");
    else setActivePosTab("전체");
  }, [targetPosition]);

  // Check if player is currently playing in ANY of the active lineups for this quarter AND which team
  // Moved to FormationPlayerGroupList, but kept here for filteredPlayers logic if needed?
  // Filter logic doesn't use Team info yet. So effectively we can remove getPlayerTeamCurrentQuarter from here
  // IF and only IF filteredPlayers doesn't rely on it.
  // filteredPlayers relies on `activePosTab` which is Position based.

  // Filter Logic
  const filteredPlayers = players.filter((p) => {
    // 1. Search
    if (searchTerm && !p.name.includes(searchTerm)) return false;

    // 2. Position Tab
    if (activePosTab !== "전체") {
      const pos = p.position; // Player's MAIN position
      let mapped = "전체";
      if (["ST", "CF", "RW", "LW", "RF", "LF"].includes(pos)) mapped = "FW";
      else if (["CAM", "CM", "CDM", "RM", "LM"].includes(pos)) mapped = "MF";
      else if (["CB", "LB", "RB", "LWB", "RWB", "SW"].includes(pos))
        mapped = "DF";
      else if (["GK"].includes(pos)) mapped = "GK";

      if (activePosTab === "FW" && mapped !== "FW") return false;
      if (activePosTab === "MF" && mapped !== "MF") return false;
      if (activePosTab === "DF" && mapped !== "DF") return false;
      if (activePosTab === "GK" && mapped !== "GK") return false;
    }

    return true;
  });

  return (
    <aside className="bg-surface-card rounded-xl overflow-hidden h-full flex flex-col border border-border-card shadow-card p-4 gap-6 cursor-default">
      <PlayerListFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activePosTab={activePosTab}
        onPosTabChange={setActivePosTab}
      />
      <Button
        variant="line"
        size="m"
        onClick={() => {
          const name = prompt("새로운 선수의 이름을 입력하세요:");
          if (name && name.trim()) onAddPlayer?.(name.trim());
        }}
        className="flex gap-1 text-Label-Primary font-semibold"
      >
        <Icon src={plus} alt="plus icon" aria-hidden={true} />
        선수 추가
      </Button>

      <FormationPlayerGroupList
        filteredPlayers={filteredPlayers}
        currentQuarterLineups={currentQuarterLineups}
        selectedPlayer={selectedPlayer}
        onSelectPlayer={onSelectPlayer}
        onRemovePlayer={onRemovePlayer}
      />
    </aside>
  );
}
