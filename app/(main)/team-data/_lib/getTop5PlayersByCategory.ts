import type { Player } from "../_types/player";
import {
  PLAYER_TABLE_COLUMNS,
  type PlayerTableColumnConfig,
} from "../_constants/playerTableColumns";

/** 정렬 가능 컬럼 키 목록 (OverallModel 숫자 필드와 대응) */
export const SORTABLE_RANKING_CATEGORY_KEYS = PLAYER_TABLE_COLUMNS.filter(
  (c) => c.sortable,
).map((c) => c.key);

/**
 * 정렬용 숫자 추출. OVR은 player.ovr, 그 외는 stats[statsKey] 사용.
 * 승률(%) 문자열은 숫자로 파싱하여 비교.
 */
function getNumericValueForSort(
  player: Player,
  col: PlayerTableColumnConfig,
): number {
  if (col.key === "OVR") return player.ovr;
  if (!col.statsKey) return 0;
  const raw = player.stats?.[col.statsKey];
  if (raw == null) return 0;
  if (typeof raw === "string" && raw.includes("%")) {
    return parseInt(raw.replace("%", ""), 10) || 0;
  }
  return Number(raw) || 0;
}

/**
 * 카테고리 기준 내림차순 정렬된 선수 배열을 반환합니다.
 * (원본 배열을 변경하지 않습니다.)
 */
export function getSortedPlayersByCategory(
  players: Player[],
  categoryKey: string,
): Player[] {
  const col = PLAYER_TABLE_COLUMNS.find((c) => c.key === categoryKey);
  if (!col || !col.sortable) return [...players];

  return [...players].sort((a, b) => {
    const aVal = getNumericValueForSort(a, col);
    const bVal = getNumericValueForSort(b, col);
    return bVal - aVal;
  });
}

/**
 * 카테고리 기준 내림차순 정렬 후 상위 5명을 반환합니다.
 */
export function getTop5PlayersByCategory(
  players: Player[],
  categoryKey: string,
): Player[] {
  return getSortedPlayersByCategory(players, categoryKey).slice(0, 5);
}
