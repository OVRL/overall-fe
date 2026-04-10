import { useState, useCallback } from "react";
import { Player, QuarterData } from "@/types/formation";

const defaultQuarter: QuarterData = {
  id: 1,
  type: "IN_HOUSE",
  formation: "4-3-3",
  matchup: { home: "A", away: "B" },
  lineup: {},
};

/** 내전(IN_HOUSE)일 때 어느 팀 슬롯을 수정할지 (저장 시 tactics.teams.A|B와 동기화) */
export type InHouseSubTeam = "A" | "B";

export type FormationSlotAssignOptions = {
  inHouseSubTeam?: InHouseSubTeam;
};

function applyAssignToSlotRecord(
  base: Record<number, Player | null> | undefined,
  positionIndex: number,
  player: Player,
): Record<number, Player | null> {
  const slots = { ...(base || {}) };
  let sourceIndex: number | undefined;

  Object.keys(slots).forEach((key) => {
    const k = Number(key);
    if (slots[k]?.id === player.id) {
      sourceIndex = k;
      delete slots[k];
    }
  });

  const targetPlayer = slots[positionIndex];
  if (sourceIndex !== undefined && targetPlayer) {
    slots[sourceIndex] = targetPlayer;
  }

  slots[positionIndex] = player;
  return slots;
}

export const useFormationManager = (initialQuarters?: QuarterData[]) => {
  const [quarters, setQuarters] = useState<QuarterData[]>(
    initialQuarters?.length ? initialQuarters : [defaultQuarter],
  );

  const assignPlayer = useCallback(
    (
      quarterId: number,
      positionIndex: number,
      player: Player,
      options?: FormationSlotAssignOptions,
    ) => {
      setQuarters((prev) =>
        prev.map((q) => {
          if (q.id !== quarterId) return q;

          if (q.type === "MATCHING") {
            const next = applyAssignToSlotRecord(
              q.lineup,
              positionIndex,
              player,
            );
            return { ...q, lineup: next };
          }

          const sub: InHouseSubTeam =
            options?.inHouseSubTeam === "B" ? "B" : "A";
          const teamKey = sub === "B" ? "teamB" : "teamA";
          const nextTeam = applyAssignToSlotRecord(
            q[teamKey],
            positionIndex,
            player,
          );
          return {
            ...q,
            [teamKey]: nextTeam,
            lineup: nextTeam,
          };
        }),
      );
    },
    [],
  );

  const removePlayer = useCallback(
    (
      quarterId: number,
      positionIndex: number,
      options?: FormationSlotAssignOptions,
    ) => {
      setQuarters((prev) =>
        prev.map((q) => {
          if (q.id !== quarterId) return q;

          if (q.type === "MATCHING") {
            const newLineup = { ...(q.lineup || {}) };
            delete newLineup[positionIndex];
            return { ...q, lineup: newLineup };
          }

          const sub: InHouseSubTeam =
            options?.inHouseSubTeam === "B" ? "B" : "A";
          const teamKey = sub === "B" ? "teamB" : "teamA";
          const newTeam = { ...(q[teamKey] || {}) };
          delete newTeam[positionIndex];
          return {
            ...q,
            [teamKey]: newTeam,
            lineup: newTeam,
          };
        }),
      );
    },
    [],
  );

  const getAssignedQuarters = useCallback(
    (playerId: number) => {
      const assignedQuarterIds: number[] = [];
      quarters.forEach((q) => {
        if (q.type === "IN_HOUSE") {
          const inA = Object.values(q.teamA ?? {}).some(
            (p) => p && p.id === playerId,
          );
          const inB = Object.values(q.teamB ?? {}).some(
            (p) => p && p.id === playerId,
          );
          const inLineup = Object.values(q.lineup ?? {}).some(
            (p) => p && p.id === playerId,
          );
          if (inA || inB || inLineup) assignedQuarterIds.push(q.id);
          return;
        }
        const lineup = q.lineup || {};
        if (Object.values(lineup).some((p) => p && p.id === playerId)) {
          assignedQuarterIds.push(q.id);
        }
      });
      return assignedQuarterIds;
    },
    [quarters],
  );

  const addQuarter = useCallback(() => {
    setQuarters((prev) => {
      if (prev.length >= 10) return prev;
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((q) => q.id)) + 1 : 1;
      const lastQuarter = prev.length > 0 ? prev[prev.length - 1] : null;

      const newQuarter: QuarterData = {
        id: nextId,
        type: "IN_HOUSE",
        formation: lastQuarter ? lastQuarter.formation : "4-3-3",
        matchup: lastQuarter
          ? { ...lastQuarter.matchup }
          : { home: "A", away: "B" },
        lineup: {}, // New quarter starts with empty lineup by default, or you can copy
      };

      return [...prev, newQuarter];
    });
  }, []);

  const resetQuarters = useCallback(() => {
    setQuarters(initialQuarters?.length ? initialQuarters : [defaultQuarter]);
  }, [initialQuarters]);

  return {
    quarters,
    setQuarters,
    assignPlayer,
    removePlayer,
    getAssignedQuarters,
    addQuarter,
    resetQuarters,
  };
};
