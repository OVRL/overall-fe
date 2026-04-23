"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchInviteCodeByTeam } from "@/components/modals/TeamCreatedModal/fetchInviteCodeByTeam";
import { isAlreadyExistsInviteCodeError } from "@/components/modals/TeamCreatedModal/isAlreadyExistsInviteCodeError";
import { useCreateInviteCodeMutation } from "@/components/modals/TeamCreatedModal/useCreateInviteCodeMutation";
import { toast } from "@/lib/toast";

type LoadStatus = "idle" | "loading" | "ready";

/** 조회/완료 시점의 teamId와 묶어서, 팀 전환 시 이전 팀 코드가 잠깐 보이지 않게 함 */
type InviteSnapshot = {
  teamId: number;
  code: string | null;
  status: LoadStatus;
};

/**
 * 팀 생성 직후에는 서버에 초대 코드가 이미 있을 수 있으나 findInviteCodeByTeam이
 * 잠시 null이거나 스키마/타이밍 차이가 날 수 있습니다. TeamCreatedModal의
 * useTeamInviteCode와 맞추기 위해, 조회 결과가 없으면 createInviteCode로
 * 확보합니다(이미 있으면 에러 후 재조회).
 */
export function useInviteCodeForTeam(teamId: number | null) {
  const { executeMutation, isInFlight } = useCreateInviteCodeMutation();
  const [snapshot, setSnapshot] = useState<InviteSnapshot | null>(null);

  useEffect(() => {
    if (teamId == null) {
      return;
    }

    let cancelled = false;

    void (async () => {
      // effect 본문에서 동기 setState 금지(린트) → 마이크로태스크 이후로 미룸
      await Promise.resolve();
      if (cancelled) return;

      setSnapshot({ teamId, status: "loading", code: null });

      const fromFetch = await fetchInviteCodeByTeam(teamId);
      if (cancelled) return;
      if (fromFetch != null) {
        setSnapshot({ teamId, status: "ready", code: fromFetch });
        return;
      }

      executeMutation({
        variables: { teamId },
        onCompleted(data) {
          if (cancelled) return;
          const code = data.createInviteCode?.code ?? null;
          setSnapshot({ teamId, status: "ready", code });
        },
        onError(error) {
          if (cancelled) return;
          if (isAlreadyExistsInviteCodeError(error)) {
            void fetchInviteCodeByTeam(teamId)
              .then((code) => {
                if (cancelled) return;
                setSnapshot({ teamId, status: "ready", code });
              })
              .catch(() => {
                if (cancelled) return;
                setSnapshot({ teamId, status: "ready", code: null });
              });
          } else {
            setSnapshot({ teamId, status: "ready", code: null });
          }
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [teamId, executeMutation]);

  const inviteCode =
    teamId != null && snapshot?.teamId === teamId ? snapshot.code : null;

  const isLoading =
    teamId != null &&
    (snapshot?.teamId !== teamId || snapshot.status === "loading");

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
          setSnapshot({ teamId, status: "ready", code });
        } else {
          toast.error("초대 코드 생성에 실패했습니다.");
        }
      },
      onError(error) {
        if (isAlreadyExistsInviteCodeError(error)) {
          fetchInviteCodeByTeam(teamId)
            .then((code) => {
              if (code != null) {
                setSnapshot({ teamId, status: "ready", code });
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
    isLoading,
    isInFlight,
    requestCreateInviteCode,
    copyCode,
  };
}
