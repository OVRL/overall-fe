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
            const currentLineup = { ...(q.lineup || {}) };
            let sourceIndex: number | undefined;

            // 드래그한 선수가 이미 이 쿼터의 다른 포지션에 배치되어 있는지 확인하고,
            // 중복 배치를 방지하기 위해 기존 위치에서 먼저 제거합니다.
            Object.keys(currentLineup).forEach((key) => {
              const k = Number(key);
              if (currentLineup[k]?.id === player.id) {
                sourceIndex = k;
                delete currentLineup[k];
              }
            });

            // 타겟 포지션에 이미 다른 선수가 배치되어 있고,
            // 현재 드래그 중인 선수가 같은 쿼터의 다른 위치에서 이동해온 경우라면,
            // 타겟 위치에 있던 선수를 드래그 중인 선수의 기존 위치로 옮겨서 상호 교체(Swap)합니다.
            const targetPlayer = currentLineup[positionIndex];
            if (sourceIndex !== undefined && targetPlayer) {
              currentLineup[sourceIndex] = targetPlayer;
            }

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
