"use client";

import { useState } from "react";
import type { Player, StatTabType } from "../_types/player";
import { getPlayerValue } from "../_constants/mockPlayers";
import useModal from "@/hooks/useModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import Dropdown from "@/components/ui/Dropdown";
import DashboardTabMenu from "./DashboardTabMenu";
import HallOfFameBoard from "./hall-of-fame/HallOfFameBoard";
import SeasonRecordSection from "./season-record/SeasonRecordSection";

/** 명예의 전당 기간 선택 옵션 (API 연동 시 동적 생성 가능) */
const HALL_PERIOD_OPTIONS = [
  { label: "통산", value: "통산" },
  { label: "2026 시즌", value: "2026 시즌" },
] as const;

interface TeamDataDashboardProps {
  allPlayers: Player[];
}

const TeamDataDashboard = ({ allPlayers }: TeamDataDashboardProps) => {
  const isMobile = useIsMobile(768);
  const [dataTab, setDataTab] = useState<StatTabType>("시즌기록");
  const [hallPeriod, setHallPeriod] = useState<string>(
    HALL_PERIOD_OPTIONS[0].value,
  );

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
        </div>
      </header>

      <DashboardTabMenu
        activeTab={dataTab}
        onChange={setDataTab}
        trailingContent={
          !isMobile && dataTab === "명예의 전당" ? (
            <Dropdown
              value={hallPeriod}
              onChange={setHallPeriod}
              options={[...HALL_PERIOD_OPTIONS]}
              className="w-24 min-w-24"
            />
          ) : undefined
        }
      />

      {isMobile && dataTab === "명예의 전당" ? (
        <div className="mb-4 w-full">
          <Dropdown
            value={hallPeriod}
            onChange={setHallPeriod}
            options={[...HALL_PERIOD_OPTIONS]}
            triggerClassName="py-1.5 h-10"
          />
        </div>
      ) : null}

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
          <HallOfFameBoard
            period={hallPeriod}
            onPlayerClick={handlePlayerClick}
          />
        )}
      </main>
    </>
  );
};

export default TeamDataDashboard;
