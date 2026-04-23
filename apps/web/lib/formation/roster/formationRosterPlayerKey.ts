import type { Player } from "@/types/formation";

/**
 * 명단 내 선수 고유 키 — 팀원 `id`와 용병 `id`가 숫자로 겹칠 수 있어 rosterKind로 구분한다.
 * @see docs/formation-roster-mercenary-relay-refactor.md
 */
export function getFormationRosterPlayerKey(player: Player): string {
  if (player.rosterKind === "MERCENARY") {
    const mid = player.mercenaryId ?? player.id;
    return `m:${mid}`;
  }
  return `t:${player.id}`;
}

export function isSameFormationRosterPlayer(a: Player, b: Player): boolean {
  return getFormationRosterPlayerKey(a) === getFormationRosterPlayerKey(b);
}
