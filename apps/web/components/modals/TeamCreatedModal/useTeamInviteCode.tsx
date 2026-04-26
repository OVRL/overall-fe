"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCreateInviteCodeMutation } from "./useCreateInviteCodeMutation";
import { fetchInviteCodeByTeam } from "./fetchInviteCodeByTeam";
import { isAlreadyExistsInviteCodeError } from "./isAlreadyExistsInviteCodeError";
import { toast } from "@/lib/toast";

/**
 * 선택 팀의 초대 코드 해결(생성 또는 기존 조회) 상태와 액션을 담당합니다.
 * - 마운트 시 1회 생성 시도, 실패 시 "초대 코드 만들기" 재시도 가능
 * - "이미 팀 초대 코드가 존재합니다" 시 findInviteCodeByTeam으로 재조회
 */
export function useTeamInviteCode(teamId: number | null) {
  const { executeMutation, isInFlight } = useCreateInviteCodeMutation();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [firstLoadFailed, setFirstLoadFailed] = useState(false);
  const hasAttemptedInitialLoad = useRef(false);

  const runCreateInviteCode = useCallback(
    (onSuccess: (code: string) => void, onError: () => void) => {
      if (teamId == null) {
        onError();
        return;
      }
      executeMutation({
        variables: { teamId },
        onCompleted(data) {
          const code = data.createInviteCode?.code;
          if (code != null) {
            setInviteCode(code);
            onSuccess(code);
          } else {
            onError();
          }
        },
        onError(error) {
          if (isAlreadyExistsInviteCodeError(error)) {
            fetchInviteCodeByTeam(teamId)
              .then((snap) => {
                if (snap != null) {
                  setInviteCode(snap.code);
                  onSuccess(snap.code);
                } else {
                  onError();
                }
              })
              .catch(onError);
          } else {
            onError();
          }
        },
      });
    },
    [executeMutation, teamId],
  );

  useEffect(() => {
    if (hasAttemptedInitialLoad.current) return;
    hasAttemptedInitialLoad.current = true;

    if (teamId == null) {
      const tid = setTimeout(() => setFirstLoadFailed(true), 0);
      return () => clearTimeout(tid);
    }

    runCreateInviteCode(
      () => {},
      () => setFirstLoadFailed(true),
    );
  }, [teamId, runCreateInviteCode]);

  const requestInviteCode = useCallback(() => {
    if (teamId == null) {
      toast.error("팀 정보를 불러올 수 없습니다.");
      return;
    }
    runCreateInviteCode(
      () => {},
      () => toast.error("초대 코드 생성에 실패했습니다."),
    );
  }, [teamId, runCreateInviteCode]);

  const copyCode = useCallback(() => {
    if (inviteCode == null) return;
    navigator.clipboard.writeText(inviteCode).then(
      () => toast.success("코드가 복사되었습니다."),
      () => toast.error("복사에 실패했습니다."),
    );
  }, [inviteCode]);

  return {
    inviteCode,
    firstLoadFailed,
    isInFlight,
    requestInviteCode,
    copyCode,
  };
}
