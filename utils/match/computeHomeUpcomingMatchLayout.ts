import type { UpcomingMatchDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import {
  buildUpcomingMatchDisplay,
  type MatchForUpcomingDisplay,
} from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { isVoteDeadlinePassedAt } from "@/utils/match/isVoteDeadlinePassed";
import {
  matchEndMs,
  matchStartMs,
  pickMostRecentlyEndedMatch,
  pickSoonestAmongNotEndedMatch,
} from "@/utils/match/pickSoonestMatch";

/** 스키마 설명 기준: 종료 후 24시간 MOM 투표 가능 구간 */
export const MOM_VOTE_WINDOW_MS = 24 * 60 * 60 * 1000;

/** 직전 경기 MOM 구간과 다음 경기 안내가 동시에 필요한지 판단할 간격(36h) */
export const MOM_NEXT_MATCH_OVERLAP_GAP_MS = 36 * 60 * 60 * 1000;

export type HomePrimaryCta =
  | { kind: "mom_vote"; href: string }
  | { kind: "attendance" }
  | { kind: "formation_preparing" }
  | { kind: "formation_confirm"; matchId: number }
  | { kind: "copy_team_code" };

export type HomeUpcomingMatchLayout =
  | { kind: "empty" }
  | { kind: "copy_only" }
  | {
      kind: "split";
      topMom: { display: UpcomingMatchDisplay; momHref: string };
      bottom: {
        display: UpcomingMatchDisplay;
        primary: HomePrimaryCta;
        sectionTitle: string;
      };
    }
  | {
      kind: "single";
      display: UpcomingMatchDisplay;
      primary: HomePrimaryCta;
      /** 카드 헤더 타이틀 (기본: 다가오는 경기) */
      sectionTitle: string;
      /** MOM 집중 카드일 때 하단에 보여 줄 다음 경기 요약 */
      teaserDisplay: UpcomingMatchDisplay | null;
    };

function momVoteHref(matchId: string): string {
  const n = parseNumericIdFromRelayGlobalId(matchId);
  return n != null
    ? `/team-management/mom?matchId=${n}`
    : `/team-management/mom`;
}

function isMomVotingWindowOpen(
  lastEnded: MatchForUpcomingDisplay,
  nowMs: number,
): boolean {
  const end = matchEndMs(lastEnded.matchDate, lastEnded.endTime);
  return nowMs >= end && nowMs < end + MOM_VOTE_WINDOW_MS;
}

function gapBetweenLastEndAndNextStartMs(
  lastEnded: MatchForUpcomingDisplay,
  nextActive: MatchForUpcomingDisplay,
): number {
  const lastEnd = matchEndMs(lastEnded.matchDate, lastEnded.endTime);
  const nextStart = matchStartMs(nextActive.matchDate, nextActive.startTime);
  return nextStart - lastEnd;
}

/**
 * 직전 종료 경기 MOM 구간 + (있으면) 다음/진행 중 경기 카드의 CTA를 계산합니다.
 * — MOM 본인 투표 여부는 스키마에 없어 기간 중에는 항상 MOM 진입을 노출합니다.
 */
export function computeHomeUpcomingMatchLayout(
  matches: MatchForUpcomingDisplay[],
  nowMs: number = Date.now(),
): HomeUpcomingMatchLayout {
  if (matches.length === 0) {
    return { kind: "empty" };
  }

  const lastEnded = pickMostRecentlyEndedMatch(matches, nowMs);
  const active = pickSoonestAmongNotEndedMatch(matches, nowMs);
  const momOpen = lastEnded != null && isMomVotingWindowOpen(lastEnded, nowMs);

  if (momOpen && lastEnded != null && active != null) {
    const gap = gapBetweenLastEndAndNextStartMs(lastEnded, active);
    if (gap >= 0 && gap < MOM_NEXT_MATCH_OVERLAP_GAP_MS) {
      return {
        kind: "split",
        topMom: {
          display: buildUpcomingMatchDisplay(lastEnded),
          momHref: momVoteHref(buildUpcomingMatchDisplay(lastEnded).matchId),
        },
        bottom: {
          display: buildUpcomingMatchDisplay(active),
          primary: computePrimaryForNonMomMatch(active, nowMs),
          sectionTitle: "다가오는 경기",
        },
      };
    }
  }

  if (momOpen && lastEnded != null) {
    const momDisplay = buildUpcomingMatchDisplay(lastEnded);
    return {
      kind: "single",
      display: momDisplay,
      primary: { kind: "mom_vote", href: momVoteHref(momDisplay.matchId) },
      sectionTitle: "직전 경기 (MOM)",
      teaserDisplay:
        active != null ? buildUpcomingMatchDisplay(active) : null,
    };
  }

  if (active != null) {
    const display = buildUpcomingMatchDisplay(active);
    return {
      kind: "single",
      display,
      primary: computePrimaryForNonMomMatch(active, nowMs),
      sectionTitle: "다가오는 경기",
      teaserDisplay: null,
    };
  }

  return { kind: "copy_only" };
}

function computePrimaryForNonMomMatch(
  match: MatchForUpcomingDisplay,
  nowMs: number,
): HomePrimaryCta {
  if (!isVoteDeadlinePassedAt(match.voteDeadline, nowMs)) {
    return { kind: "attendance" };
  }
  if (match.isFormationDraft === true) {
    return { kind: "formation_preparing" };
  }
  const display = buildUpcomingMatchDisplay(match);
  const matchId =
    parseNumericIdFromRelayGlobalId(display.matchId) ??
    parseNumericIdFromRelayGlobalId(match.id as string | number);
  if (matchId == null) {
    return { kind: "formation_preparing" };
  }
  return {
    kind: "formation_confirm",
    matchId,
  };
}
