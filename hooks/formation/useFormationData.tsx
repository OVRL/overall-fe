"use client";

import { useState } from "react";
import { Player, QuarterData, TeamType } from "@/types/formation";
// import { FormationType } from "@/components/formation/FormationBoard";
import { INITIAL_PLAYERS } from "@/constants/formation"; // Used for mock data load if needed

export const useFormationData = () => {
  const [mode, setMode] = useState<"MATCHING" | "IN_HOUSE">("MATCHING");
  const [currentQuarterId, setCurrentQuarterId] = useState(1);
  const [quarters, setQuarters] = useState<QuarterData[]>([
    {
      id: 1,
      type: "MATCHING",
      formation: "4-2-3-1",
      lineup: {},
      matchup: { home: "A", away: "B" },
    },
  ]);

  const currentQuarter =
    quarters.find((q) => q.id === currentQuarterId) || quarters[0];

  const addQuarter = () => {
    if (quarters.length >= 10) return;
    const newId = quarters.length + 1;
    const prevQ = quarters[quarters.length - 1];

    setQuarters([
      ...quarters,
      {
        id: newId,
        type: mode,
        formation: prevQ.formation,
        lineup: {},
        teamA: {},
        teamB: {},
        teamC: {},
        teamD: {},
        matchup: prevQ.matchup,
      },
    ]);
    setCurrentQuarterId(newId);
  };

  const updateQuarterLineup = (
    quarterId: number,
    team: string,
    positionId: number,
    player: Player | null,
  ) => {
    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id === quarterId) {
          // @ts-ignore
          const targetLineup = { ...(q[team] || {}) };
          if (player) {
            const existingPos = Object.keys(targetLineup).find(
              (key) => targetLineup[parseInt(key)]?.id === player.id,
            );
            if (existingPos) delete targetLineup[parseInt(existingPos)];
          } else {
            delete targetLineup[positionId];
          }
          if (player) targetLineup[positionId] = player;

          return { ...q, [team]: targetLineup };
        }
        return q;
      }),
    );
  };

  const handleSwap = (
    quarterId: number,
    team: string,
    pos1: number,
    pos2: number,
  ) => {
    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id === quarterId) {
          // @ts-ignore
          const targetLineup = { ...(q[team] || {}) };
          const p1 = targetLineup[pos1];
          const p2 = targetLineup[pos2];
          if (p1) targetLineup[pos2] = p1;
          else delete targetLineup[pos2];
          if (p2) targetLineup[pos1] = p2;
          else delete targetLineup[pos1];
          return { ...q, [team]: targetLineup };
        }
        return q;
      }),
    );
  };

  const handleMatchupChange = (side: "home" | "away", team: TeamType) => {
    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id === currentQuarterId) {
          return { ...q, matchup: { ...q.matchup, [side]: team } };
        }
        return q;
      }),
    );
  };

  const handleReset = () => {
    if (confirm("현재 쿼터를 초기화하시겠습니까?")) {
      setQuarters((prev) =>
        prev.map((q) => {
          if (q.id === currentQuarterId) {
            return {
              ...q,
              lineup: {},
              teamA: {},
              teamB: {},
              teamC: {},
              teamD: {},
            };
          }
          return q;
        }),
      );
    }
  };

  // Team Manager Logic - Force Assign (Steal/Swap)
  const handleForceAssign = (
    quarterId: number,
    targetTeamKey: string,
    targetPos: number,
    player: Player,
  ) => {
    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id === quarterId) {
          const newQ = { ...q };

          // Helper to remove specific player ID from a lineup
          const removePlayerFromLineup = (
            lineup: Record<number, Player | null>,
          ) => {
            const newLineup = { ...lineup };
            let changed = false;
            Object.entries(newLineup).forEach(([pos, p]) => {
              if (p?.id === player.id) {
                delete newLineup[parseInt(pos)];
                changed = true;
              }
            });
            return { modified: newLineup, changed };
          };

          // Check and remove from A, B, C, D
          ["teamA", "teamB", "teamC", "teamD"].forEach((tKey) => {
            // @ts-ignore
            if (newQ[tKey]) {
              // @ts-ignore
              const { modified, changed } = removePlayerFromLineup(newQ[tKey]);
              // @ts-ignore
              if (changed) newQ[tKey] = modified;
            }
          });

          // Add to Target Team
          // @ts-ignore
          const targetLineup = { ...(newQ[targetTeamKey] || {}) };

          // Search for `player`'s old position first to handle Swap logic if needed (simplified here as we removed it above)
          // But wait, if we want to SWAP with the occupant, we need to put the occupant where the player WAS.
          // The previous code had logic for this.

          // Re-implementing Swap logic correctly:
          let oldTeamKey: string | null = null;
          let oldPosId: number | null = null;

          ["teamA", "teamB", "teamC", "teamD"].forEach((tKey) => {
            // @ts-ignore
            const l = q[tKey];
            if (l) {
              Object.entries(l).forEach(([pos, p]) => {
                // @ts-ignore
                if (p?.id === player.id) {
                  oldTeamKey = tKey;
                  oldPosId = parseInt(pos);
                }
              });
            }
          });

          const occupant = targetLineup[targetPos];

          // Updates
          targetLineup[targetPos] = player;
          // @ts-ignore
          newQ[targetTeamKey] = targetLineup;

          if (oldTeamKey && oldPosId !== null && occupant) {
            // @ts-ignore
            const targetOldLineup = { ...(newQ[oldTeamKey] || {}) };
            // We need to be careful because we might have just modified this lineup in newQ[targetTeamKey] if targetTeamKey == oldTeamKey
            // But strict updates are better.
            // If targetTeamKey == oldTeamKey, targetLineup is already updated with `player`.
            // We just need to put occupant there.
            if (targetTeamKey === oldTeamKey) {
              targetLineup[oldPosId] = occupant;
            } else {
              // Different team, simply put occupant in old spot
              // But we already "cleaned" the old spot in the first step (removePlayerFromLineup).
              // So we need to put it back.
              // @ts-ignore
              const oldLineupRef = newQ[oldTeamKey]; // This is the cleaned version
              // @ts-ignore
              newQ[oldTeamKey] = { ...oldLineupRef, [oldPosId]: occupant };
            }
          }

          // Note: The previous logic was slightly different but this captures the intent of swapping.
          // However, to be perfectly safe and match original:
          // Original:
          // 1. removePlayerFromLineup (cleans player from all)
          // 2. set targetLineup[targetPos] = player
          // 3. IF old existed AND occupant existed: targetOldLineup[oldPosId] = occupant.
          // This means we need to "restore" the occupant into the old position.

          // We'll stick to the core logic: "Force Assign" acts as a move, and if someone was there, they might be displaced.
          // For simplicity in this refactor, if we want to exactly match, we should assume the original logic was tested.
          // I will use a slightly simplified version that is robust.

          return newQ;
        }
        return q;
      }),
    );
  };

  const handleLoadMatch = (setActiveTeamsCount: (c: number) => void) => {
    if (
      confirm(
        "지난 경기 기록(예시)을 불러오시겠습니까? 현재 작업 내용은 사라집니다.",
      )
    ) {
      setMode("IN_HOUSE");
      setActiveTeamsCount(3);
      const mockQuarters: QuarterData[] = [
        {
          id: 1,
          type: "IN_HOUSE",
          formation: "4-4-2",
          matchup: { home: "A", away: "B" },
          teamA: { 9: INITIAL_PLAYERS[8], 10: INITIAL_PLAYERS[9] },
          teamB: { 1: INITIAL_PLAYERS[0] },
          teamC: {},
          teamD: {},
        },
        {
          id: 2,
          type: "IN_HOUSE",
          formation: "4-4-2",
          matchup: { home: "A", away: "C" },
          teamA: {},
          teamC: { 11: INITIAL_PLAYERS[1] },
          teamB: {},
          teamD: {},
        },
      ];
      setQuarters(mockQuarters);
      setCurrentQuarterId(1);
    }
  };

  return {
    mode,
    setMode,
    currentQuarterId,
    setCurrentQuarterId,
    quarters,
    setQuarters,
    currentQuarter,
    addQuarter,
    updateQuarterLineup,
    handleSwap,
    handleMatchupChange,
    handleReset,
    handleForceAssign,
    handleLoadMatch,
  };
};
