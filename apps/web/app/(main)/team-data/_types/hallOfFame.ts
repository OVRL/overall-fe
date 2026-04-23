/**
 * 명예의 전당 기록 카테고리 타입 (아이콘 및 라벨 매핑용)
 */
export type HallOfFameCategoryType =
  | "goal"      // 통산 최다 득점
  | "assist"    // 통산 최다 도움
  | "starter"  // 통산 최다 기점
  | "defence"   // 통산 최다 클린시트
  | "attend";   // 통산 최다 출장

/** 카드 내 선수 정보 (모달 연동 시 id 사용) */
export interface HallOfFamePlayerInfo {
  id?: number;
  name: string;
  image?: string;
  value: number | string;
  unit: string;
  yearOverYear?: string;
}

/** 피처 카드(큰 카드) 1건 데이터 */
export interface HallOfFameFeatureItem {
  categoryType: HallOfFameCategoryType;
  categoryLabel: string;
  player: HallOfFamePlayerInfo;
}

/** 기록 카드(작은 카드) 1건 데이터 */
export interface HallOfFameRecordItem {
  categoryType: HallOfFameCategoryType;
  categoryLabel: string;
  player: HallOfFamePlayerInfo;
}
