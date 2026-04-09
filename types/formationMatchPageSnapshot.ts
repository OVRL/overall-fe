import type { Player, QuarterData } from "@/types/formation";

/** 경기 메타 — 쿼터 수·유형 (서버/클라이언트 공통) */
export type FormationMatchQuarterSpec = {
  quarterCount: number;
  matchType: "MATCH" | "INTERNAL";
};

/** 초기 보드를 채운 데이터 출처 (안내 배너·이탈 가드 등과 연동) */
export type FormationMatchInitialBoardSource = "empty" | "draft" | "confirmed";

/**
 * 포메이션 경기 페이지 SSR 스냅샷 (직렬화 가능).
 * `initialQuarters`가 null이면 저장본 없음 → 기본 빈 쿼터 보드.
 */
export type FormationMatchPageSnapshot = {
  players: Player[];
  initialQuarters: QuarterData[] | null;
  /** `initialQuarters`를 만든 행 기준(확정 우선·없으면 최신 드래프트) */
  initialBoardSource: FormationMatchInitialBoardSource;
  /** 복원에 사용한 `findMatchFormation` 행 id */
  boardRowId: number | null;
  /** 최신 확정 행 id (없으면 null) */
  confirmedFormationId: number | null;
  /**
   * 임시저장(드래프트) 최신 행 id.
   * 확정 행이 있으면 null — 서버가 드래프트를 파기한다는 전제(클라는 update 경로로 잘못 잡지 않음).
   */
  draftFormationId: number | null;
};
