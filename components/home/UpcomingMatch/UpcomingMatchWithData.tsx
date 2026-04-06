"use client";

import { useLazyLoadQuery } from "react-relay";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import type { MatchForUpcomingDisplay } from "./upcomingMatchDisplay";
import { buildUpcomingMatchDisplay } from "./upcomingMatchDisplay";
import { pickSoonestUpcomingMatch } from "@/utils/match/pickSoonestMatch";
import NoUpcomingMatch from "./NoUpcomingMatch";
import OnboardingUpcomingMatch from "./OnboardingUpcomingMatch";
import UpcomingMatchDesktop from "./UpcomingMatchDesktop";
import UpcomingMatchMobile from "./UpcomingMatchMobile";

/** 다가오는 경기 없을 때: 팀원 1명이면 온보딩, 2명 이상이면 NoUpcomingMatch */
function NoMatchContent({
  isSoloTeam,
  teamId,
}: {
  isSoloTeam: boolean;
  teamId: number | null;
}) {
  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
      {isSoloTeam ? (
        <OnboardingUpcomingMatch key={teamId ?? "no-team"} teamId={teamId} />
      ) : (
        <NoUpcomingMatch />
      )}
    </div>
  );
}

/**
 * Relay 스토어에서 findMatch를 읽어 다가오는 경기 1건을 표시
 * 경기 없을 때 팀원 1명이면 온보딩, 2명 이상이면 NoUpcomingMatch.
 */
export default function UpcomingMatchWithData() {
  const { selectedTeamIdNum, isSoloTeam } = useSelectedTeamId();

  if (selectedTeamIdNum == null) {
    return <NoMatchContent isSoloTeam={isSoloTeam} teamId={null} />;
  }

  return (
    <UpcomingMatchWithQuery
      createdTeamId={selectedTeamIdNum}
      isSoloTeam={isSoloTeam}
    />
  );
}

function UpcomingMatchWithQuery({
  createdTeamId,
  isSoloTeam,
}: {
  createdTeamId: number;
  isSoloTeam: boolean;
}) {
  const data = useLazyLoadQuery<findMatchQuery>(
    FindMatchQuery,
    { createdTeamId },
    { fetchPolicy: "store-or-network" },
  );

  const matches = (data?.findMatch ??
    []) as unknown as MatchForUpcomingDisplay[];
  const soonest = pickSoonestUpcomingMatch(matches);
  const display = soonest ? buildUpcomingMatchDisplay(soonest) : null;

  // 개발 시 API(스토어) 기준 목록과 pickSoonestUpcomingMatch 선택값 확인 (브라우저 콘솔 + RSC 1차 렌더 시 서버 로그)
  if (process.env.NODE_ENV === "development") {
    const runtime = typeof window !== "undefined" ? "client" : "server";
    // pickedSoonest: pickSoonestUpcomingMatch()가 고른 1건 (현재 시각 이후 시작만)
    console.log("[UpcomingMatchWithData] findMatch Relay 데이터", {
      runtime,
      createdTeamId,
      rawCount: matches.length,
      matches: matches.map((m) => ({
        id: m.id,
        matchDate: m.matchDate,
        startTime: m.startTime,
        matchType: m.matchType,
      })),
      pickedSoonest: soonest
        ? {
            id: soonest.id,
            matchDate: soonest.matchDate,
            startTime: soonest.startTime,
            matchType: soonest.matchType,
          }
        : null,
    });
  }

  if (display == null) {
    return <NoMatchContent isSoloTeam={isSoloTeam} teamId={createdTeamId} />;
  }

  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 border border-border-card">
      <UpcomingMatchMobile display={display} />
      <UpcomingMatchDesktop display={display} />
    </div>
  );
}
