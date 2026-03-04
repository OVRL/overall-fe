"use client";

import React, { useState, useMemo } from "react";
import type { Player } from "./_types/player";
import { allPlayers, getPlayerValue } from "./_constants/mockPlayers";
import RankingCarousel from "./_components/RankingCarousel";
import StatsModal from "./_components/StatsModal";
import PlayerDetailModal from "./_components/PlayerDetailModal";
import PlayerTable from "./_components/PlayerTable/PlayerTable";
import Dropdown from "@/components/ui/Dropdown";

export default function TeamDataPage() {
  const [activeTab, setActiveTab] = useState("2026 시즌");

  // 모달 상태
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [modalPlayers, setModalPlayers] = useState<Player[]>([]);

  const [isPlayerDetailOpen, setIsPlayerDetailOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

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
    let sortablePlayers = [...allPlayers];

    // 검색 필터링
    if (searchTerm.trim()) {
      sortablePlayers = sortablePlayers.filter((p) =>
        p.name.includes(searchTerm.trim()),
      );
    }

    // 정렬
    if (sortConfig !== null) {
      sortablePlayers.sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        // 데이터 매핑
        switch (sortConfig.key) {
          case "OVR":
            aValue = a.ovr;
            bValue = b.ovr;
            break;
          case "출장수":
            aValue = a.stats?.출장 || 0;
            bValue = b.stats?.출장 || 0;
            break;
          case "득점":
            aValue = a.stats?.득점 || 0;
            bValue = b.stats?.득점 || 0;
            break;
          case "도움":
            aValue = a.stats?.도움 || 0;
            bValue = b.stats?.도움 || 0;
            break;
          case "기점":
            aValue = a.stats?.기점 || 0;
            bValue = b.stats?.기점 || 0;
            break;
          case "공격P":
            aValue = a.stats?.공격P || 0;
            bValue = b.stats?.공격P || 0;
            break;
          case "클린시트":
            aValue = a.stats?.클린시트 || 0;
            bValue = b.stats?.클린시트 || 0;
            break;
          case "MOM3":
            aValue = a.stats?.MOM3 || 0;
            bValue = b.stats?.MOM3 || 0;
            break;
          case "승률":
            // "68%" -> 68
            aValue = parseInt(
              (a.stats?.승률 || "0").toString().replace("%", ""),
            );
            bValue = parseInt(
              (b.stats?.승률 || "0").toString().replace("%", ""),
            );
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortablePlayers;
  }, [sortConfig, searchTerm]);

  // 더보기 클릭
  const handleMoreClick = (category: string, players: Player[]) => {
    setModalCategory(category);
    setModalPlayers(
      players.map((p) => ({ ...p, value: getPlayerValue(p, category) })),
    );
    setIsStatsModalOpen(true);
  };

  // 선수 클릭
  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerDetailOpen(true);
  };

  // 검색
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const player = allPlayers.find((p) => p.name.includes(searchTerm.trim()));
      if (player) {
        handlePlayerClick(player);
      }
    }
  };

  return (
    <div className="flex-1 bg-black">
      <main className="max-w-[1400px] mx-auto px-4 py-6 md:px-8 md:py-8">
        {/* 페이지 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-[1.75rem] md:text-3xl font-extrabold text-Label-Primary">
            팀 데이터
          </h1>

          {/* 시즌 선택 드롭다운 */}
          <div className="relative z-40">
            <Dropdown
              options={[{ label: "2026 시즌", value: "2026 시즌" }]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {/* 순위 카드 그리드 - 투명 배경, 스크롤 버튼 */}
        <RankingCarousel
          onMoreClick={handleMoreClick}
          onPlayerClick={handlePlayerClick}
        />

        {/* 검색 박스 - PC (기존 디자인: 아이콘 포함, 왼쪽 정렬) */}
        <div className="hidden md:flex justify-start gap-2 mb-4 mt-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="선수 검색"
              className="w-35 bg-surface-card rounded-[0.625rem] px-10 py-1 text-white text-sm focus:outline-none  transition-colors"
            />
            <button
              onClick={handleSearch}
              className="text-gray-400 hover:text-white"
            >
              검색
            </button>
          </div>
        </div>

        {/* 선수 테이블 */}
        <PlayerTable
          players={sortedPlayers}
          onPlayerClick={handlePlayerClick}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </main>

      {/* 선수 상세 모달 */}
      <PlayerDetailModal
        isOpen={isPlayerDetailOpen}
        onClose={() => setIsPlayerDetailOpen(false)}
        player={selectedPlayer}
      />

      {/* 더보기 통계 모달 */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        category={modalCategory}
        players={modalPlayers}
        onPlayerClick={handlePlayerClick}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
