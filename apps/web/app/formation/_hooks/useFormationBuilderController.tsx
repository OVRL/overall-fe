"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from "react";

import { useFormationMatchPlayers } from "@/app/formation/_context/FormationMatchPlayersContext";
import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";
import { useFormationMatchFormationSaveActions } from "@/app/formation/_hooks/useFormationMatchFormationSaveActions";
import { useFormationManager } from "@/hooks/formation/useFormationManager";
import {
  useInHouseDraftTeamAssignments,
  type InHouseDraftTeamChoice,
} from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { useUserId } from "@/hooks/useUserId";
import { buildSubTeamDraftLineupOrderedPlayers } from "@/lib/formation/roster/buildSubTeamDraftLineup";
import { filterPlayersForInHouseLineupTab } from "@/lib/formation/roster/filterPlayersForInHouseLineupTab";
import { isSameFormationRosterPlayer } from "@/lib/formation/roster/formationRosterPlayerKey";
import { buildQuartersFromMatch } from "@/lib/formation/buildQuartersFromMatch";
import {
  getInHouseFormationForTeam,
  withInHouseFormationsNormalized,
} from "@/lib/formation/inHouseQuarterFormations";
import { resolveFormationSavePrimarySource } from "@/lib/formation/resolveFormationSavePrimarySource";
import type { Player, QuarterData } from "@/types/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import type { FormationMatchFormationPrimarySource } from "@/types/formationMatchPageSnapshot";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { MatchQuarterSpec } from "@/app/formation/_types/matchQuarterSpec";

export type UseFormationBuilderControllerParams = {
  matchQuarterSpec?: MatchQuarterSpec | null;
  savedInitialQuarters?: QuarterData[] | null;
  savedInitialInHouseDraftTeamByKey?: InHouseDraftTeamByPlayerKey | null;
  savedDraftMatchFormationId?: number | null;
  savedLatestConfirmedMatchFormationId?: number | null;
  savedInitialFormationPrimarySource?: FormationMatchFormationPrimarySource | null;
  savedInitialFormationSourceRevision?: string | null;
};

export function useFormationBuilderController(
  params: UseFormationBuilderControllerParams,
) {
  const {
    matchQuarterSpec = null,
    savedInitialQuarters = null,
    savedInitialInHouseDraftTeamByKey = null,
    savedDraftMatchFormationId = null,
    savedLatestConfirmedMatchFormationId = null,
    savedInitialFormationPrimarySource = null,
    savedInitialFormationSourceRevision = null,
  } = params;

  const { matchId, teamId } = useFormationMatchIds();
  const userId = useUserId();

  const resolvedSavePrimarySource = useMemo<
    FormationMatchFormationPrimarySource | null
  >(
    () =>
      resolveFormationSavePrimarySource({
        savedInitialFormationPrimarySource,
        savedLatestConfirmedMatchFormationId,
        savedDraftMatchFormationId,
      }),
    [
      savedInitialFormationPrimarySource,
      savedLatestConfirmedMatchFormationId,
      savedDraftMatchFormationId,
    ],
  );

  const initialQuartersFromSpec = useMemo(
    () =>
      matchQuarterSpec == null
        ? undefined
        : buildQuartersFromMatch(
            matchQuarterSpec.quarterCount,
            matchQuarterSpec.matchType,
          ),
    [matchQuarterSpec],
  );

  const resolvedInitialQuarters = useMemo(() => {
    const raw =
      savedInitialQuarters != null && savedInitialQuarters.length > 0
        ? savedInitialQuarters
        : initialQuartersFromSpec;
    if (raw == null) return undefined;
    return raw.map((q) => withInHouseFormationsNormalized(q));
  }, [savedInitialQuarters, initialQuartersFromSpec]);

  const {
    quarters,
    setQuarters: setQuartersFromManager,
    assignPlayer,
    removePlayer,
    resetQuarters,
  } = useFormationManager(
    resolvedInitialQuarters,
    savedInitialFormationSourceRevision ?? null,
  );
  const rosterPlayers = useFormationMatchPlayers();
  const {
    draftTeamByKey,
    setDraftTeam: setDraftTeamInner,
    getDraftTeam,
    resetDraftAssignments,
  } = useInHouseDraftTeamAssignments(savedInitialInHouseDraftTeamByKey);

  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );
  const [formationRosterViewMode, setFormationRosterViewMode] =
    useState<FormationRosterViewMode>("A");
  const [selectedSubTeam, setSelectedSubTeam] = useState<"A" | "B">("A");

  const matchType = matchQuarterSpec?.matchType ?? "INTERNAL";
  const quarterDurationMinutes =
    matchQuarterSpec?.quarterDurationMinutes ?? 25;

  const {
    latestDraftFormationIdRef,
    latestConfirmedFormationIdRef,
    handleSaveConfirm,
    scheduleFormationAutoSave,
    cancelFormationAutoSave,
    isSaveDraftInFlight,
    isUpdateDraftInFlight,
    isCreateFormationInFlight,
    isConfirmInFlight,
    isUpdateForConfirmInFlight,
  } = useFormationMatchFormationSaveActions({
    userId,
    quarters,
    matchType,
    draftTeamByKey,
    resolvedSavePrimarySource,
    savedDraftMatchFormationId: savedDraftMatchFormationId ?? null,
    savedLatestConfirmedMatchFormationId:
      savedLatestConfirmedMatchFormationId ?? null,
  });

  const setQuarters = useCallback(
    (action: SetStateAction<QuarterData[]>) => {
      setQuartersFromManager(action);
      scheduleFormationAutoSave();
    },
    [setQuartersFromManager, scheduleFormationAutoSave],
  );

  const setDraftTeam = useCallback(
    (player: Player, team: InHouseDraftTeamChoice) => {
      setDraftTeamInner(player, team);
      scheduleFormationAutoSave();
    },
    [setDraftTeamInner, scheduleFormationAutoSave],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const fromSavedSsr =
      savedInitialQuarters != null && savedInitialQuarters.length > 0;
    const quartersForLog = resolvedInitialQuarters ?? [];
    console.log("[FormationBuilder] 포메이션 초기 로드(디버그)", {
      matchId,
      teamId,
      userId,
      matchQuarterSpec,
      savedInitialFormationPrimarySource,
      savedInitialFormationSourceRevision,
      resolvedSavePrimarySource,
      findMatchFormationRowIds: {
        savedDraftMatchFormationId: savedDraftMatchFormationId ?? null,
        savedLatestConfirmedMatchFormationId:
          savedLatestConfirmedMatchFormationId ?? null,
        refSeededDraftId: latestDraftFormationIdRef.current,
        refSeededConfirmedId: latestConfirmedFormationIdRef.current,
      },
      initialQuarters: {
        source: fromSavedSsr ? "SSR savedInitialQuarters" : "기본 쿼터 스펙",
        quarterCount: quartersForLog.length,
        summary: quartersForLog.map((q) => ({
          quarterId: q.id,
          type: q.type,
          formation: q.formation,
        })),
      },
      inHouseDraftTeamByKey: {
        keyCount: Object.keys(savedInitialInHouseDraftTeamByKey ?? {}).length,
        keys: Object.keys(savedInitialInHouseDraftTeamByKey ?? {}),
      },
    });
  }, [
    matchId,
    teamId,
    userId,
    matchQuarterSpec,
    savedDraftMatchFormationId,
    savedLatestConfirmedMatchFormationId,
    savedInitialFormationPrimarySource,
    savedInitialFormationSourceRevision,
    resolvedSavePrimarySource,
    savedInitialQuarters,
    savedInitialInHouseDraftTeamByKey,
    resolvedInitialQuarters,
  ]);

  const draftSubTeamLineups = useMemo(() => {
    if (matchType !== "INTERNAL") {
      return { A: [] as Player[], B: [] as Player[] };
    }
    return {
      A: buildSubTeamDraftLineupOrderedPlayers(
        rosterPlayers,
        draftTeamByKey,
        "A",
      ),
      B: buildSubTeamDraftLineupOrderedPlayers(
        rosterPlayers,
        draftTeamByKey,
        "B",
      ),
    };
  }, [matchType, rosterPlayers, draftTeamByKey]);

  const assignPlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number, player: Player) => {
      if (formationRosterViewMode === "draft") return;
      assignPlayer(quarterId, positionIndex, player, {
        inHouseSubTeam: selectedSubTeam,
      });
      if (
        matchType === "INTERNAL" &&
        (formationRosterViewMode === "A" || formationRosterViewMode === "B")
      ) {
        setDraftTeam(player, formationRosterViewMode);
      } else {
        scheduleFormationAutoSave();
      }
    },
    [
      assignPlayer,
      selectedSubTeam,
      formationRosterViewMode,
      matchType,
      setDraftTeam,
      scheduleFormationAutoSave,
    ],
  );

  const removePlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number) => {
      if (formationRosterViewMode === "draft") return;
      removePlayer(quarterId, positionIndex, {
        inHouseSubTeam: selectedSubTeam,
      });
      scheduleFormationAutoSave();
    },
    [
      removePlayer,
      selectedSubTeam,
      formationRosterViewMode,
      scheduleFormationAutoSave,
    ],
  );

  const handleFormationRosterViewModeChange = useCallback(
    (mode: FormationRosterViewMode) => {
      setFormationRosterViewMode(mode);
      if (mode === "A" || mode === "B") {
        setSelectedSubTeam(mode);
        setQuarters((prev) =>
          prev.map((q) => {
            if (q.type !== "IN_HOUSE") return q;
            const slots = mode === "A" ? (q.teamA ?? {}) : (q.teamB ?? {});
            return {
              ...q,
              lineup: { ...slots },
              formation: getInHouseFormationForTeam(q, mode),
            };
          }),
        );
        setSelectedListPlayer((prev) => {
          if (prev == null) return null;
          const visible = filterPlayersForInHouseLineupTab(
            rosterPlayers,
            mode,
            getDraftTeam,
          );
          return visible.some((p) => isSameFormationRosterPlayer(p, prev))
            ? prev
            : null;
        });
      }
    },
    [setQuarters, rosterPlayers, getDraftTeam],
  );

  const commonProps = {
    quarters,
    setQuarters,
    currentQuarterId,
    setCurrentQuarterId,
    matchType,
    quarterDurationMinutes,
    formationRosterViewMode,
    onFormationRosterViewModeChange: handleFormationRosterViewModeChange,
    selectedPlayer: selectedListPlayer,
    setSelectedPlayer: setSelectedListPlayer,
    onPositionRemove: removePlayerWithSubTeam,
    assignPlayer: assignPlayerWithSubTeam,
    ...(matchType === "INTERNAL"
      ? {
          draftSubTeamLineups,
          getDraftTeam,
          setDraftTeam,
        }
      : {}),
  };

  const handleReset = useCallback(() => {
    cancelFormationAutoSave();
    resetQuarters();
    setCurrentQuarterId(null);
    setSelectedListPlayer(null);
    setFormationRosterViewMode("A");
    setSelectedSubTeam("A");
    resetDraftAssignments();
  }, [cancelFormationAutoSave, resetQuarters, resetDraftAssignments]);

  return {
    commonProps,
    handleReset,
    handleSaveConfirm,
    isSaveDraftInFlight,
    isUpdateDraftInFlight,
    isCreateFormationInFlight,
    isConfirmInFlight,
    isUpdateForConfirmInFlight,
    userId,
  };
}
