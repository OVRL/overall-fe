"use client";

import { useMemo } from "react";
import StartingXIView, { type StartingXIProps } from "./StartingXIView";
import { useBestElevenQuery } from "@/components/team-management/hooks/useBestElevenQuery";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { buildQuarterDataFromTacticsDocument } from "@/lib/formation/buildQuarterDataFromTacticsDocument";
import { createFormationLineupResolver } from "@/lib/formation/roster/createFormationLineupResolver";
import { pickPrimaryBestElevenRow } from "@/lib/formation/pickPrimaryBestElevenRow";
import { FORMATION_POSITIONS } from "@/constants/formations";
import type { FormationType } from "@/constants/formation";
import type { Player as FormationPlayer } from "@/types/formation";
import type { Player as HomePlayer } from "@/types/player";
import type { Position } from "@/types/position";
import {
  getPlayerPlaceholderSrc,
  resolveTeamMemberCardImageUrl,
} from "@/lib/playerPlaceholderImage";

function mapFormationPlayerToHomePlayer(p: FormationPlayer): HomePlayer {
  const ovr = p.overall;
  const pos = (p.position || "CM") as Position;
  return {
    id: p.id,
    name: p.name,
    position: pos,
    number: p.number,
    overall: ovr,
    shooting: ovr,
    passing: ovr,
    dribbling: ovr,
    defending: ovr,
    physical: ovr,
    pace: ovr,
    image: p.image,
    imageFallbackUrl: getPlayerPlaceholderSrc(`t:${p.id}`),
  };
}

type Props = Omit<StartingXIProps, "players"> & {
  teamId: number;
  /** 팀 미선택·로딩 전 등 `useBestElevenQuery` 밖에서 쓰는 목업/초기 선수 */
  fallbackPlayers: HomePlayer[];
};

/**
 * 선택 팀이 있을 때 베스트11(`tactics` 문서)을 조회해 Starting XI에 반영합니다.
 */
export default function HomeStartingXIWithBestEleven({
  teamId,
  isSoloTeam,
  fallbackPlayers,
  onPlayersChange,
  onPlayerSelect,
}: Props) {
  const data = useBestElevenQuery(teamId);

  const formationPlayers: FormationPlayer[] = useMemo(() => {
    const members = data.findManyTeamMember?.members ?? [];
    const out: FormationPlayer[] = [];
    for (const m of members as any[]) {
      const tmId = parseNumericIdFromRelayGlobalId(m.id);
      if (tmId == null) continue;
      out.push({
        id: tmId,
        name: m.user?.name || "알 수 없음",
        image: resolveTeamMemberCardImageUrl(m),
        position: m.preferredPosition || "-",
        number: m.preferredNumber || 0,
        overall: m.overall?.ovr || 0,
      });
    }
    return out;
  }, [data.findManyTeamMember]);

  const { formation, slotHomePlayers } = useMemo(() => {
    if (isSoloTeam) {
      return { formation: null as FormationType | null, slotHomePlayers: null };
    }
    const primary = pickPrimaryBestElevenRow(data.findBestEleven ?? []);
    if (primary?.tactics == null) {
      return { formation: null as FormationType | null, slotHomePlayers: null };
    }
    const quarters = buildQuarterDataFromTacticsDocument(
      primary.tactics,
      { quarterCount: 1, matchType: "MATCH" },
      createFormationLineupResolver(formationPlayers),
    );
    const q1 = quarters.find((q) => q.id === 1) ?? quarters[0];
    if (q1 == null || q1.type !== "MATCHING") {
      return { formation: null as FormationType | null, slotHomePlayers: null };
    }
    const fmt = q1.formation as FormationType;
    const keys = FORMATION_POSITIONS[fmt] ?? [];
    const slots: Array<FormationPlayer | null> = keys.map(
      (_, i) => q1.lineup?.[i] ?? null,
    );
    const hasAny = slots.some((p) => p != null);
    if (!hasAny) {
      return { formation: null as FormationType | null, slotHomePlayers: null };
    }
    return {
      formation: fmt,
      slotHomePlayers: slots.map((p) => (p ? mapFormationPlayerToHomePlayer(p) : null)),
    };
  }, [data.findBestEleven, formationPlayers, isSoloTeam]);

  const displayPlayers =
    slotHomePlayers?.filter((p): p is HomePlayer => p != null) ?? fallbackPlayers;

  return (
    <StartingXIView
      players={displayPlayers}
      isSoloTeam={isSoloTeam}
      onPlayersChange={onPlayersChange}
      onPlayerSelect={onPlayerSelect}
      bestElevenFormation={formation}
      bestElevenSlotPlayers={slotHomePlayers}
    />
  );
}
