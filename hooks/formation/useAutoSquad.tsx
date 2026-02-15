import { useState } from "react";
import { Player, QuarterData, TeamType } from "@/types/formation";
import { FormationType } from "@/components/formation/FormationBoard";

export const useAutoSquad = (
  players: Player[],
  mode: "MATCHING" | "IN_HOUSE",
  activeTeamsCount: number,
  setQuarters: (qs: QuarterData[]) => void,
  setCurrentQuarterId: (id: number) => void,
) => {
  const [isOpen, setIsOpen] = useState(false);

  // Available teams based on count
  const availableTeams = ["A", "B", "C", "D"].slice(0, activeTeamsCount);

  const handleAutoSquad = (
    quartersCount: number,
    selectedFormation: FormationType,
    teamPools?: Record<string, Player[]>,
  ) => {
    setIsOpen(false);
    const newQuarters: QuarterData[] = [];

    // --- Algorithm ---
    const generateScheduleForPool = (
      poolPlayers: Player[],
      quarters: number,
    ): Record<number, Record<number, Player>> => {
      const resultSchedule: Record<number, Record<number, Player>> = {};
      for (let i = 1; i <= quarters; i++) resultSchedule[i] = {};

      const playerCount = poolPlayers.length;
      if (playerCount === 0) return resultSchedule;

      const slotsPerGame = 11;
      const totalSlots = quarters * slotsPerGame;

      // 1. Specialized Roles
      const gkSpecialists = poolPlayers.filter((p) => p.position === "GK");
      const hasGK = gkSpecialists.length > 0;

      // 2. Target Quota Calculation
      const baseQuota = Math.floor(totalSlots / playerCount);
      const remainder = totalSlots % playerCount;

      // Sort by Priority
      const getPriority = (p: Player) =>
        (p.attendance || 0) * 1000 + (p.age || 0) * 10 + (p.overall || 0) * 0.1;
      const sortedPool = [...poolPlayers].sort(
        (a, b) => getPriority(b) - getPriority(a),
      );

      const targetCounts: Record<number, number> = {};
      const currentCounts: Record<number, number> = {};
      const lastPlayedQ: Record<number, number> = {};

      sortedPool.forEach((p, idx) => {
        targetCounts[p.id] = baseQuota + (idx < remainder ? 1 : 0);
        currentCounts[p.id] = 0;
        lastPlayedQ[p.id] = 0;
      });

      // 3. Role Helpers
      const formationsRoles: Record<string, Record<number, string>> = {
        "4-2-3-1": {
          1: "GK",
          2: "LB",
          3: "CB",
          4: "CB",
          5: "RB",
          6: "CDM",
          7: "CDM",
          8: "CAM",
          9: "LW",
          10: "RW",
          11: "ST",
        },
        "4-4-2": {
          1: "GK",
          2: "LB",
          3: "CB",
          4: "CB",
          5: "RB",
          6: "LM",
          7: "CM",
          8: "CM",
          9: "RM",
          10: "ST",
          11: "ST",
        },
        "4-3-3": {
          1: "GK",
          2: "LB",
          3: "CB",
          4: "CB",
          5: "RB",
          6: "CDM",
          7: "CM",
          8: "CM",
          9: "LW",
          10: "RW",
          11: "ST",
        },
        "3-5-2": {
          1: "GK",
          2: "CB",
          3: "CB",
          4: "CB",
          5: "LM",
          6: "CDM",
          7: "CDM",
          8: "RM",
          9: "CAM",
          10: "ST",
          11: "ST",
        },
      };
      const targetRoles =
        formationsRoles[selectedFormation] || formationsRoles["4-2-3-1"];

      const isRoleMatch = (playerPos: string, role: string) => {
        if (role === "GK") return playerPos === "GK";
        if (["LB", "CB", "RB", "LWB", "RWB"].includes(role))
          return ["LB", "CB", "RB", "LWB", "RWB", "DF"].includes(playerPos);
        if (["CDM", "CM", "CAM", "LM", "RM"].includes(role))
          return ["CDM", "CM", "CAM", "LM", "RM", "MF"].includes(playerPos);
        if (["ST", "CF", "LW", "RW"].includes(role))
          return ["ST", "CF", "LW", "RW", "FW"].includes(playerPos);
        return true;
      };

      // 4. Generation Loop
      for (let q = 1; q <= quarters; q++) {
        const lineup: Record<number, Player> = {};
        const assignedIds = new Set<number>();
        const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        const calculateScore = (p: Player, role: string) => {
          const played = currentCounts[p.id];
          const target = targetCounts[p.id];
          const leftToPlay = target - played;
          const quartersRemaining = quarters - q + 1;

          if (leftToPlay <= 0) return -10000;

          let score = 0;

          if (leftToPlay >= quartersRemaining) {
            score += 100000;
          }

          const lastQ = lastPlayedQ[p.id];
          if (q > 1 && lastQ === q - 1) {
            score -= 50;
          } else {
            score += 500;
            if (q > 2 && lastQ < q - 2) {
              score += 2000;
            }
          }

          if (role === "GK") {
            if (hasGK) {
              if (p.position === "GK") score += 5000;
              else score -= 10000;
            }
          } else {
            if (isRoleMatch(p.position, role)) score += 200;
            else score -= 100;
          }

          score += getPriority(p) * 0.001;
          return score;
        };

        const filledSlots = new Set<number>();

        // GK
        if (slots.includes(1)) {
          const role = "GK";
          let candidates = sortedPool.filter((p) => !assignedIds.has(p.id));
          candidates = candidates
            .map((p) => ({ p, score: calculateScore(p, role) }))
            .sort((a, b) => b.score - a.score)
            .map((item) => item.p);

          if (candidates.length > 0) {
            const best = candidates[0];
            lineup[1] = best;
            assignedIds.add(best.id);
            currentCounts[best.id]++;
            lastPlayedQ[best.id] = q;
            filledSlots.add(1);
          }
        }

        // Remaining
        const remainingSlots = slots.filter((s) => !filledSlots.has(s));
        remainingSlots.forEach((pos) => {
          const role = targetRoles[pos];
          const candidates = sortedPool.filter((p) => !assignedIds.has(p.id));

          const scored = candidates
            .map((p) => ({ p, score: calculateScore(p, role) }))
            .sort((a, b) => b.score - a.score);

          if (scored.length > 0) {
            const best = scored[0].p;
            lineup[pos] = best;
            assignedIds.add(best.id);
            currentCounts[best.id]++;
            lastPlayedQ[best.id] = q;
          }
        });

        resultSchedule[q] = lineup;
      }

      return resultSchedule;
    };

    // --- Execution ---
    if (mode === "IN_HOUSE" && teamPools) {
      const schedules: Record<
        string,
        Record<number, Record<number, Player>>
      > = {};
      availableTeams.forEach((team) => {
        const pool = teamPools[team] || [];
        schedules[team] = generateScheduleForPool(pool, quartersCount);
      });

      for (let i = 1; i <= quartersCount; i++) {
        newQuarters.push({
          id: i,
          type: "IN_HOUSE",
          formation: selectedFormation,
          matchup: { home: "A", away: "B" },
          teamA: schedules["A"]?.[i] || {},
          teamB: schedules["B"]?.[i] || {},
          teamC: schedules["C"]?.[i] || {},
          teamD: schedules["D"]?.[i] || {},
        });
      }
    } else {
      const schedule = generateScheduleForPool(players, quartersCount);
      for (let i = 1; i <= quartersCount; i++) {
        newQuarters.push({
          id: i,
          type: "MATCHING",
          formation: selectedFormation,
          lineup: schedule[i],
          matchup: { home: "A", away: "B" },
        });
      }
    }

    if (
      confirm(
        `${quartersCount}개 쿼터 (${selectedFormation}) 생성 완료! 적용하시겠습니까?`,
      )
    ) {
      setQuarters(newQuarters);
      setCurrentQuarterId(1);
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleAutoSquad,
    availableTeams,
  };
};
