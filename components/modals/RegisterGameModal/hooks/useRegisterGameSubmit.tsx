"use client";

import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "@/lib/toast";
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
 * 경기 등록 제출 오케스트레이션: 팀 검사 → input 변환 → mutation 호출 → toast/hide.
 */
export function useRegisterGameSubmit({
  selectedTeamIdNum,
  hideModal,
}: UseRegisterGameSubmitProps) {
  const { executeMutation, isInFlight } = useCreateMatchMutation();

  const onSubmit: SubmitHandler<RegisterGameValues> = useCallback(
    (data) => {
      if (selectedTeamIdNum == null) {
        toast.error(TEAM_REQUIRED_MESSAGE);
        return;
      }
      const input = mapRegisterGameValuesToCreateMatchInput(data, selectedTeamIdNum);
      executeMutation({
        variables: { input },
        onCompleted: () => {
          toast.success("경기 등록이 완료되었습니다.");
          hideModal();
        },
        onError: (err) => {
          toast.error(err.message ?? "경기 등록에 실패했습니다.");
        },
      });
    },
    [selectedTeamIdNum, executeMutation, hideModal],
  );

  return { onSubmit, isInFlight };
}
