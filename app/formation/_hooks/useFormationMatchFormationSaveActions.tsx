"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";
import { useSaveMatchFormationDraftMutation } from "@/app/formation/_hooks/useSaveMatchFormationDraftMutation";
import { useUpdateMatchFormationForDraftMutation } from "@/app/formation/_hooks/useUpdateMatchFormationForDraftMutation";
import { useConfirmMatchFormationMutation } from "@/app/formation/_hooks/useConfirmMatchFormationMutation";
import { useCreateMatchFormationMutation } from "@/app/formation/_hooks/useCreateMatchFormationMutation";
import { buildMatchFormationTacticsDocumentFromQuarters } from "@/lib/formation/buildMatchFormationTacticsDocument";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { toast } from "@/lib/toast";
import type { QuarterData } from "@/types/formation";
import type { FormationMatchFormationPrimarySource } from "@/types/formationMatchPageSnapshot";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";

/** 라인업·팀 드래프트 변경 후 자동 저장 뮤테이션 디바운스 간격 */
export const FORMATION_AUTO_SAVE_DEBOUNCE_MS = 800;

export type UseFormationMatchFormationSaveActionsInput = {
  userId: number | null;
  quarters: QuarterData[];
  matchType: "MATCH" | "INTERNAL";
  draftTeamByKey: InHouseDraftTeamByPlayerKey;
  resolvedSavePrimarySource: FormationMatchFormationPrimarySource | null;
  savedDraftMatchFormationId: number | null;
  savedLatestConfirmedMatchFormationId: number | null;
};

/**
 * 포메이션 확정 저장 GraphQL 분기, 드래프트/확정 행 id ref 유지,
 * 및 무음·디바운스 자동 저장(`scheduleFormationAutoSave`).
 */
export function useFormationMatchFormationSaveActions(
  input: UseFormationMatchFormationSaveActionsInput,
) {
  const {
    userId,
    quarters,
    matchType,
    draftTeamByKey,
    resolvedSavePrimarySource,
    savedDraftMatchFormationId,
    savedLatestConfirmedMatchFormationId,
  } = input;

  const router = useRouter();
  const { matchId, teamId } = useFormationMatchIds();
  const { commit: commitSaveDraft, isInFlight: isSaveDraftInFlight } =
    useSaveMatchFormationDraftMutation();
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

  const latestDraftFormationIdRef = useRef<number | null>(
    savedDraftMatchFormationId ?? null,
  );
  const latestConfirmedFormationIdRef = useRef<number | null>(
    savedLatestConfirmedMatchFormationId ?? null,
  );

  const quartersRef = useRef(quarters);
  const draftTeamByKeyRef = useRef(draftTeamByKey);
  const matchTypeRef = useRef(matchType);
  const userIdRef = useRef(userId);
  const matchIdRef = useRef(matchId);
  const teamIdRef = useRef(teamId);
  const resolvedSavePrimarySourceRef = useRef(resolvedSavePrimarySource);

  useLayoutEffect(() => {
    quartersRef.current = quarters;
    draftTeamByKeyRef.current = draftTeamByKey;
    matchTypeRef.current = matchType;
    userIdRef.current = userId;
    matchIdRef.current = matchId;
    teamIdRef.current = teamId;
    resolvedSavePrimarySourceRef.current = resolvedSavePrimarySource;
  }, [
    quarters,
    draftTeamByKey,
    matchType,
    userId,
    matchId,
    teamId,
    resolvedSavePrimarySource,
  ]);

  const autoSaveDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearFormationAutoSaveDebounce = useCallback(() => {
    if (autoSaveDebounceTimerRef.current != null) {
      clearTimeout(autoSaveDebounceTimerRef.current);
      autoSaveDebounceTimerRef.current = null;
    }
  }, []);

  const flushFormationAutoSave = useCallback(() => {
    const uid = userIdRef.current;
    if (uid == null) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[FormationBuilder] 자동 저장: 로그인 userId 없음");
      }
      return;
    }

    const mt = matchTypeRef.current;
    const documentMatchType = mt === "MATCH" ? "MATCH" : "INTERNAL";
    const tactics = buildMatchFormationTacticsDocumentFromQuarters(
      quartersRef.current,
      documentMatchType,
      mt === "INTERNAL"
        ? { inHouseDraftTeamByKey: draftTeamByKeyRef.current }
        : undefined,
    );

    const draftId = latestDraftFormationIdRef.current;
    const confirmedId = latestConfirmedFormationIdRef.current;
    const primary = resolvedSavePrimarySourceRef.current;

    const onAutoSaveError = (err: unknown, label: string) => {
      console.error(label, err);
      toast.error(getGraphQLErrorMessage(err, "자동 저장에 실패했습니다."));
    };

    if (primary === "confirmed" && confirmedId != null) {
      commitUpdateForConfirm({
        variables: {
          input: {
            id: confirmedId,
            tactics,
          },
        },
        onCompleted: (res) => {
          if (res.updateMatchFormation == null) {
            toast.error(
              "자동 저장 응답이 비어 있습니다. 네트워크 탭에서 GraphQL errors를 확인해 주세요.",
            );
          }
        },
        onError: (err) =>
          onAutoSaveError(
            err,
            "[FormationBuilder] auto-save updateMatchFormation (confirmed)",
          ),
      });
      return;
    }

    if (draftId != null) {
      commitUpdateDraft({
        variables: {
          input: {
            id: draftId,
            tactics,
          },
        },
        onCompleted: () => {},
        onError: (err) =>
          onAutoSaveError(
            err,
            "[FormationBuilder] auto-save updateMatchFormation (draft)",
          ),
      });
      return;
    }

    commitSaveDraft({
      variables: {
        input: {
          matchId: matchIdRef.current,
          teamId: teamIdRef.current,
          tactics,
        },
      },
      onCompleted: (response) => {
        latestDraftFormationIdRef.current =
          response.saveMatchFormationDraft.id;
      },
      onError: (err) =>
        onAutoSaveError(
          err,
          "[FormationBuilder] auto-save saveMatchFormationDraft",
        ),
    });
  }, [commitSaveDraft, commitUpdateDraft, commitUpdateForConfirm]);

  const scheduleFormationAutoSave = useCallback(() => {
    clearFormationAutoSaveDebounce();
    autoSaveDebounceTimerRef.current = setTimeout(() => {
      autoSaveDebounceTimerRef.current = null;
      flushFormationAutoSave();
    }, FORMATION_AUTO_SAVE_DEBOUNCE_MS);
  }, [clearFormationAutoSaveDebounce, flushFormationAutoSave]);

  const cancelFormationAutoSave = useCallback(() => {
    clearFormationAutoSaveDebounce();
  }, [clearFormationAutoSaveDebounce]);

  useEffect(
    () => () => {
      clearFormationAutoSaveDebounce();
    },
    [clearFormationAutoSaveDebounce],
  );

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
            tactics,
          },
        },
        onCompleted: () => {
          commitConfirm({
            variables: { draftId },
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

  return {
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
  };
}
