/**
 * 포메이션 명단 포지션 필터 칩 순서 (PC `PlayerListFilter`·모바일 `FormationPlayerListMobile` 공통).
 * `useFormationPlayerList`의 `activePosTab` 값과 동일해야 한다.
 */
export const FORMATION_PLAYER_LIST_POSITION_TABS = [
  "전체",
  "FW",
  "MF",
  "DF",
  "GK",
  "용병",
] as const;

export type FormationPlayerListPositionTab =
  (typeof FORMATION_PLAYER_LIST_POSITION_TABS)[number];
