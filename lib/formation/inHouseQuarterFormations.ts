import type { FormationType } from "@/constants/formation";
import type { QuarterData } from "@/types/formation";

/** 내전 쿼터에서 팀별 포메이션 (미설정 시 `formation`으로 폴백 — 구데이터 호환). */
export function getInHouseFormationForTeam(
  q: QuarterData,
  team: "A" | "B",
): FormationType {
  if (q.type !== "IN_HOUSE") return q.formation;
  if (team === "A") return q.formationTeamA ?? q.formation;
  return q.formationTeamB ?? q.formation;
}

/** IN_HOUSE 쿼터에 `formationTeamA` / `formationTeamB`를 명시적으로 채운다. */
export function withInHouseFormationsNormalized(q: QuarterData): QuarterData {
  if (q.type !== "IN_HOUSE") return q;
  const formationTeamA = q.formationTeamA ?? q.formation;
  const formationTeamB = q.formationTeamB ?? q.formation;
  return { ...q, formationTeamA, formationTeamB };
}
