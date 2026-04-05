"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

import { useFormationManager } from "@/hooks/formation/useFormationManager";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useUserId } from "@/hooks/useUserId";
import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";
import { useSaveMatchFormationDraftMutation } from "@/app/formation/_hooks/useSaveMatchFormationDraftMutation";
import { useUpdateMatchFormationForDraftMutation } from "@/app/formation/_hooks/useUpdateMatchFormationForDraftMutation";
import { useCreateMatchFormationMutation } from "@/app/formation/_hooks/useCreateMatchFormationMutation";
import FormationBuilderMobile from "./FormationBuilderMobile";
import { FormationBuilderContentSkeleton } from "./FormationBuilderContentSkeleton";
import { buildQuartersFromMatch } from "@/lib/formation/buildQuartersFromMatch";
import { buildMatchFormationTacticsDocumentFromQuarters } from "@/lib/formation/buildMatchFormationTacticsDocument";
import { MATCH_FORMATION_DRAFT_QUARTER_PLACEHOLDER } from "@/lib/formation/matchFormationDraftConstants";
import { toast } from "@/lib/toast";
import { Player, type QuarterData } from "@/types/formation";
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
}

/**
 * 포메이션 빌더 오케스트레이터: 비즈니스 상태만 유지, 1024px 기준 데스크/모바일 분기.
 * 선수 풀은 `FormationMatchPlayersProvider`(SSR 데이터)에서 읽습니다.
 */
export default function FormationBuilder({
  scheduleCard,
  matchQuarterSpec = null,
  savedInitialQuarters = null,
}: FormationBuilderProps) {
  const { matchId, teamId } = useFormationMatchIds();
  const userId = useUserId();
  const { commit: commitSaveDraft, isInFlight: isSaveDraftInFlight } =
    useSaveMatchFormationDraftMutation();
  const { commit: commitUpdateDraft, isInFlight: isUpdateDraftInFlight } =
    useUpdateMatchFormationForDraftMutation();
  const { commit: commitCreateFormation, isInFlight: isCreateFormationInFlight } =
    useCreateMatchFormationMutation();
  /** 첫 `saveMatchFormationDraft` 응답 id — 이후 임시저장은 `updateMatchFormation`만 사용 */
  const latestDraftFormationIdRef = useRef<number | null>(null);

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
  const isLgOrBelow = useIsMobile(1023);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );
  const matchType = matchQuarterSpec?.matchType ?? "INTERNAL";
  const quarterDurationMinutes =
    matchQuarterSpec?.quarterDurationMinutes ?? 25;
  const [selectedSubTeam, setSelectedSubTeam] = useState<"A" | "B">("A");

  const assignPlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number, player: Player) => {
      assignPlayer(quarterId, positionIndex, player, {
        inHouseSubTeam: selectedSubTeam,
      });
    },
    [assignPlayer, selectedSubTeam],
  );

  const removePlayerWithSubTeam = useCallback(
    (quarterId: number, positionIndex: number) => {
      removePlayer(quarterId, positionIndex, {
        inHouseSubTeam: selectedSubTeam,
      });
    },
    [removePlayer, selectedSubTeam],
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
            quarter: MATCH_FORMATION_DRAFT_QUARTER_PLACEHOLDER,
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
          quarter: MATCH_FORMATION_DRAFT_QUARTER_PLACEHOLDER,
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

  /** 확정 행 생성 — 이후 `confirmMatchFormation` 플로우로 바꿀 때 여기서 분기 */
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
    );
    commitCreateFormation({
      variables: {
        input: {
          matchId,
          teamId,
          userId,
          quarter: MATCH_FORMATION_DRAFT_QUARTER_PLACEHOLDER,
          tactics,
        },
      },
      onCompleted: (response) => {
        toast.success(
          response.createMatchFormation.isDraft
            ? "포메이션이 임시저장되었습니다."
            : "포메이션이 저장되었습니다.",
        );
      },
      onError: (err) => {
        console.error("[FormationBuilder] createMatchFormation", err);
      },
    });
  }, [
    commitCreateFormation,
    matchId,
    teamId,
    userId,
    quarters,
    matchType,
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
        isSaveConfirmPending={isCreateFormationInFlight}
      />
      <main className="flex-1 flex flex-col px-3 md:px-6 py-4 w-full items-center bg-surface-primary">
        {content}
      </main>
    </div>
  );
}
