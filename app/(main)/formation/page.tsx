import React from "react";

// Components
import MatchScheduleCard from "@/components/formation/MatchScheduleCard";
import FormationBuilder from "./_components/FormationBuilder";

// Mock Data
import { MOCK_PLAYERS } from "@/constants/mock-players";

export default function FormationPage() {
  const scheduleCard = (
    <MatchScheduleCard
      // 목 데이터 - 실제 앱에서는 DB에서 Fetch 후 props로 전달 (SSR)
      matchDate="2026-02-03(목)"
      matchTime="18:00~20:00"
      stadium="수원 월드컵 보조 구장 A"
      opponent="FC 빠름셀로나"
      opponentRecord="전적 2승 1무 1패"
      homeUniform="빨강"
    />
  );

  return (
    <main className="flex-1 bg-surface-primary flex flex-col px-3 md:px-6 py-4 w-full items-center">
      <FormationBuilder
        scheduleCard={scheduleCard}
        initialPlayers={MOCK_PLAYERS}
      />
    </main>
  );
}
