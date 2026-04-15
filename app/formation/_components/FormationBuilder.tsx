"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { useFormationMatchPlayers } from "@/app/formation/_context/FormationMatchPlayersContext";
import { useFormationManager } from "@/hooks/formation/useFormationManager";
import { useInHouseDraftTeamAssignments } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { buildSubTeamDraftLineupOrderedPlayers } from "@/lib/formation/roster/buildSubTeamDraftLineup";
import { filterPlayersForInHouseLineupTab } from "@/lib/formation/roster/filterPlayersForInHouseLineupTab";
import { isSameFormationRosterPlayer } from "@/lib/formation/roster/formationRosterPlayerKey";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useUserId } from "@/hooks/useUserId";
import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";
import { useSaveMatchFormationDraftMutation } from "@/app/formation/_hooks/useSaveMatchFormationDraftMutation";
import { useUpdateMatchFormationForDraftMutation } from "@/app/formation/_hooks/useUpdateMatchFormationForDraftMutation";
import { useConfirmMatchFormationMutation } from "@/app/formation/_hooks/useConfirmMatchFormationMutation";
import { useCreateMatchFormationMutation } from "@/app/formation/_hooks/useCreateMatchFormationMutation";
import FormationBuilderMobile from "./FormationBuilderMobile";
import { FormationBuilderContentSkeleton } from "./FormationBuilderContentSkeleton";
import { buildQuartersFromMatch } from "@/lib/formation/buildQuartersFromMatch";
import {
  getInHouseFormationForTeam,
  withInHouseFormationsNormalized,
} from "@/lib/formation/inHouseQuarterFormations";
import { buildMatchFormationTacticsDocumentFromQuarters } from "@/lib/formation/buildMatchFormationTacticsDocument";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { toast } from "@/lib/toast";
import { Player, type QuarterData } from "@/types/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import type { FormationMatchFormationPrimarySource } from "@/types/formationMatchPageSnapshot";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import FormationHeader from "./FormationHeader";

/** 데스크톱 전용 DnD 번들을 모바일에서 로드하지 않도록 dynamic import */
const FormationBuilderDesktopWithDnd = dynamic(
  () => import("./FormationBuilderDesktopWithDnd").then((m) => m.default),
  {
    ssr: false,
    loading: () => <FormationBuilderContentSkeleton />,
  },
);

/** 경기(findMatch) 기준 쿼터 수·시간 — 전달 시 탭·보드가 API와 동기화됩니다. */
export type MatchQuarterSpec = {
  quarterCount: number;
  quarterDurationMinutes: number;
  matchType: "MATCH" | "INTERNAL";
};

interface FormationBuilderProps {
  scheduleCard: React.ReactNode;
  matchQuarterSpec?: MatchQuarterSpec | null;
  /** SSR 등에서 복원한 저장 포메이션 (없으면 matchQuarterSpec 기준 기본 쿼터) */
  savedInitialQuarters?: QuarterData[] | null;
  /** `tactics.inHouseDraftTeamByKey` — 내전 명단 A/B 필터 복원 */
  savedInitialInHouseDraftTeamByKey?: InHouseDraftTeamByPlayerKey | null;
  /** SSR `findMatchFormation` — `isDraft`인 행 중 최대 id (임시저장·확정 분기) */
  savedDraftMatchFormationId?: number | null;
  /** SSR — 확정 행(`isDraft === false`) 중 최대 id */
  savedLatestConfirmedMatchFormationId?: number | null;
  /** SSR — `initialQuarters`를 채운 행이 확정이면 `confirmed` (저장 시 확정 행만 갱신) */
  savedInitialFormationPrimarySource?: FormationMatchFormationPrimarySource | null;
  /** SSR — 초기 포메이션 행 리비전(`id:isDraft:updatedAt`) — 새로고침 후 `quarters` 동기화 */
  savedInitialFormationSourceRevision?: string | null;
}

/**
 * 포메이션 빌더 오케스트레이터: 비즈니스 상태만 유지, 1024px 기준 데스크/모바일 분기.
 * 선수 풀은 `FormationMatchPlayersProvider`(SSR 데이터)에서 읽습니다.
 */
export default function FormationBuilder({
  scheduleCard,
  matchQuarterSpec = null,
  savedInitialQuarters = null,
  savedInitialInHouseDraftTeamByKey = null,
  savedDraftMatchFormationId = null,
  savedLatestConfirmedMatchFormationId = null,
  savedInitialFormationPrimarySource = null,
  savedInitialFormationSourceRevision = null,
}: FormationBuilderProps) {
  const router = useRouter();
  const { matchId, teamId } = useFormationMatchIds();
  const userId = useUserId();
  const { commit: commitSaveDraft, isInFlight: isSaveDraftInFlight } =
    useSaveMatchFormationDraftMutation();
  /** 임시저장 전용 — 확정 저장의 `updateMatchFormation`과 inFlight 분리 */
  const { commit: commitUpdateDraft, isInFlight: isUpdateDraftInFlight } =
    useUpdateMatchFormationForDraftMutation();
  const {
    commit: commitUpdateForConfirm,
    isInFlight: isUpdateForConfirmInFlight,
  } = useUpdateMatchFormationForDraftMutation();
  const { commit: commitConfirm, isInFlight: isConfirmInFlight } =
    useConfirmMatchFormationMutation();
  const { commit: commitCreateFormation, isInFlight: isCreateFormationInFlight } =
    useCreateMatchFormationMutation();
  /**
   * 드래프트 행 id — SSR `savedDraftMatchFormationId`로 시드, 이후 `saveMatchFormationDraft` 응답으로 갱신.
   * 임시저장은 `updateMatchFormation`, 확정은 `confirmMatchFormation(draftId)` 전에 동일 id로 tactics 플러시.
   */
  const latestDraftFormationIdRef = useRef<number | null>(
    savedDraftMatchFormationId ?? null,
  );
  /** 확정만 있을 때 `updateMatchFormation`으로 전술만 갱신 */
  const latestConfirmedFormationIdRef = useRef<number | null>(
    savedLatestConfirmedMatchFormationId ?? null,
  );

  /** 스냅샷에 없을 때: 확정·드래프트 id가 둘 다 있으면 UI는 항상 확정 우선(`pickPrimary`와 동일) */
  const resolvedSavePrimarySource = useMemo<
    FormationMatchFormationPrimarySource | null
  >(() => {
    if (savedInitialFormationPrimarySource != null) {
      return savedInitialFormationPrimarySource;
    }
    if (
      savedLatestConfirmedMatchFormationId != null &&
      savedDraftMatchFormationId != null
    ) {
      return "confirmed";
    }
    return null;
  }, [
    savedInitialFormationPrimarySource,
    savedLatestConfirmedMatchFormationId,
    savedDraftMatchFormationId,
  ]);

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

  const { quarters, setQuarters, assignPlayer, removePlayer, resetQuarters } =
    useFormationManager(
      resolvedInitialQuarters,
      savedInitialFormationSourceRevision ?? null,
    );
  const rosterPlayers = useFormationMatchPlayers();
  const {
    draftTeamByKey,
    setDraftTeam,
    getDraftTeam,
    resetDraftAssignments,
  } = useInHouseDraftTeamAssignments(savedInitialInHouseDraftTeamByKey);
  const isLgOrBelow = useIsMobile(1023);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );
  const matchType = matchQuarterSpec?.matchType ?? "INTERNAL";
  const quarterDurationMinutes =
    matchQuarterSpec?.quarterDurationMinutes ?? 25;
  const [formationRosterViewMode, setFormationRosterViewMode] =
    useState<FormationRosterViewMode>("A");
  const [selectedSubTeam, setSelectedSubTeam] = useState<"A" | "B">("A");

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
      // 내전 A/B 라인업에 올린 선수는 드래프트 소속과 동기화(명단 필터·다음 편집과 정합)
      if (
        matchType === "INTERNAL" &&
        (formationRosterViewMode === "A" || formationRosterViewMode === "B")
      ) {
        setDraftTeam(player, formationRosterViewMode);
      }
    },
    [assignPlayer, selectedSubTeam, formationRosterViewMode, matchType, setDraftTeam],
  );

  const removePlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number) => {
      if (formationRosterViewMode === "draft") return;
      removePlayer(quarterId, positionIndex, {
        inHouseSubTeam: selectedSubTeam,
      });
    },
    [removePlayer, selectedSubTeam, formationRosterViewMode],
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
        // A/B 탭에서는 명단이 드래프트 배정으로 필터되므로, 목록에 없는 선택은 해제
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

  const handleReset = () => {
    resetQuarters();
    setCurrentQuarterId(null);
    setSelectedListPlayer(null);
    setFormationRosterViewMode("A");
    setSelectedSubTeam("A");
    resetDraftAssignments();
  };

  const handleSaveDraft = useCallback(() => {
    if (userId == null) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[FormationBuilder] 임시저장: 로그인 userId 없음");
      }
      return;
    }
    const documentMatchType = matchType === "MATCH" ? "MATCH" : "INTERNAL";
    const tactics = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      documentMatchType,
      matchType === "INTERNAL"
        ? { inHouseDraftTeamByKey: draftTeamByKey }
        : undefined,
    );
    const draftId = latestDraftFormationIdRef.current;

    if (draftId != null) {
      commitUpdateDraft({
        variables: {
          input: {
            id: draftId,
            userId,
            tactics,
          },
        },
        onCompleted: () => {
          toast.success("임시저장에 성공했습니다.");
        },
        onError: (err) => {
          console.error("[FormationBuilder] updateMatchFormation (draft)", err);
        },
      });
      return;
    }

    commitSaveDraft({
      variables: {
        input: {
          matchId,
          teamId,
          userId,
          tactics,
        },
      },
      onCompleted: (response) => {
        latestDraftFormationIdRef.current =
          response.saveMatchFormationDraft.id;
        toast.success("임시저장에 성공했습니다.");
      },
      onError: (err) => {
        console.error("[FormationBuilder] saveMatchFormationDraft", err);
      },
    });
  }, [
    commitSaveDraft,
    commitUpdateDraft,
    matchId,
    teamId,
    userId,
    quarters,
    matchType,
    draftTeamByKey,
  ]);

  /**
   * 포메이션 저장하기
   * — 초기 보드가 **확정 행**에서 온 경우: orphan 드래프트 id가 ref에 있어도 **확정 행만** `update`(화면·SSR 출처와 동일 행)
   * — 초기 보드가 **드래프트**만: `update`(draft)` + `confirmMatchFormation`
   * — 저장 행 없음: `createMatchFormation`
   */
  const handleSaveConfirm = useCallback(() => {
    if (userId == null) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[FormationBuilder] 확정 저장: 로그인 userId 없음");
      }
      return;
    }
    const documentMatchType = matchType === "MATCH" ? "MATCH" : "INTERNAL";
    const tactics = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      documentMatchType,
      matchType === "INTERNAL"
        ? { inHouseDraftTeamByKey: draftTeamByKey }
        : undefined,
    );

    const draftId = latestDraftFormationIdRef.current;
    const confirmedId = latestConfirmedFormationIdRef.current;

    const finishSuccess = () => {
      router.refresh();
    };

    if (resolvedSavePrimarySource === "confirmed" && confirmedId != null) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[FormationBuilder] 확정 저장 분기: 확정 행만 update (초기 출처=confirmed)",
          { confirmedId, draftIdIgnored: draftId },
        );
      }
      commitUpdateForConfirm({
        variables: {
          input: {
            id: confirmedId,
            userId,
            tactics,
          },
        },
        onCompleted: (res) => {
          if (res.updateMatchFormation == null) {
            toast.error(
              "포메이션 저장 응답이 비어 있습니다. 네트워크 탭에서 GraphQL errors를 확인해 주세요.",
            );
            return;
          }
          toast.success("포메이션이 저장되었습니다.");
          finishSuccess();
        },
        onError: (err) => {
          console.error(
            "[FormationBuilder] updateMatchFormation (확정본·초기출처 confirmed)",
            err,
          );
          toast.error(
            getGraphQLErrorMessage(err, "포메이션 저장에 실패했습니다."),
          );
        },
      });
      return;
    }

    if (draftId != null) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[FormationBuilder] 확정 저장 분기: draft update + confirm",
          { draftId },
        );
      }
      commitUpdateForConfirm({
        variables: {
          input: {
            id: draftId,
            userId,
            tactics,
          },
        },
        onCompleted: () => {
          commitConfirm({
            variables: { draftId, userId },
            onCompleted: (res) => {
              const row = res.confirmMatchFormation;
              if (row == null) {
                toast.error(
                  "포메이션 확정 응답이 비어 있습니다. 네트워크 탭에서 GraphQL errors를 확인해 주세요.",
                );
                return;
              }
              latestDraftFormationIdRef.current = null;
              latestConfirmedFormationIdRef.current = row.isDraft ? null : row.id;
              toast.success("포메이션이 저장되었습니다.");
              finishSuccess();
            },
            onError: (err) => {
              console.error("[FormationBuilder] confirmMatchFormation", err);
              toast.error(
                getGraphQLErrorMessage(err, "포메이션 확정에 실패했습니다."),
              );
            },
          });
        },
        onError: (err) => {
          console.error(
            "[FormationBuilder] updateMatchFormation (confirm 플러시)",
            err,
          );
          toast.error(
            getGraphQLErrorMessage(err, "포메이션 저장(확정 전 단계)에 실패했습니다."),
          );
        },
      });
      return;
    }

    if (confirmedId != null) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[FormationBuilder] 확정 저장 분기: 확정만 update (초기 출처=draft 아님·확정 id 있음)",
          { confirmedId },
        );
      }
      commitUpdateForConfirm({
        variables: {
          input: {
            id: confirmedId,
            userId,
            tactics,
          },
        },
        onCompleted: (res) => {
          if (res.updateMatchFormation == null) {
            toast.error(
              "포메이션 저장 응답이 비어 있습니다. 네트워크 탭에서 GraphQL errors를 확인해 주세요.",
            );
            return;
          }
          toast.success("포메이션이 저장되었습니다.");
          finishSuccess();
        },
        onError: (err) => {
          console.error(
            "[FormationBuilder] updateMatchFormation (확정본 갱신)",
            err,
          );
          toast.error(
            getGraphQLErrorMessage(err, "포메이션 저장에 실패했습니다."),
          );
        },
      });
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[FormationBuilder] 확정 저장 분기: createMatchFormation");
    }
    commitCreateFormation({
      variables: {
        input: {
          matchId,
          teamId,
          userId,
          tactics,
        },
      },
      onCompleted: (response) => {
        const row = response.createMatchFormation;
        if (row.isDraft) {
          latestDraftFormationIdRef.current = row.id;
          latestConfirmedFormationIdRef.current = null;
          toast.success("포메이션이 임시저장되었습니다.");
        } else {
          latestDraftFormationIdRef.current = null;
          latestConfirmedFormationIdRef.current = row.id;
          toast.success("포메이션이 저장되었습니다.");
        }
        finishSuccess();
      },
      onError: (err) => {
        console.error("[FormationBuilder] createMatchFormation", err);
      },
    });
  }, [
    commitConfirm,
    commitCreateFormation,
    commitUpdateForConfirm,
    matchId,
    teamId,
    userId,
    quarters,
    matchType,
    draftTeamByKey,
    router,
    resolvedSavePrimarySource,
  ]);

  const content = isLgOrBelow ? (
    <FormationBuilderMobile {...commonProps} />
  ) : (
    <FormationBuilderDesktopWithDnd
      scheduleCard={scheduleCard}
      {...commonProps}
    />
  );

  return (
    <div className="min-h-dvh pt-safe bg-surface-primary flex flex-col">
      <FormationHeader
        onReset={handleReset}
        onSaveDraft={userId != null ? handleSaveDraft : undefined}
        isSaveDraftPending={isSaveDraftInFlight || isUpdateDraftInFlight}
        onSaveConfirm={userId != null ? handleSaveConfirm : undefined}
        isSaveConfirmPending={
          isCreateFormationInFlight ||
          isConfirmInFlight ||
          isUpdateForConfirmInFlight
        }
      />
      <main className="flex-1 flex flex-col min-h-0 px-3 md:px-6 py-4 w-full items-center bg-surface-primary">
        {content}
      </main>
    </div>
  );
}
