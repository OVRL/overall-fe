"use client";

import { useEffect, useMemo, useState } from "react";
import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import type { HomeUpcomingMatchLayoutSnapshot } from "@/lib/relay/ssr/buildHomeUpcomingMatchLayoutSnapshot";
import {
  computeHomeUpcomingMatchLayout,
  type HomeUpcomingMatchLayout,
} from "@/utils/match/computeHomeUpcomingMatchLayout";

/**
 * 하이드레이션 전: SSR 스냅샷(팀 ID 일치 시)과 동일한 레이아웃을 유지합니다.
 * 하이드레이션 후: Relay `findMatch` 기준으로 매번 재계산합니다.
 */
export function useResolvedHomeUpcomingMatchLayout(
  selectedTeamIdNum: number | null,
  ssrSnapshot: HomeUpcomingMatchLayoutSnapshot | null,
  relayMatches: MatchForUpcomingDisplay[],
): HomeUpcomingMatchLayout {
  const liveLayout = useMemo(
    () => computeHomeUpcomingMatchLayout(relayMatches),
    [relayMatches],
  );

  const ssrAligned =
    ssrSnapshot != null &&
    selectedTeamIdNum != null &&
    ssrSnapshot.createdTeamId === selectedTeamIdNum;

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated && ssrAligned) {
    return ssrSnapshot.layout;
  }
  return liveLayout;
}
