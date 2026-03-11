"use client";

import { useState, useMemo } from "react";
import { Player, QuarterData } from "@/types/formation";
import { INITIAL_PLAYERS } from "@/constants/formation";

export const usePlayerManager = (
  quarters: QuarterData[],
  mode: "MATCHING" | "IN_HOUSE",
) => {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activeTeamsCount, setActiveTeamsCount] = useState(2); // Start with A, B
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );

  // Derived State: Players with Quarter Counts
  const playersWithCounts = useMemo(() => {
    const getPlayerCounts = (playerId: number) => {
      let matchingCount = 0;
      let inHouseCount = 0;

      quarters.forEach((q) => {
        // Matching Count
        if (
          q.lineup &&
          Object.values(q.lineup).some((p) => p?.id === playerId)
        ) {
          matchingCount++;
        }

        // In-House Count
        if (q.teamA && Object.values(q.teamA).some((p) => p?.id === playerId))
          inHouseCount++;
        if (q.teamB && Object.values(q.teamB).some((p) => p?.id === playerId))
          inHouseCount++;
        if (q.teamC && Object.values(q.teamC).some((p) => p?.id === playerId))
          inHouseCount++;
        if (q.teamD && Object.values(q.teamD).some((p) => p?.id === playerId))
          inHouseCount++;
      });

      return { matchingCount, inHouseCount };
    };

    return players.map((p) => {
      const counts = getPlayerCounts(p.id);
      return {
        ...p,
        quarterCount:
          mode === "MATCHING" ? counts.matchingCount : counts.inHouseCount,
      };
    });
  }, [players, quarters, mode]);

  const handleAddPlayer = (name: string) => {
    const maxId = players.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newPlayer: Player = {
      id: maxId + 1,
      name,
      position: "MF",
      number: 0,
      overall: 70,
      age: 20 + Math.floor(Math.random() * 10),
      attendance: Math.floor(Math.random() * 10),
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setTimeout(() => alert(`${name} 선수가 추가되었습니다!`), 100);
  };

  const handleRemovePlayer = (
    playerId: number,
    updateQuarters: (fn: (prev: QuarterData[]) => QuarterData[]) => void,
  ) => {
    // 1. Remove from Players list
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));

    // 2. Remove from ALL Quarters Lineups (Requires setQuarters from parent/useFormationData)
    // We pass the update logic back to the parent via callback or direct setQuarters interaction
    updateQuarters((prev) =>
      prev.map((q) => {
        const newQ = { ...q };

        // Remove from main lineup (Matching)
        if (newQ.lineup) {
          const newLineup = { ...newQ.lineup };
          let changed = false;
          Object.entries(newLineup).forEach(([pos, p]) => {
            if (p?.id === playerId) {
              delete newLineup[parseInt(pos)];
              changed = true;
            }
          });
          if (changed) newQ.lineup = newLineup;
        }

        // Remove from Team A/B/C/D (In-House)
        ["teamA", "teamB", "teamC", "teamD"].forEach((teamKey) => {
          // @ts-ignore
          if (newQ[teamKey]) {
            // @ts-ignore
            const teamLineup = { ...newQ[teamKey] };
            let changed = false;
            Object.entries(teamLineup).forEach(([pos, p]) => {
              // @ts-ignore
              if (p?.id === playerId) {
                delete teamLineup[parseInt(pos)];
                changed = true;
              }
            });
            // @ts-ignore
            if (changed) newQ[teamKey] = teamLineup;
          }
        });

        return newQ;
      }),
    );

    // 3. Clear selection
    if (selectedListPlayer?.id === playerId) setSelectedListPlayer(null);
  };

  const handleAddTeam = () => {
    if (activeTeamsCount >= 4) return;
    setActiveTeamsCount((prev) => prev + 1);
  };

  const handleRemoveTeam = () => {
    if (activeTeamsCount <= 2) return;
    if (
      confirm(
        `${String.fromCharCode(65 + activeTeamsCount - 1)}팀을 삭제하시겠습니까?`,
      )
    ) {
      setActiveTeamsCount((prev) => prev - 1);
    }
  };

  return {
    players,
    playersWithCounts,
    activeTeamsCount,
    setActiveTeamsCount,
    selectedListPlayer,
    setSelectedListPlayer,
    handleAddPlayer,
    handleRemovePlayer,
    handleAddTeam,
    handleRemoveTeam,
  };
};
