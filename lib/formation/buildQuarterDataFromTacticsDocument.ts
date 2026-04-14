import type { FormationType } from "@/constants/formation";
import type { Player, QuarterData } from "@/types/formation";
import type { FormationSlotKey } from "@/types/matchFormationTactics";
import {
  MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
  MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_LEGACY,
  type MatchFormationTacticsDocument,
} from "@/types/matchFormationTacticsDocument";
import { buildQuartersFromMatch } from "@/lib/formation/buildQuartersFromMatch";
import type { FormationMatchQuarterSpec } from "@/types/formationMatchPageSnapshot";
import { normalizeTacticsSlotPlayerRef } from "@/lib/formation/normalizeTacticsSlotPlayerRef";
import type { FormationLineupResolver } from "@/lib/formation/roster/createFormationLineupResolver";

function isFormationType(v: unknown): v is FormationType {
  return typeof v === "string" && v.length > 0;
}

function parseTacticsDocument(raw: unknown): MatchFormationTacticsDocument | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const ver = o.schemaVersion;
  if (
    ver !== MATCH_FORMATION_TACTICS_DOCUMENT_VERSION &&
    ver !== MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_LEGACY
  ) {
    return null;
  }
  if (o.matchType !== "MATCH" && o.matchType !== "INTERNAL") return null;
  if (!Array.isArray(o.quarters)) return null;
  return raw as MatchFormationTacticsDocument;
}

function slotMapToLineup(
  lineup: Partial<Record<FormationSlotKey, unknown>>,
  resolve: FormationLineupResolver,
): Record<number, Player | null> {
  const out: Record<number, Player | null> = {};
  for (const key of Object.keys(lineup)) {
    const ref = normalizeTacticsSlotPlayerRef(lineup[key as FormationSlotKey]);
    if (ref == null) continue;
    const p = resolve(ref);
    if (p != null) out[Number(key)] = p;
  }
  return out;
}

/**
 * 저장된 tactics 문서 + 경기 스펙 → UI용 QuarterData[].
 * — 경기 쿼터 수와 문서가 어긋나면 `buildQuartersFromMatch` 베이스에 quarterId로 오버레이합니다.
 */
export function buildQuarterDataFromTacticsDocument(
  tacticsRaw: unknown,
  spec: FormationMatchQuarterSpec,
  resolvePlayer: FormationLineupResolver,
): QuarterData[] {
  const doc = parseTacticsDocument(tacticsRaw);
  const base = buildQuartersFromMatch(spec.quarterCount, spec.matchType);
  if (doc == null) return base;

  return base.map((q) => {
    const snap = doc.quarters.find((s) => s.quarterId === q.id);
    if (snap == null) return q;

    if (snap.kind === "MATCHING") {
      const formation = isFormationType(snap.formation)
        ? snap.formation
        : q.formation;
      return {
        ...q,
        type: "MATCHING",
        formation,
        lineup: slotMapToLineup(snap.lineup ?? {}, resolvePlayer),
      };
    }

    const formation = isFormationType(snap.teams.A.formation)
      ? snap.teams.A.formation
      : q.formation;
    const teamA = slotMapToLineup(snap.teams.A.lineup ?? {}, resolvePlayer);
    const teamB = slotMapToLineup(snap.teams.B.lineup ?? {}, resolvePlayer);
    return {
      ...q,
      type: "IN_HOUSE",
      formation,
      teamA,
      teamB,
      lineup: { ...teamA },
    };
  });
}
