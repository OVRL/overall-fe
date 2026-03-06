"use client";

import { useState } from "react";
import type { Player, StatTabType } from "../_types/player";
import { getPlayerValue } from "../_constants/mockPlayers";
import RankingCarousel from "./RankingCarousel";
import useModal from "@/hooks/useModal";
import PlayerListBoard from "./PlayerListBoard";
import Dropdown from "@/components/ui/Dropdown";
import DashboardTabMenu from "./DashboardTabMenu";

interface TeamDataDashboardProps {
  allPlayers: Player[];
}

const TeamDataDashboard = ({ allPlayers }: TeamDataDashboardProps) => {
  const [selectedSeason, setSelectedSeason] = useState("2026 시즌");
  const [dataTab, setDataTab] = useState<StatTabType>("시즌기록");

  const { openModal: openStatRankingModal } = useModal(
    "TEAM_DATA_STAT_RANKING",
  );
  const { openModal: openPlayerDetailModal } = useModal(
    "TEAM_DATA_PLAYER_DETAIL",
  );

  // 더보기 클릭
  const handleMoreClick = (category: string, players: Player[]) => {
    openStatRankingModal({
      category,
      players: players.map((p) => ({
        ...p,
        value: getPlayerValue(p, category),
      })),
      onPlayerClick: handlePlayerClick,
    });
  };

  // 선수 클릭
  const handlePlayerClick = (player: Player) => {
    openPlayerDetailModal({ player });
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-[1.75rem] md:text-3xl font-extrabold text-Label-Primary">
          팀 데이터
        </h1>

        {/* 시즌 선택 드롭다운 */}
        <div className="relative z-40">
          <Dropdown
            options={[{ label: "2026 시즌", value: "2026 시즌" }]}
            value={selectedSeason}
            onChange={setSelectedSeason}
          />
        </div>
      </div>

      <DashboardTabMenu activeTab={dataTab} onChange={setDataTab} />

      {/* 순위 카드 그리드 - 투명 배경, 스크롤 버튼 */}
      <RankingCarousel
        onMoreClick={handleMoreClick}
        onPlayerClick={handlePlayerClick}
      />

      <PlayerListBoard
        initialPlayers={allPlayers}
        onPlayerClick={handlePlayerClick}
      />
    </>
  );
};

export default TeamDataDashboard;
