"use client";

import React, { useState, useMemo } from "react";
import type { Player } from "../_types/player";
import { PLAYER_TABLE_COLUMNS } from "../_constants/playerTableColumns";
import PlayerTable from "./PlayerTable";

interface PlayerListBoardProps {
  initialPlayers: Player[];
  onPlayerClick: (player: Player) => void;
}

const PlayerListBoard = ({
  initialPlayers,
  onPlayerClick,
}: PlayerListBoardProps) => {
  // 검색
  const [searchTerm, setSearchTerm] = useState("");

  // 정렬
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

    // 검색 필터링
    if (searchTerm.trim()) {
      sortablePlayers = sortablePlayers.filter((p) =>
        p.name.includes(searchTerm.trim()),
      );
    }

    // 정렬
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

            // "%" 문자가 포함된 문자열(예: 승률 "68%") 처리
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

  // 검색 액션 (엔터 키 또는 버튼 클릭)
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const player = initialPlayers.find((p) =>
        p.name.includes(searchTerm.trim()),
      );
      if (player) {
        onPlayerClick(player);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section aria-labelledby="player-list-heading">
      <h2 id="player-list-heading" className="sr-only">
        선수 목록 및 검색
      </h2>

      {/* 검색 박스 - PC */}
      <div className="hidden md:flex justify-start gap-2 mb-4 mt-8">
        <label htmlFor="playerSearch" className="sr-only">
          선수명 검색
        </label>
        <div className="flex items-center gap-1">
          <input
            id="playerSearch"
            name="playerSearch"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="선수명 검색"
            autoComplete="off"
            className="w-35 bg-surface-card rounded-[0.625rem] px-4 py-1.5 text-white text-sm focus:outline-none transition-colors placeholder:text-Label-Secondary placeholder:text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-Fill_Quatiary py-1 px-3 h-7.5 rounded-[0.625rem] text-Label-Tertiary text-xs hover:text-white transition-colors"
            aria-label="입력한 이름으로 선수 검색"
          >
            검색
          </button>
        </div>
      </div>

      {/* 선수 테이블 */}
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
