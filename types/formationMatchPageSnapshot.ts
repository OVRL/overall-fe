import type { Player, QuarterData } from "@/types/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";

/** 경기 메타 — 쿼터 수·유형 (서버/클라이언트 공통) */
export type FormationMatchQuarterSpec = {
  quarterCount: number;
  matchType: "MATCH" | "INTERNAL";
};

/** `pickPrimaryMatchFormationRow`가 고른 행이 확정인지 드래프트인지 — 저장 분기와 UI 초기 출처 일치 */
export type FormationMatchFormationPrimarySource = "confirmed" | "draft";

/**
 * 포메이션 경기 페이지 SSR 스냅샷 (직렬화 가능).
 * `initialQuarters`가 null이면 저장본 없음 → 기본 빈 쿼터 보드.
 */
export type FormationMatchPageSnapshot = {
  players: Player[];
  initialQuarters: QuarterData[] | null;
  /** `tactics.inHouseDraftTeamByKey` 복원 — 없으면 `{}` */
  initialInHouseDraftTeamByKey: InHouseDraftTeamByPlayerKey;
  /**
   * `findMatchFormation` 중 `isDraft === true`인 행의 **최대 id** (없으면 null).
   * 임시저장 `updateMatchFormation`·확정 `confirmMatchFormation`에 사용.
   */
  savedDraftMatchFormationId: number | null;
  /**
   * `isDraft === false`인 행의 **최대 id** (없으면 null).
   * 확정만 있을 때 `updateMatchFormation`으로 전술 갱신.
   */
  savedLatestConfirmedMatchFormationId: number | null;
  /**
   * `initialQuarters`를 만든 `findMatchFormation` 행이 확정이면 `confirmed`, 아니면 `draft`.
   * 행이 없거나 tactics 없음으로 스킵이면 null.
   */
  savedInitialFormationPrimarySource: FormationMatchFormationPrimarySource | null;
  /**
   * 초기 `tactics`를 준 `MatchFormation` 행의 id·isDraft·`updatedAt` 문자열.
   * 저장 후 `router.refresh()` / 전체 새로고침 시 서버 값이 바뀌면 달라지므로, 클라이언트 `quarters`를 SSR 데이터와 맞출 때 사용한다.
   */
  savedInitialFormationSourceRevision: string | null;
};
