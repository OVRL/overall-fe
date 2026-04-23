"use client";

import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import { toast } from "@/lib/toast";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { observableToPromise } from "@/lib/relay/observableToPromise";
import useModal from "@/hooks/useModal";
import { useModalStore } from "@/contexts/ModalContext";
import type { RegisterGameValues } from "../../RegisterGameModal/schema";
import { mapRegisterGameValuesToUpdateMatchInput } from "../lib/mapRegisterGameValuesToUpdateMatchInput";
import { useUpdateMatchMutation } from "./useEditGameModalUpdateMatch";

interface UseEditGameSubmitProps {
  matchId: number;
  teamId: number;
}

export function useEditGameSubmit({ matchId, teamId }: UseEditGameSubmitProps) {
  const environment = useRelayEnvironment();
  const { executeMutation, isInFlight } = useUpdateMatchMutation();
  const { openModal: openConfirmModal } = useModal("CONFIRM");

  const executeUpdate = useCallback(
    (data: RegisterGameValues) => {
      const input = mapRegisterGameValuesToUpdateMatchInput(data, matchId);
      executeMutation({
        variables: { input },
        onCompleted: () => {
          void (async () => {
            try {
              // 최신 데이터 조회를 위해 findMatch 쿼리만 갱신 (전체 캐시 갱신 목적)
              await observableToPromise(
                fetchQuery(
                  environment,
                  FindMatchQuery,
                  { createdTeamId: teamId },
                  {
                    fetchPolicy: "network-only",
                  },
                ),
              );
            } catch (e) {
              console.warn("[EditGame] findMatch Relay refetch failed", e);
            }
            toast.success("경기 설정이 수정되었습니다.");
            
            // 모든 모달 닫기 (확인 모달·편집 모달 등 스택 전체)
            useModalStore.getState().closeAll();
            
            // 포메이션 등의 클라이언트 상태를 지우고 확실히 적용되게 하기 위해 초기화 리로드
            window.location.reload();
          })();
        },
        onError: (err) => {
          toast.error(err.message ?? "경기 수정에 실패했습니다.");
        },
      });
    },
    [matchId, teamId, environment, executeMutation],
  );

  const onSubmit: SubmitHandler<RegisterGameValues> = useCallback(
    (data) => {
      openConfirmModal({
        title: "경기 설정을 수정할 경우\n수정 중이던 데이터는 모두 초기화 됩니다.\n그래도 진행하시겠습니까?",
        confirmText: "수정",
        cancelText: "취소",
        onConfirm: () => executeUpdate(data),
      });
    },
    [openConfirmModal, executeUpdate],
  );

  return { onSubmit, isInFlight };
}
