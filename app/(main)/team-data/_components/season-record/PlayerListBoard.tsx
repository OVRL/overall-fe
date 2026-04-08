"use client";

import React, { useMemo, useState } from "react";
import type { Player } from "../../_types/player";
import { PLAYER_TABLE_COLUMNS } from "../../_constants/playerTableColumns";
import PlayerTable from "./PlayerTable";

interface PlayerListBoardProps {
  /** 서버에서 fetch한 선수 목록 (Page Server Component → props로 주입) */
  initialPlayers: Player[];
  onPlayerClick: (player: Player) => void;
}

const PlayerListBoard = ({
  initialPlayers,
  onPlayerClick,
}: PlayerListBoardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = useMemo(() => {
    let sortablePlayers = [...initialPlayers];
    if (searchTerm.trim()) {
      sortablePlayers = sortablePlayers.filter((p) =>
        p.name.includes(searchTerm.trim()),
      );
    }
    if (sortConfig !== null) {
      const columnDef = PLAYER_TABLE_COLUMNS.find(
        (col) => col.key === sortConfig.key,
      );
      sortablePlayers.sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;
        if (columnDef) {
          if (columnDef.key === "OVR") {
            aValue = a.ovr;
            bValue = b.ovr;
          } else if (columnDef.statsKey) {
            const aRaw = a.stats?.[columnDef.statsKey];
            const bRaw = b.stats?.[columnDef.statsKey];
            if (typeof aRaw === "string" && aRaw.includes("%")) {
              aValue = parseInt(aRaw.replace("%", ""), 10);
            } else {
              aValue = (aRaw as number) || 0;
            }
            if (typeof bRaw === "string" && bRaw.includes("%")) {
              bValue = parseInt(bRaw.replace("%", ""), 10);
            } else {
              bValue = (bRaw as number) || 0;
            }
          }
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortablePlayers;
  }, [sortConfig, searchTerm, initialPlayers]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const player = initialPlayers.find((p) =>
        p.name.includes(searchTerm.trim()),
      );
      if (player) onPlayerClick(player);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section aria-labelledby="player-list-heading">
      <h2 id="player-list-heading" className="sr-only">
        선수 목록 및 검색
      </h2>

      <div className="hidden md:flex justify-start mt-3">
        <label htmlFor="playerSearch" className="sr-only">
          선수명 검색
        </label>
        <div className="flex items-center gap-2 w-full max-w-[380px]">
          <input
            id="playerSearch"
            name="playerSearch"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="선수명 검색"
            autoComplete="off"
            className="flex-1 h-10 bg-surface-card border border-white/5 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-Label-Secondary"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="h-10 bg-Fill_Quatiary px-5 rounded-xl text-Label-Tertiary text-sm font-medium hover:text-white transition-colors whitespace-nowrap"
            aria-label="입력한 이름으로 선수 검색"
          >
            검색
          </button>
        </div>
      </div>

      <PlayerTable
        players={sortedPlayers}
        onPlayerClick={onPlayerClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </section>
  );
};

export default PlayerListBoard;
