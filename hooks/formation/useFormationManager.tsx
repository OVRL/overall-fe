import { useState, useCallback, useEffect, useRef } from "react";
import { Player, QuarterData } from "@/types/formation";
import { isSameFormationRosterPlayer } from "@/lib/formation/roster/formationRosterPlayerKey";

const defaultQuarter: QuarterData = {
  id: 1,
  type: "IN_HOUSE",
  formation: "4-3-3",
  formationTeamA: "4-3-3",
  formationTeamB: "4-3-3",
  matchup: { home: "A", away: "B" },
  lineup: {},
};

/** 내전(IN_HOUSE)일 때 어느 팀 슬롯을 수정할지 (저장 시 tactics.teams.A|B와 동기화) */
export type InHouseSubTeam = "A" | "B";

export type FormationSlotAssignOptions = {
  inHouseSubTeam?: InHouseSubTeam;
};

/** 슬롯에 이미 같은 인물이 있으면 빈 칸으로 옮기기 전에 제거 — `id`만 비교하면 팀원·용병 PK 충돌 시 오판한다. */
function applyAssignToSlotRecord(
  base: Record<number, Player | null> | undefined,
  positionIndex: number,
  player: Player,
): Record<number, Player | null> {
  const slots = { ...(base || {}) };
  let sourceIndex: number | undefined;

  Object.keys(slots).forEach((key) => {
    const k = Number(key);
    const occupant = slots[k];
    if (
      occupant != null &&
      isSameFormationRosterPlayer(occupant, player)
    ) {
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

function serializeQuartersKey(quarters: QuarterData[] | undefined): string {
  if (quarters == null || quarters.length === 0) return "";
  try {
    return JSON.stringify(quarters);
  } catch {
    return String(quarters.length);
  }
}

function cloneQuarterDataList(source: QuarterData[]): QuarterData[] {
  try {
    if (typeof structuredClone === "function") {
      return structuredClone(source);
    }
  } catch {
    /* structuredClone 미지원·실패 시 JSON 경로 */
  }
  return JSON.parse(JSON.stringify(source)) as QuarterData[];
}

/**
 * @param initialQuarters SSR·스펙에서 온 초기 쿼터
 * @param ssrFormationSourceRevision `MatchFormation` 행 id·isDraft·updatedAt 기반 문자열. 바뀌면 서버에서 새 `tactics`가 왔다고 보고 `quarters`를 다시 맞춘다.
 */
export const useFormationManager = (
  initialQuarters?: QuarterData[],
  ssrFormationSourceRevision?: string | null,
) => {
  const [quarters, setQuarters] = useState<QuarterData[]>(
    initialQuarters?.length ? cloneQuarterDataList(initialQuarters) : [defaultQuarter],
  );

  const initialQuartersKeyRef = useRef<string>(
    serializeQuartersKey(initialQuarters),
  );
  const formationRevisionRef = useRef<string | null>(null);

  useEffect(() => {
    const hasRevision =
      ssrFormationSourceRevision != null && ssrFormationSourceRevision !== "";

    if (hasRevision) {
      if (formationRevisionRef.current === ssrFormationSourceRevision) {
        return;
      }
      formationRevisionRef.current = ssrFormationSourceRevision;
      if (initialQuarters?.length) {
        setQuarters(cloneQuarterDataList(initialQuarters));
        initialQuartersKeyRef.current = serializeQuartersKey(initialQuarters);
      }
      return;
    }

    const nextKey = serializeQuartersKey(initialQuarters);
    if (nextKey === "") return;
    if (initialQuartersKeyRef.current === nextKey) return;
    initialQuartersKeyRef.current = nextKey;
    if (initialQuarters?.length) {
      setQuarters(initialQuarters.map((q) => ({ ...q })));
    }
  }, [initialQuarters, ssrFormationSourceRevision]);

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
    (player: Player) => {
      const assignedQuarterIds: number[] = [];
      quarters.forEach((q) => {
        if (q.type === "IN_HOUSE") {
          const inA = Object.values(q.teamA ?? {}).some(
            (p) => p != null && isSameFormationRosterPlayer(p, player),
          );
          const inB = Object.values(q.teamB ?? {}).some(
            (p) => p != null && isSameFormationRosterPlayer(p, player),
          );
          const inLineup = Object.values(q.lineup ?? {}).some(
            (p) => p != null && isSameFormationRosterPlayer(p, player),
          );
          if (inA || inB || inLineup) assignedQuarterIds.push(q.id);
          return;
        }
        const lineup = q.lineup || {};
        if (
          Object.values(lineup).some(
            (p) => p != null && isSameFormationRosterPlayer(p, player),
          )
        ) {
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

      const lastFa =
        lastQuarter?.type === "IN_HOUSE"
          ? (lastQuarter.formationTeamA ?? lastQuarter.formation)
          : (lastQuarter?.formation ?? "4-3-3");
      const lastFb =
        lastQuarter?.type === "IN_HOUSE"
          ? (lastQuarter.formationTeamB ?? lastQuarter.formation)
          : (lastQuarter?.formation ?? "4-3-3");

      const newQuarter: QuarterData = {
        id: nextId,
        type: "IN_HOUSE",
        formation: lastQuarter ? lastFa : "4-3-3",
        formationTeamA: lastQuarter ? lastFa : "4-3-3",
        formationTeamB: lastQuarter ? lastFb : "4-3-3",
        matchup: lastQuarter
          ? { ...lastQuarter.matchup }
          : { home: "A", away: "B" },
        lineup: {}, // New quarter starts with empty lineup by default, or you can copy
      };

      return [...prev, newQuarter];
    });
  }, []);

  const resetQuarters = useCallback(() => {
    setQuarters(
      initialQuarters?.length
        ? cloneQuarterDataList(initialQuarters)
        : [defaultQuarter],
    );
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
