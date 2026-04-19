"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import type { HomeUpcomingMatchLayoutSnapshot } from "@/lib/relay/ssr/buildHomeUpcomingMatchLayoutSnapshot";
import {
  computeHomeUpcomingMatchLayout,
  type HomeUpcomingMatchLayout,
} from "@/utils/match/computeHomeUpcomingMatchLayout";

/**
 * 홈 다가오는 경기 레이아웃.
 *
 * `loadLayoutSSR`에서 만든 스냅샷 팀과 현재 선택 팀이 같으면 **`layout` 객체를 그대로** 씁니다.
 * `computedAtMs`만 맞춰서 `compute`를 다시 호출해도, 클라이언트에서 `findMatch`가
 * 빈 배열→채워짐처럼 바뀌면 `copy_only`로 떨어질 수 있어(경기 종료 → 팀 코드 초대),
 * 스냅샷을 직접 쓰는 편이 SSR HTML과 구조적으로 일치합니다.
 *
 * 다른 팀으로 바꾼 뒤에는 스냅샷이 해당 팀용이 아니므로 Relay 매치 + **이펙트에서 잡은 시각**으로 계산합니다.
 * (`Date.now()`는 렌더/`useMemo` 안에서 호출하지 않음 — React Compiler 순수성 규칙)
 */
export function useResolvedHomeUpcomingMatchLayout(
  selectedTeamIdNum: number | null,
  ssrSnapshot: HomeUpcomingMatchLayoutSnapshot | null,
  relayMatches: MatchForUpcomingDisplay[],
): HomeUpcomingMatchLayout {
  const ssrAligned =
    ssrSnapshot != null &&
    selectedTeamIdNum != null &&
    ssrSnapshot.createdTeamId === selectedTeamIdNum;

  const [nonSsrNowMs, setNonSsrNowMs] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (ssrAligned) return;
    queueMicrotask(() => {
      setNonSsrNowMs(Date.now());
    });
  }, [ssrAligned, relayMatches]);

  return useMemo(() => {
    if (ssrAligned) {
      return ssrSnapshot!.layout;
    }
    const nowMs = nonSsrNowMs ?? 0;
    return computeHomeUpcomingMatchLayout(relayMatches, nowMs);
  }, [relayMatches, ssrAligned, ssrSnapshot, nonSsrNowMs]);
}
