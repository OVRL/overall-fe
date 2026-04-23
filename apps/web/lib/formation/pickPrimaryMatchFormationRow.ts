/**
 * `findMatchFormation` 배열에서 UI·저장 플로우에 쓸 행을 고릅니다.
 * — **id가 가장 큰** 행을 기준으로 한다 (updatedAt 정렬 아님).
 */

export type MatchFormationRowLike = {
  readonly id: number;
  readonly isDraft: boolean;
};

function maxIdRow<T extends { id: number }>(
  rows: readonly T[] | null | undefined,
): T | null {
  if (rows == null || rows.length === 0) return null;
  return rows.reduce((a, b) => (a.id > b.id ? a : b));
}

/** `isDraft === true`인 행만 모아 id가 가장 큰 행 (없으면 null). */
export function pickLatestDraftMatchFormationRow<
  T extends MatchFormationRowLike,
>(rows: readonly T[] | null | undefined): T | null {
  if (rows == null || rows.length === 0) return null;
  const drafts = rows.filter((r) => r.isDraft === true);
  return maxIdRow(drafts);
}

/** `isDraft === false`인 행만 모아 id가 가장 큰 행 (없으면 null). */
export function pickLatestConfirmedMatchFormationRow<
  T extends MatchFormationRowLike,
>(rows: readonly T[] | null | undefined): T | null {
  if (rows == null || rows.length === 0) return null;
  const confirmed = rows.filter((r) => r.isDraft === false);
  return maxIdRow(confirmed);
}

/**
 * 초기 보드·`tactics` 복원에 쓸 단일 행.
 * — 확정본이 하나라도 있으면 **확정 중 id 최대**, 없으면 **드래프트 중 id 최대**.
 */
export function pickPrimaryMatchFormationRow<
  T extends MatchFormationRowLike,
>(rows: readonly T[] | null | undefined): T | null {
  const confirmed = pickLatestConfirmedMatchFormationRow(rows);
  if (confirmed != null) return confirmed;
  return pickLatestDraftMatchFormationRow(rows);
}
