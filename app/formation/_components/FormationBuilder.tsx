"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

import { useFormationManager } from "@/hooks/formation/useFormationManager";
import {
  useFormationBaselineDirty,
  useSerializeQuartersStable,
} from "@/hooks/formation/useFormationBaselineDirty";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useUserId } from "@/hooks/useUserId";
import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";
import { useSaveMatchFormationDraftMutation } from "@/app/formation/_hooks/useSaveMatchFormationDraftMutation";
import { useUpdateMatchFormationForDraftMutation } from "@/app/formation/_hooks/useUpdateMatchFormationForDraftMutation";
import { useCreateMatchFormationMutation } from "@/app/formation/_hooks/useCreateMatchFormationMutation";
import { useConfirmMatchFormationMutation } from "@/app/formation/_hooks/useConfirmMatchFormationMutation";
import { useUpdateMatchFormationMutation } from "@/components/team-management/hooks/useUpdateMatchFormationMutation";
import { useDebouncedDraftSaveAfterLineupChange } from "@/hooks/formation/useDebouncedDraftSaveAfterLineupChange";
import FormationBuilderMobile from "./FormationBuilderMobile";
import { FormationBuilderContentSkeleton } from "./FormationBuilderContentSkeleton";
import { FormationDraftResumeBanner } from "./FormationDraftResumeBanner";
import { FormationAlreadyConfirmedModal } from "./FormationAlreadyConfirmedModal";
import { FormationLeaveConfirmedEditModal } from "./FormationLeaveConfirmedEditModal";
import { FormationLeaveWithoutConfirmModal } from "./FormationLeaveWithoutConfirmModal";
import { isMatchFormationAlreadyConfirmedError } from "@/lib/formation/isMatchFormationAlreadyConfirmedError";
import { areAllQuartersFormationComplete } from "@/lib/formation/areAllQuartersFormationComplete";
import { buildQuartersFromMatch } from "@/lib/formation/buildQuartersFromMatch";
import { buildMatchFormationTacticsDocumentFromQuarters } from "@/lib/formation/buildMatchFormationTacticsDocument";
import { toast } from "@/lib/toast";
import { Player, type QuarterData } from "@/types/formation";
import type { FormationMatchInitialBoardSource } from "@/types/formationMatchPageSnapshot";
import FormationHeader from "./FormationHeader";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import { useFormationLeaveNavigationGuard } from "@/hooks/formation/useFormationLeaveNavigationGuard";
import { FormationNavigationGuardProvider } from "@/app/formation/_context/FormationNavigationGuardContext";

/** 데스크톱 전용 DnD 번들을 모바일에서 로드하지 않도록 dynamic import */
const FormationBuilderDesktopWithDnd = dynamic(
  () => import("./FormationBuilderDesktopWithDnd").then((m) => m.default),
  {
    ssr: false,
    loading: () => <FormationBuilderContentSkeleton />,
  },
);

const FORMATION_CONFIRM_SUCCESS_PATH = "/home";

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
  /** SSR 스냅샷의 `draftFormationId` — 확정만 있으면 null */
  ssrDraftFormationId?: number | null;
  ssrInitialBoardSource?: FormationMatchInitialBoardSource;
  ssrConfirmedFormationId?: number | null;
}

/**
 * 포메이션 빌더 오케스트레이터: 비즈니스 상태만 유지, 1024px 기준 데스크/모바일 분기.
 * 선수 풀은 `FormationMatchPlayersProvider`(SSR 데이터)에서 읽습니다.
 */
export default function FormationBuilder({
  scheduleCard,
  matchQuarterSpec = null,
  savedInitialQuarters = null,
  ssrDraftFormationId,
  ssrInitialBoardSource,
  ssrConfirmedFormationId,
}: FormationBuilderProps) {
  const baseRouter = useBridgeRouter();
  const { matchId, teamId } = useFormationMatchIds();
  const userId = useUserId();
  const { commit: commitSaveDraft, isInFlight: isSaveDraftInFlight } =
    useSaveMatchFormationDraftMutation();
  const { commit: commitUpdateDraft, isInFlight: isUpdateDraftInFlight } =
    useUpdateMatchFormationForDraftMutation();
  const { commit: commitCreateFormation, isInFlight: isCreateFormationInFlight } =
    useCreateMatchFormationMutation();
  const { commit: commitConfirm, isInFlight: isConfirmInFlight } =
    useConfirmMatchFormationMutation();
  const {
    executeMutation: executeUpdateConfirmedFormation,
    isInFlight: isUpdateConfirmedFormationInFlight,
  } = useUpdateMatchFormationMutation();
  /** 첫 `saveMatchFormationDraft` 응답 id — 이후 임시저장은 `updateMatchFormation`만 사용 */
  const latestDraftFormationIdRef = useRef<number | null>(
    ssrDraftFormationId === undefined ? null : ssrDraftFormationId,
  );
  const [leaveWithoutConfirmOpen, setLeaveWithoutConfirmOpen] = useState(false);
  const [leaveConfirmedEditOpen, setLeaveConfirmedEditOpen] = useState(false);
  const [alreadyConfirmedOpen, setAlreadyConfirmedOpen] = useState(false);
  const [isFinalizeBusy, setIsFinalizeBusy] = useState(false);

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

  const resolvedInitialQuarters =
    savedInitialQuarters != null && savedInitialQuarters.length > 0
      ? savedInitialQuarters
      : initialQuartersFromSpec;

  const { quarters, setQuarters, assignPlayer, removePlayer, resetQuarters } =
    useFormationManager(resolvedInitialQuarters);

  const serializeQuarters = useSerializeQuartersStable();
  const isDirtyVsBaseline = useFormationBaselineDirty(quarters, serializeQuarters);
  const isRegistrationFlow = ssrConfirmedFormationId == null;

  const openRegistrationLeaveModal = useCallback(
    () => setLeaveWithoutConfirmOpen(true),
    [],
  );
  const openConfirmedEditLeaveModal = useCallback(
    () => setLeaveConfirmedEditOpen(true),
    [],
  );

  const {
    guardedRouter,
    captureAnchorClick,
    requestBack,
    finalizeRegistrationLeaveAfterPersist,
    finalizeEditLeaveDiscard,
    clearPendingLeave,
  } = useFormationLeaveNavigationGuard({
    baseRouter,
    isDirty: isDirtyVsBaseline,
    isRegistrationFlow,
    openRegistrationLeaveModal,
    openConfirmedEditLeaveModal,
  });

  const showDraftResumeBanner = ssrInitialBoardSource === "draft";
  const allQuartersComplete = useMemo(
    () => areAllQuartersFormationComplete(quarters),
    [quarters],
  );
  const saveConfirmDisabled = !allQuartersComplete;

  const isLgOrBelow = useIsMobile(1023);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );
  const matchType = matchQuarterSpec?.matchType ?? "INTERNAL";
  const quarterDurationMinutes =
    matchQuarterSpec?.quarterDurationMinutes ?? 25;
  const [selectedSubTeam, setSelectedSubTeam] = useState<"A" | "B">("A");

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
  ]);

  const { schedule: scheduleDraftAutoSaveAfterLineupChange } =
    useDebouncedDraftSaveAfterLineupChange({
      enabled: isRegistrationFlow && userId != null,
      saveDraft: handleSaveDraft,
    });

  const assignPlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number, player: Player) => {
      assignPlayer(quarterId, positionIndex, player, {
        inHouseSubTeam: selectedSubTeam,
      });
      scheduleDraftAutoSaveAfterLineupChange();
    },
    [
      assignPlayer,
      scheduleDraftAutoSaveAfterLineupChange,
      selectedSubTeam,
    ],
  );

  const removePlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number) => {
      removePlayer(quarterId, positionIndex, {
        inHouseSubTeam: selectedSubTeam,
      });
      scheduleDraftAutoSaveAfterLineupChange();
    },
    [
      removePlayer,
      scheduleDraftAutoSaveAfterLineupChange,
      selectedSubTeam,
    ],
  );

  const handleSubTeamChange = useCallback(
    (team: "A" | "B") => {
      setSelectedSubTeam(team);
      setQuarters((prev) =>
        prev.map((q) => {
          if (q.type !== "IN_HOUSE") return q;
          const slots = team === "A" ? (q.teamA ?? {}) : (q.teamB ?? {});
          return { ...q, lineup: { ...slots } };
        }),
      );
    },
    [setQuarters],
  );

  const commonProps = {
    quarters,
    setQuarters,
    currentQuarterId,
    setCurrentQuarterId,
    matchType,
    quarterDurationMinutes,
    selectedSubTeam,
    onSubTeamChange: handleSubTeamChange,
    selectedPlayer: selectedListPlayer,
    setSelectedPlayer: setSelectedListPlayer,
    onPositionRemove: removePlayerWithSubTeam,
    assignPlayer: assignPlayerWithSubTeam,
  };

  const handleReset = () => {
    resetQuarters();
    setCurrentQuarterId(null);
    setSelectedListPlayer(null);
  };

  const discardConfirmedEditAndExit = useCallback(() => {
    setLeaveConfirmedEditOpen(false);
    finalizeEditLeaveDiscard();
  }, [finalizeEditLeaveDiscard]);

  const goToConfirmedFormationView = useCallback(() => {
    setAlreadyConfirmedOpen(false);
    latestDraftFormationIdRef.current = null;
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const persistDraftAndExit = useCallback(() => {
    if (userId == null) {
      setLeaveWithoutConfirmOpen(false);
      finalizeRegistrationLeaveAfterPersist();
      return;
    }
    const documentMatchType = matchType === "MATCH" ? "MATCH" : "INTERNAL";
    const tactics = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      documentMatchType,
    );
    const draftId = latestDraftFormationIdRef.current;

    const done = () => {
      setLeaveWithoutConfirmOpen(false);
      finalizeRegistrationLeaveAfterPersist();
    };

    if (draftId != null) {
      commitUpdateDraft({
        variables: {
          input: {
            id: draftId,
            userId,
            tactics,
          },
        },
        onCompleted: done,
        onError: (err) => {
          console.error("[FormationBuilder] 이탈 시 임시저장 갱신", err);
          toast.error(
            "임시 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          );
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
        latestDraftFormationIdRef.current = response.saveMatchFormationDraft.id;
        done();
      },
      onError: (err) => {
        console.error("[FormationBuilder] 이탈 시 saveMatchFormationDraft", err);
        toast.error(
          "임시 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
      },
    });
  }, [
    commitSaveDraft,
    commitUpdateDraft,
    finalizeRegistrationLeaveAfterPersist,
    matchId,
    matchType,
    quarters,
    teamId,
    userId,
  ]);

  /**
   * 확정: 확정 수정 모드는 `updateMatchFormation`(확정 행 id)만.
   * 최초 등록은 드래프트가 있으면 `confirmMatchFormation`, 없으면 `createMatchFormation`.
   */
  const handleSaveConfirm = useCallback(() => {
    if (userId == null) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[FormationBuilder] 확정 저장: 로그인 userId 없음");
      }
      return;
    }
    if (!areAllQuartersFormationComplete(quarters)) return;
    if (isFinalizeBusy) return;

    const documentMatchType = matchType === "MATCH" ? "MATCH" : "INTERNAL";
    const tactics = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      documentMatchType,
    );

    const onFail = (err: unknown) => {
      setIsFinalizeBusy(false);
      if (isMatchFormationAlreadyConfirmedError(err)) {
        setAlreadyConfirmedOpen(true);
        return;
      }
      toast.error(
        "포메이션 확정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
      console.error("[FormationBuilder] 확정 실패", err);
    };

    const goHomeAfterSuccessfulConfirm = () => {
      latestDraftFormationIdRef.current = null;
      toast.success("포메이션이 확정되었습니다.");
      baseRouter.replace(FORMATION_CONFIRM_SUCCESS_PATH);
      baseRouter.refresh();
    };

    setIsFinalizeBusy(true);

    if (!isRegistrationFlow) {
      const formationId = ssrConfirmedFormationId;
      if (formationId == null) {
        setIsFinalizeBusy(false);
        toast.error(
          "확정된 포메이션 정보를 불러오지 못했습니다. 페이지를 새로고침해 주세요.",
        );
        return;
      }
      void executeUpdateConfirmedFormation(formationId, userId, tactics)
        .then(() => {
          setIsFinalizeBusy(false);
          goHomeAfterSuccessfulConfirm();
        })
        .catch((err: unknown) => {
          onFail(err);
        });
      return;
    }

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
          commitConfirm({
            variables: { draftId, userId },
            onCompleted: () => {
              setIsFinalizeBusy(false);
              goHomeAfterSuccessfulConfirm();
            },
            onError: onFail,
          });
        },
        onError: onFail,
      });
      return;
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
        setIsFinalizeBusy(false);
        if (response.createMatchFormation.isDraft) {
          toast.success("포메이션이 임시저장되었습니다.");
          return;
        }
        goHomeAfterSuccessfulConfirm();
      },
      onError: onFail,
    });
  }, [
    baseRouter,
    commitConfirm,
    commitCreateFormation,
    commitUpdateDraft,
    executeUpdateConfirmedFormation,
    isFinalizeBusy,
    isRegistrationFlow,
    matchId,
    matchType,
    quarters,
    ssrConfirmedFormationId,
    teamId,
    userId,
  ]);

  const isSaveConfirmPending =
    isFinalizeBusy ||
    isCreateFormationInFlight ||
    isConfirmInFlight ||
    isUpdateDraftInFlight ||
    isSaveDraftInFlight ||
    isUpdateConfirmedFormationInFlight;

  const content = isLgOrBelow ? (
    <FormationBuilderMobile {...commonProps} />
  ) : (
    <FormationBuilderDesktopWithDnd
      scheduleCard={scheduleCard}
      {...commonProps}
    />
  );

  return (
    <FormationNavigationGuardProvider value={guardedRouter}>
      <div
        className="min-h-dvh pt-safe bg-surface-primary flex flex-col"
        onClickCapture={captureAnchorClick}
      >
        <FormationHeader
          onBack={requestBack}
          onReset={handleReset}
          onSaveDraft={
            isRegistrationFlow && userId != null ? handleSaveDraft : undefined
          }
          isSaveDraftPending={
            isRegistrationFlow &&
            (isSaveDraftInFlight || isUpdateDraftInFlight)
          }
          onSaveConfirm={userId != null ? handleSaveConfirm : undefined}
          isSaveConfirmPending={isSaveConfirmPending}
          saveConfirmDisabled={saveConfirmDisabled}
          confirmLabel="확정"
        />
        <main className="flex-1 flex flex-col px-3 md:px-6 py-4 w-full items-center bg-surface-primary gap-4">
          {showDraftResumeBanner ? <FormationDraftResumeBanner /> : null}
          {content}
        </main>
        <FormationLeaveWithoutConfirmModal
          open={leaveWithoutConfirmOpen}
          onCancel={() => {
            clearPendingLeave();
            setLeaveWithoutConfirmOpen(false);
          }}
          onConfirmLeave={persistDraftAndExit}
        />
        <FormationLeaveConfirmedEditModal
          open={leaveConfirmedEditOpen}
          onCancel={() => {
            clearPendingLeave();
            setLeaveConfirmedEditOpen(false);
          }}
          onConfirmLeave={discardConfirmedEditAndExit}
        />
        <FormationAlreadyConfirmedModal
          open={alreadyConfirmedOpen}
          onGoToConfirmed={goToConfirmedFormationView}
        />
      </div>
    </FormationNavigationGuardProvider>
  );
}
