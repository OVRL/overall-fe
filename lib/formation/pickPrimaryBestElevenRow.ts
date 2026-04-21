import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";

type RowWithIdTactics = {
  readonly id: string | number;
  readonly tactics?: unknown | null;
};

function rowNumericId(row: RowWithIdTactics): number {
  return parseNumericIdFromRelayGlobalId(row.id) ?? 0;
}

/**
 * `findBestEleven` 배열에서 UI에 쓸 1건을 고릅니다.
 * `tactics`가 있는 행이 있으면 그중 id 최대, 없으면 전체 중 id 최대.
 */
export function pickPrimaryBestElevenRow<T extends RowWithIdTactics>(
  rows: readonly T[],
): T | null {
  const validRows = rows.filter((r) => r != null);
  if (validRows.length === 0) return null;

  const withTactics = validRows.filter(
    (r) => r.tactics != null && typeof r.tactics === "object",
  );
  const pool = withTactics.length > 0 ? withTactics : [...validRows];
  return pool.reduce((best, cur) =>
    rowNumericId(cur) > rowNumericId(best) ? cur : best,
  );
}
