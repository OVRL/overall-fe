"use client";

import React, { useState } from "react";

// Hooks
import { useFormationData } from "@/hooks/formation/useFormationData";

// Components
import FormationControls from "@/components/formation/FormationControls";
import FormationPlayerList from "@/components/formation/FormationPlayerList";
import MatchScheduleCard from "@/components/formation/MatchScheduleCard";
import FormationBoardList from "@/components/formation/FormationBoardList";
import { Player } from "@/types/formation";

// Mock Data
import { MOCK_PLAYERS } from "@/constants/mock-players";

export default function FormationPage() {
  // 1. Data Hooks - Simplified
  const { quarters, setQuarters, addQuarter } = useFormationData();
  const [currentQuarterId, setCurrentQuarterId] = useState<number>(1);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );

  return (
    <main className="flex-1 bg-surface-primary flex flex-col px-3 md:px-6 py-4 w-full items-center">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
        {/* Left Section (Controls + Formation Board) */}
        <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0 transition-all duration-300">
          <MatchScheduleCard
            // 목 데이터 - 실제 앱에서는 props로 전달
            matchDate="2026-02-03(목)"
            matchTime="18:00~20:00"
            stadium="수원 월드컵 보조 구장 A"
            opponent="FC 빠름셀로나"
            opponentRecord="전적 2승 1무 1패"
            homeUniform="빨강"
          />

          {/* 1. 컨트롤 (Controls) */}
          <FormationControls
            currentQuarterId={currentQuarterId}
            setCurrentQuarterId={setCurrentQuarterId}
            quarters={quarters}
            addQuarter={addQuarter}
          />

          {/* 2. 포메이션 보드 그리드 (Formation Boards) */}
          <FormationBoardList quarters={quarters} setQuarters={setQuarters} />
        </div>

        {/* Right Section (Sidebar / Player List) */}
        <FormationPlayerList
          players={MOCK_PLAYERS}
          currentQuarterLineups={quarters.map((q) => q.lineup || {})}
          selectedPlayer={selectedListPlayer}
          onSelectPlayer={setSelectedListPlayer}
          isLineupFull={false}
          onAddPlayer={() => {}}
          onRemovePlayer={() => {}}
          activePosition={null}
        />
      </div>
    </main>
  );
}
