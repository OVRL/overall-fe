import type { Player } from "@/types/formation";

/** 명단·필터·정렬 — 경기 용병 행은 MF가 아닌 독립 도메인으로 취급 */
export function isMercenaryFormationPlayer(p: Player): boolean {
  return p.rosterKind === "MERCENARY" || p.position === "용병";
}
