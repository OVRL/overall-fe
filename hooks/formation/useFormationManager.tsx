import { useState, useCallback } from "react";
import { Player, QuarterData } from "@/types/formation";

export const useFormationManager = (initialQuarters?: QuarterData[]) => {
  const defaultQuarter: QuarterData = {
    id: 1,
    type: "IN_HOUSE",
    formation: "4-3-3",
    matchup: { home: "A", away: "B" },
    lineup: {},
  };

  const [quarters, setQuarters] = useState<QuarterData[]>(
    initialQuarters?.length ? initialQuarters : [defaultQuarter],
  );

  const assignPlayer = useCallback(
    (quarterId: number, positionIndex: number, player: Player) => {
      setQuarters((prev) =>
        prev.map((q) => {
          if (q.id === quarterId) {
            // Check if player is already assigned somewhere else in this quarter
            // and remove them there first to prevent duplicates
            const currentLineup = { ...(q.lineup || {}) };

            Object.keys(currentLineup).forEach((key) => {
              const k = Number(key);
              if (currentLineup[k]?.id === player.id) {
                delete currentLineup[k];
              }
            });

            return {
              ...q,
              lineup: {
                ...currentLineup,
                [positionIndex]: player,
              },
            };
          }
          return q;
        }),
      );
    },
    [],
  );

  const removePlayer = useCallback(
    (quarterId: number, positionIndex: number) => {
      setQuarters((prev) =>
        prev.map((q) => {
          if (q.id === quarterId) {
            const newLineup = { ...q.lineup };
            delete newLineup[positionIndex];
            return { ...q, lineup: newLineup };
          }
          return q;
        }),
      );
    },
    [],
  );

  const getAssignedQuarters = useCallback(
    (playerId: number) => {
      const assignedQuarterIds: number[] = [];
      quarters.forEach((q) => {
        const lineup = q.lineup || {};
        const isAssigned = Object.values(lineup).some(
          (p) => p && p.id === playerId,
        );
        if (isAssigned) {
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

  return {
    quarters,
    setQuarters,
    assignPlayer,
    removePlayer,
    getAssignedQuarters,
    addQuarter,
  };
};
