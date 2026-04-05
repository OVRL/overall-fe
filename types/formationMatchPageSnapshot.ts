import type { Player, QuarterData } from "@/types/formation";

/** 경기 메타 — 쿼터 수·유형 (서버/클라이언트 공통) */
export type FormationMatchQuarterSpec = {
  quarterCount: number;
  matchType: "MATCH" | "INTERNAL";
};

/**
 * 포메이션 경기 페이지 SSR 스냅샷 (직렬화 가능).
 * `initialQuarters`가 null이면 저장본 없음 → 기본 빈 쿼터 보드.
 */
export type FormationMatchPageSnapshot = {
  players: Player[];
  initialQuarters: QuarterData[] | null;
};
