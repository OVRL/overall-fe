"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchInviteCodeByTeam } from "@/components/modals/TeamCreatedModal/fetchInviteCodeByTeam";
import { isAlreadyExistsInviteCodeError } from "@/components/modals/TeamCreatedModal/isAlreadyExistsInviteCodeError";
import { useCreateInviteCodeMutation } from "@/components/modals/TeamCreatedModal/useCreateInviteCodeMutation";
import { toast } from "@/lib/toast";

type LoadStatus = "idle" | "loading" | "ready";

/**
 * 초대 코드는 findInviteCodeByTeam으로 먼저 조회하고,
 * 없을 때만 createInviteCode로 생성합니다 (불필요한 뮤테이션 방지).
 */
export function useInviteCodeForTeam(teamId: number | null) {
  const { executeMutation, isInFlight } = useCreateInviteCodeMutation();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadStatus>(() =>
    teamId == null ? "idle" : "loading",
  );

  useEffect(() => {
    if (teamId == null) return;

    let cancelled = false;

    fetchInviteCodeByTeam(teamId).then((code) => {
      if (cancelled) return;
      setInviteCode(code);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  const requestCreateInviteCode = useCallback(() => {
    if (teamId == null) {
      toast.error("팀 정보를 불러올 수 없습니다.");
      return;
    }
    executeMutation({
      variables: { teamId },
      onCompleted(data) {
        const code = data.createInviteCode?.code;
        if (code != null) {
          setInviteCode(code);
        } else {
          toast.error("초대 코드 생성에 실패했습니다.");
        }
      },
      onError(error) {
        if (isAlreadyExistsInviteCodeError(error)) {
          fetchInviteCodeByTeam(teamId)
            .then((code) => {
              if (code != null) {
                setInviteCode(code);
              } else {
                toast.error("초대 코드를 불러오지 못했습니다.");
              }
            })
            .catch(() => toast.error("초대 코드 생성에 실패했습니다."));
        } else {
          toast.error("초대 코드 생성에 실패했습니다.");
        }
      },
    });
  }, [executeMutation, teamId]);

  const copyCode = useCallback(() => {
    if (inviteCode == null) return;
    navigator.clipboard.writeText(inviteCode).then(
      () => toast.success("코드가 복사되었습니다."),
      () => toast.error("복사에 실패했습니다."),
    );
  }, [inviteCode]);

  return {
    inviteCode,
    isLoading: status === "loading",
    isInFlight,
    requestCreateInviteCode,
    copyCode,
  };
}
