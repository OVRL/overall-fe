import React from "react";
import { notFound } from "next/navigation";

// Components
import MatchScheduleCard from "@/components/formation/MatchScheduleCard";
import FormationBuilder from "../_components/FormationBuilder";
import FormationHeader from "../_components/FormationHeader";

// Mock Data
import { MOCK_PLAYERS } from "@/constants/mock-players";
import { matchToScheduleCardData } from "@/lib/formation/matchToScheduleCardProps";
import { verifyFormationMatchAccessSSR } from "@/utils/verifyFormationMatchAccessSSR";

type FormationMatchPageProps = {
  params: Promise<{ matchId: string }>;
};

/**
 * URL의 matchId는 신뢰하지 않고 서버에서
 * (세션 쿠키 + 선택 팀 소속 + findMatch 목록)으로 소유권을 재검증합니다.
 * 실패 시 404로 응답해 다른 팀 경기 존재 여부를 노출하지 않습니다.
 */
export default async function FormationMatchPage({
  params,
}: FormationMatchPageProps) {
  const { matchId: matchIdFromPath } = await params;

  if (process.env.NODE_ENV === "development") {
    console.log("[formation/[matchId]] params.matchId (raw)", matchIdFromPath);
  }

  if (matchIdFromPath == null || matchIdFromPath === "") {
    if (process.env.NODE_ENV === "development") {
      console.log("[formation/[matchId]] 비어 있음 → notFound");
    }
    notFound();
  }

  const decodedMatchId = decodeURIComponent(matchIdFromPath);
  if (process.env.NODE_ENV === "development") {
    console.log(
      "[formation/[matchId]] verifyFormationMatchAccessSSR 입력",
      decodedMatchId,
    );
  }

  const access = await verifyFormationMatchAccessSSR(decodedMatchId);

  if (process.env.NODE_ENV === "development") {
    console.log("[formation/[matchId]] 검증 결과", {
      ok: access.ok,
      matchId: access.ok ? access.match.id : null,
    });
  }

  if (!access.ok) {
    if (process.env.NODE_ENV === "development") {
      console.log("[formation/[matchId]] 검증 실패 → notFound");
    }
    notFound();
  }

  const scheduleProps = matchToScheduleCardData(access.match);
  const scheduleCard = (
    <MatchScheduleCard
      matchScheduleLine={scheduleProps.matchScheduleLine}
      venue={scheduleProps.venue}
      opponent={scheduleProps.opponent}
      opponentRecord={scheduleProps.opponentRecord}
      uniformDesign={scheduleProps.uniformDesign}
      uniformKindLabel={scheduleProps.uniformKindLabel}
      opponentEmblemSrc={scheduleProps.opponentEmblemSrc}
    />
  );

  return (
    <div className="min-h-dvh pt-safe bg-surface-primary flex flex-col">
      <FormationHeader />
      <main className="flex-1 flex flex-col px-3 md:px-6 py-4 w-full items-center bg-surface-primary">
        <FormationBuilder
          scheduleCard={scheduleCard}
          initialPlayers={MOCK_PLAYERS}
          matchQuarterSpec={{
            quarterCount: access.match.quarterCount,
            quarterDurationMinutes: access.match.quarterDuration,
            matchType: access.match.matchType,
          }}
        />
      </main>
    </div>
  );
}
