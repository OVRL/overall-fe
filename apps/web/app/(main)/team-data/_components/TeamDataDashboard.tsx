"use client";

import { useState } from "react";
import type { Player, StatTabType } from "../_types/player";
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
  initialPlayers: Player[];
}

const TeamDataDashboard = ({ initialPlayers }: TeamDataDashboardProps) => {
  const isMobile = useIsMobile(768);
  const [dataTab, setDataTab] = useState<StatTabType>("시즌기록");
  const [hallPeriod, setHallPeriod] = useState<string>(
    HALL_PERIOD_OPTIONS[0].value,
  );

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-[1.75rem] font-extrabold text-Label-Primary">
            선수 기록
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
              className="w-32 min-w-32"
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
            triggerClassName="py-1.5 h-12"
          />
        </div>
      ) : null}

      <main
        role="tabpanel"
        id="team-data-tabpanel"
        aria-labelledby="team-data-tabs"
      >
        {dataTab === "시즌기록" ? (
          <SeasonRecordSection allPlayers={initialPlayers} />
        ) : (
          <HallOfFameBoard />
        )}
      </main>
    </>
  );
};

export default TeamDataDashboard;
