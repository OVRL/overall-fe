import type { findMatchQuery$data } from "@/__generated__/findMatchQuery.graphql";
import { computeHomeUpcomingMatchLayout } from "@/utils/match/computeHomeUpcomingMatchLayout";
import type { HomeUpcomingMatchLayout } from "@/utils/match/computeHomeUpcomingMatchLayout";
import { mapFindMatchNodesToMatchForUpcomingDisplay } from "./mapFindMatchToUpcomingDisplay";

/**
 * SSR 시점에 고정해 내려보내는 홈 다가오는 경기 레이아웃 스냅샷.
 * `createdTeamId`로 클라이언트에서 팀 전환 시 폐기 여부를 판단합니다.
 */
export type HomeUpcomingMatchLayoutSnapshot = {
  readonly createdTeamId: number;
  readonly layout: HomeUpcomingMatchLayout;
  readonly computedAtMs: number;
};

/**
 * `findMatch` 응답과 요청 시각으로 스냅샷을 만듭니다.
 * (쿼리 실행은 `loadLayoutSSR` 책임 — 본 함수는 파생만 담당)
 */
export function buildHomeUpcomingMatchLayoutSnapshot(
  createdTeamId: number,
  findMatchNodes: findMatchQuery$data["findMatch"] | null | undefined,
  nowMs: number,
): HomeUpcomingMatchLayoutSnapshot {
  const matches = mapFindMatchNodesToMatchForUpcomingDisplay(findMatchNodes);
  const layout = computeHomeUpcomingMatchLayout(matches, nowMs);
  return {
    createdTeamId,
    layout,
    computedAtMs: nowMs,
  };
}
