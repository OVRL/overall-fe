"use client";

import { useCallback, useState } from "react";
import type { Player } from "@/types/formation";
import {
  getFormationRosterPlayerKey,
} from "@/lib/formation/roster/formationRosterPlayerKey";

/** 팀 드래프트에서 선수별 A/B 배정 — null은 미배정 */
export type InHouseDraftTeamChoice = "A" | "B" | null;

export type InHouseDraftTeamByPlayerKey = Record<string, "A" | "B">;

/**
 * 내전 팀 드래프트용 A/B 배정 상태 — UI(데스크톱/모바일)와 무관하게 동일 규칙으로 갱신한다.
 */
export function useInHouseDraftTeamAssignments() {
  const [draftTeamByKey, setDraftTeamByKey] =
    useState<InHouseDraftTeamByPlayerKey>({});

  const setDraftTeam = useCallback((player: Player, team: InHouseDraftTeamChoice) => {
    const key = getFormationRosterPlayerKey(player);
    setDraftTeamByKey((prev) => {
      if (team === null) {
        if (!(key in prev)) return prev;
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      if (prev[key] === team) return prev;
      return { ...prev, [key]: team };
    });
  }, []);

  const getDraftTeam = useCallback(
    (player: Player): InHouseDraftTeamChoice => {
      const v = draftTeamByKey[getFormationRosterPlayerKey(player)];
      return v ?? null;
    },
    [draftTeamByKey],
  );

  const resetDraftAssignments = useCallback(() => {
    setDraftTeamByKey({});
  }, []);

  return {
    draftTeamByKey,
    setDraftTeam,
    getDraftTeam,
    resetDraftAssignments,
  };
}
