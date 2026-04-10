/**
 * findMatchFormation 배열에서 UI에 쓸 단일 행을 고릅니다.
 * — 확정본(isDraft=false)이 있으면 그중 최신(updatedAt), 없으면 드래프트 중 최신.
 */
export type MatchFormationRowLike = {
  readonly isDraft: boolean;
  readonly updatedAt: unknown;
};

function updatedAtToTime(v: unknown): number {
  if (v == null) return 0;
  const t = new Date(String(v)).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function pickPrimaryMatchFormationRow<
  T extends MatchFormationRowLike,
>(rows: readonly T[] | null | undefined): T | null {
  if (rows == null || rows.length === 0) return null;
  const confirmed = rows.filter((r) => r.isDraft === false);
  const pool = confirmed.length > 0 ? confirmed : [...rows];
  return pool.sort(
    (a, b) => updatedAtToTime(b.updatedAt) - updatedAtToTime(a.updatedAt),
  )[0]!;
}
