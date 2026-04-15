import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import {
  MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
  MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_LEGACY,
} from "@/types/matchFormationTacticsDocument";

/**
 * 저장된 `tactics` JSON에서 내전 팀 드래프트 맵만 추출합니다.
 * 스키마가 맞지 않거나 필드가 없으면 `{}`.
 */
export function extractInHouseDraftTeamByKeyFromTactics(
  tacticsRaw: unknown,
): InHouseDraftTeamByPlayerKey {
  if (tacticsRaw == null || typeof tacticsRaw !== "object") return {};
  const o = tacticsRaw as Record<string, unknown>;
  const ver = o.schemaVersion;
  if (
    ver !== MATCH_FORMATION_TACTICS_DOCUMENT_VERSION &&
    ver !== MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_LEGACY
  ) {
    return {};
  }
  const rawDraft = o.inHouseDraftTeamByKey;
  if (rawDraft == null || typeof rawDraft !== "object" || Array.isArray(rawDraft)) {
    return {};
  }
  const out: InHouseDraftTeamByPlayerKey = {};
  for (const [k, v] of Object.entries(rawDraft)) {
    if (typeof k !== "string" || k.length === 0) continue;
    if (v === "A" || v === "B") out[k] = v;
  }
  return out;
}
