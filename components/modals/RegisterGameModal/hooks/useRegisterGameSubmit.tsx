"use client";

import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import { toast } from "@/lib/toast";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { observableToPromise } from "@/lib/relay/observableToPromise";
import type { RegisterGameValues } from "../schema";
import { mapRegisterGameValuesToCreateMatchInput } from "../lib/mapRegisterGameValuesToCreateMatchInput";
import { useCreateMatchMutation } from "./useCreateMatchMutation";

const TEAM_REQUIRED_MESSAGE =
  "팀을 선택해 주세요. 헤더에서 소속 팀을 선택한 뒤 다시 시도해 주세요.";

interface UseRegisterGameSubmitProps {
  selectedTeamIdNum: number | null;
  hideModal: () => void;
}

/**
 * 경기 등록 제출 오케스트레이션: 팀 검사 → input 변환 → mutation → findMatch 스토어 갱신 → toast/hide.
 * (홈 UpcomingMatchWithData가 동일 쿼리를 구독하므로 모달 닫은 뒤 카드가 바로 맞춰짐)
 */
export function useRegisterGameSubmit({
  selectedTeamIdNum,
  hideModal,
}: UseRegisterGameSubmitProps) {
  const environment = useRelayEnvironment();
  const { executeMutation, isInFlight } = useCreateMatchMutation();

  const onSubmit: SubmitHandler<RegisterGameValues> = useCallback(
    (data) => {
      if (selectedTeamIdNum == null) {
        toast.error(TEAM_REQUIRED_MESSAGE);
        return;
      }
      const createdTeamId = selectedTeamIdNum;
      const input = mapRegisterGameValuesToCreateMatchInput(data, createdTeamId);
      executeMutation({
        variables: { input },
        onCompleted: () => {
          void (async () => {
            try {
              await observableToPromise(
                fetchQuery(environment, FindMatchQuery, { createdTeamId }, {
                  fetchPolicy: "network-only",
                }),
              );
            } catch (e) {
              console.warn(
                "[RegisterGame] findMatch Relay refetch failed",
                e,
              );
            }
            toast.success("경기 등록이 완료되었습니다.");
            hideModal();
          })();
        },
        onError: (err) => {
          toast.error(err.message ?? "경기 등록에 실패했습니다.");
        },
      });
    },
    [selectedTeamIdNum, environment, executeMutation, hideModal],
  );

  return { onSubmit, isInFlight };
}
