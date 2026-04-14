import type { Player } from "@/types/formation";

export type MatchMercenaryRowLike = {
  readonly id: number;
  readonly name: string;
  readonly teamId: number;
} | null;

/**
 * `matchMercenaries` 응답 → 포메이션 `Player` (팀 스코프 필터).
 */
export function matchMercenaryRowsToPlayers(
  rows: readonly MatchMercenaryRowLike[],
  teamId: number,
): Player[] {
  const out: Player[] = [];
  for (const row of rows) {
    if (row == null || row.teamId !== teamId) continue;
    const name = row.name.trim() || "이름 없음";
    out.push({
      id: row.id,
      rosterKind: "MERCENARY",
      mercenaryId: row.id,
      name,
      position: "용병",
      number: 0,
      overall: 0,
      imageFallbackUrl: null,
    });
  }
  return out;
}
