/**
 * findMatchFormation 행 배열에서 isDraft 기준으로 최신(updatedAt) 행만 고릅니다.
 * (SRP: 행 선택만 담당 — 스냅샷 조합은 buildFormationMatchPageSnapshot)
 */

export type MatchFormationRowWithUpdatedAt = {
  readonly isDraft: boolean;
  readonly updatedAt: unknown;
};

function updatedAtToTime(v: unknown): number {
  if (v == null) return 0;
  const t = new Date(String(v)).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function pickLatestInFilteredPool<
  T extends MatchFormationRowWithUpdatedAt,
>(rows: readonly T[], predicate: (r: T) => boolean): T | null {
  const pool = rows.filter(predicate);
  if (pool.length === 0) return null;
  return pool.sort(
    (a, b) => updatedAtToTime(b.updatedAt) - updatedAtToTime(a.updatedAt),
  )[0]!;
}

export function pickLatestConfirmedMatchFormationRow<
  T extends MatchFormationRowWithUpdatedAt,
>(rows: readonly T[] | null | undefined): T | null {
  if (rows == null || rows.length === 0) return null;
  return pickLatestInFilteredPool(rows, (r) => r.isDraft === false);
}

export function pickLatestDraftMatchFormationRow<
  T extends MatchFormationRowWithUpdatedAt,
>(rows: readonly T[] | null | undefined): T | null {
  if (rows == null || rows.length === 0) return null;
  return pickLatestInFilteredPool(rows, (r) => r.isDraft === true);
}
