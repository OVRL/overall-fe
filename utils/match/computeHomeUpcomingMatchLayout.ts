import type { UpcomingMatchDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import {
  buildUpcomingMatchDisplay,
  type MatchForUpcomingDisplay,
} from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { isVoteDeadlinePassedAt } from "@/utils/match/isVoteDeadlinePassed";
import {
  effectiveMatchEndMs,
  matchStartMs,
  pickMostRecentlyEndedMatch,
  pickSoonestAmongNotEndedMatch,
} from "@/utils/match/pickSoonestMatch";

/** 스키마 설명 기준: 종료 후 24시간 MOM 투표 가능 구간 */
export const MOM_VOTE_WINDOW_MS = 24 * 60 * 60 * 1000;

/** 직전 경기 MOM 구간과 다음 경기 안내가 동시에 필요한지 판단할 간격(36h) */
export const MOM_NEXT_MATCH_OVERLAP_GAP_MS = 36 * 60 * 60 * 1000;

/** 단일 카드·직전 경기 MOM(경기 종료)일 때 `MatchHeader` 타이틀 톤 */
export const SINGLE_MOM_ENDED_HEADER_ROW_CLASS = "text-[#f7f8f8]";
/**
 * 캘린더 SVG가 고정 스트로크색이라 `text-*`로는 안 바뀜 → 밝은 회색 톤에 가깝게 보정
 * (`brightness(0) invert(0.968)` ≈ #f7f8f8 근처)
 */
export const SINGLE_MOM_ENDED_HEADER_ICON_CLASS =
  "[filter:brightness(0)_invert(0.968)]";

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
      /** `MatchHeader` 행 (`text-*` 등). 미지정이면 기본 흰 타이틀. */
      headerRowClassName?: string;
      /** `MatchHeader` 캘린더 아이콘. 미지정이면 기본 에셋 색. */
      headerIconClassName?: string;
      /**
       * 포메이션 설정 링크 표시. 미지정이면 화면에서 권한 기준으로 결정.
       * `false`면 숨김(직전 경기 MOM 단일 카드 등).
       */
      showFormationSetup?: boolean;
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
  const end = effectiveMatchEndMs(lastEnded);
  if (!Number.isFinite(end)) return false;
  return nowMs >= end && nowMs < end + MOM_VOTE_WINDOW_MS;
}

function gapBetweenLastEndAndNextStartMs(
  lastEnded: MatchForUpcomingDisplay,
  nextActive: MatchForUpcomingDisplay,
): number {
  const lastEnd = effectiveMatchEndMs(lastEnded);
  const nextStart = matchStartMs(nextActive.matchDate, nextActive.startTime);
  if (!Number.isFinite(lastEnd) || !Number.isFinite(nextStart)) {
    return Number.NaN;
  }
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
    // 스코어는 `lastEnded.homeScore` / `awayScore`가 오면 `buildUpcomingMatchDisplay`가
    // `display.matchScore`에 넣고, `MatchInfo`에서 VS 대신 `3:1` 형태로 표시합니다.
    const momDisplay = buildUpcomingMatchDisplay(lastEnded);
    return {
      kind: "single",
      display: momDisplay,
      primary: { kind: "mom_vote", href: momVoteHref(momDisplay.matchId) },
      sectionTitle: "경기 종료",
      headerRowClassName: SINGLE_MOM_ENDED_HEADER_ROW_CLASS,
      headerIconClassName: SINGLE_MOM_ENDED_HEADER_ICON_CLASS,
      showFormationSetup: false,
    };
  }

  if (active != null) {
    const display = buildUpcomingMatchDisplay(active);
    return {
      kind: "single",
      display,
      primary: computePrimaryForNonMomMatch(active, nowMs),
      sectionTitle: "다가오는 경기",
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
