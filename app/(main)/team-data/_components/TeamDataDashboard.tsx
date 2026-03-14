"use client";

import { useState } from "react";
import type { Player, StatTabType } from "../_types/player";
import { getPlayerValue } from "../_constants/mockPlayers";
import useModal from "@/hooks/useModal";
import Dropdown from "@/components/ui/Dropdown";
import DashboardTabMenu from "./DashboardTabMenu";
import HallOfFameBoard from "./hall-of-fame/HallOfFameBoard";
import SeasonRecordSection from "./season-record/SeasonRecordSection";

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
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-[1.75rem] md:text-3xl font-extrabold text-Label-Primary">
            팀 데이터
          </h1>
          <div className="relative z-40" aria-label="시즌 선택">
            <Dropdown
              options={[{ label: "2026 시즌", value: "2026 시즌" }]}
              value={selectedSeason}
              onChange={setSelectedSeason}
            />
          </div>
        </div>
      </header>

      <DashboardTabMenu activeTab={dataTab} onChange={setDataTab} />

      <main
        role="tabpanel"
        id="team-data-tabpanel"
        aria-labelledby="team-data-tabs"
      >
        {dataTab === "시즌기록" ? (
          <SeasonRecordSection
            onMoreClick={handleMoreClick}
            onPlayerClick={handlePlayerClick}
            allPlayers={allPlayers}
          />
        ) : (
          <HallOfFameBoard onPlayerClick={handlePlayerClick} />
        )}
      </main>
    </>
  );
};

export default TeamDataDashboard;
