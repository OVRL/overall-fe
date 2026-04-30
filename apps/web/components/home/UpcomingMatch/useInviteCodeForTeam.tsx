"use client";

import { useCallback, useEffect, useState } from "react";
import { useCreateInviteCodeMutation } from "@/components/modals/TeamCreatedModal/useCreateInviteCodeMutation";
import { isInviteExpired } from "@/lib/inviteCode/inviteCodeExpiry";
import { fetchInviteCodeByTeam } from "@/lib/inviteCode/fetchInviteCodeByTeam";
import { runCreateInviteCodeForTeam } from "@/lib/inviteCode/runCreateInviteCodeForTeam";
import { toast } from "@/lib/toast";

type LoadStatus = "idle" | "loading" | "ready";

/** 조회/완료 시점의 teamId와 묶어서, 팀 전환 시 이전 팀 코드가 잠깐 보이지 않게 함 */
type InviteSnapshot = {
  teamId: number;
  code: string | null;
  expiredAt: string | null;
  status: LoadStatus;
};

const SITE_ORIGIN = "https://ovr-log.com";

function writeInviteCodeToClipboard(code: string) {
  void navigator.clipboard.writeText(code).then(
    () => toast.success("코드가 복사되었습니다."),
    () => toast.error("복사에 실패했습니다."),
  );
}

function writeInviteLinkToClipboard(code: string) {
  const link = `${SITE_ORIGIN}/invite/${code}`;
  void navigator.clipboard.writeText(link).then(
    () => toast.success("초대 링크가 복사되었습니다."),
    () => toast.error("복사에 실패했습니다."),
  );
}

export function buildInviteLink(code: string) {
  return `${SITE_ORIGIN}/invite/${code}`;
}

/**
 * 팀 생성 직후에는 서버에 초대 코드가 이미 있을 수 있으나 findInviteCodeByTeam이
 * 잠시 null이거나 스키마/타이밍 차이가 날 수 있습니다. TeamCreatedModal의
 * useTeamInviteCode와 맞추기 위해, 조회 결과가 없으면 createInviteCode로
 * 확보합니다(이미 있으면 에러 후 재조회).
 * 만료된 코드는 재생성 후 상태에 반영합니다.
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
      await Promise.resolve();
      if (cancelled) return;

      setSnapshot({
        teamId,
        status: "loading",
        code: null,
        expiredAt: null,
      });

      const fromFetch = await fetchInviteCodeByTeam(teamId);
      if (cancelled) return;

      if (fromFetch != null && !isInviteExpired(fromFetch.expiredAt)) {
        setSnapshot({
          teamId,
          status: "ready",
          code: fromFetch.code,
          expiredAt: fromFetch.expiredAt,
        });
        return;
      }

      try {
        const resolved = await runCreateInviteCodeForTeam(
          teamId,
          executeMutation,
        );
        if (cancelled) return;
        setSnapshot({
          teamId,
          status: "ready",
          code: resolved.code,
          expiredAt: resolved.expiredAt,
        });
      } catch {
        if (cancelled) return;
        setSnapshot({
          teamId,
          status: "ready",
          code: null,
          expiredAt: null,
        });
      }
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
    void runCreateInviteCodeForTeam(teamId, executeMutation)
      .then((next) => {
        setSnapshot({
          teamId,
          status: "ready",
          code: next.code,
          expiredAt: next.expiredAt,
        });
      })
      .catch(() => {
        toast.error("초대 코드 생성에 실패했습니다.");
      });
  }, [executeMutation, teamId]);

  const copyCode = useCallback(() => {
    if (teamId == null) return;
    const snap = snapshot?.teamId === teamId ? snapshot : null;
    const code = snap?.code;
    const expiredAt = snap?.expiredAt;
    if (code == null) return;

    if (expiredAt == null || !isInviteExpired(expiredAt)) {
      writeInviteCodeToClipboard(code);
      return;
    }

    void runCreateInviteCodeForTeam(teamId, executeMutation)
      .then((next) => {
        setSnapshot({
          teamId,
          status: "ready",
          code: next.code,
          expiredAt: next.expiredAt,
        });
        writeInviteCodeToClipboard(next.code);
      })
      .catch(() => {
        toast.error(
          "초대 코드를 갱신하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      });
  }, [teamId, snapshot, executeMutation]);

  const copyLink = useCallback(() => {
    if (teamId == null) return;
    const snap = snapshot?.teamId === teamId ? snapshot : null;
    const code = snap?.code;
    const expiredAt = snap?.expiredAt;
    if (code == null) return;

    if (expiredAt == null || !isInviteExpired(expiredAt)) {
      writeInviteLinkToClipboard(code);
      return;
    }

    void runCreateInviteCodeForTeam(teamId, executeMutation)
      .then((next) => {
        setSnapshot({ teamId, status: "ready", code: next.code, expiredAt: next.expiredAt });
        writeInviteLinkToClipboard(next.code);
      })
      .catch(() => {
        toast.error("초대 링크를 갱신하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      });
  }, [teamId, snapshot, executeMutation]);

  const expiredAt =
    teamId != null && snapshot?.teamId === teamId ? snapshot.expiredAt : null;

  const isExpired =
    expiredAt != null ? isInviteExpired(expiredAt) : false;

  return {
    inviteCode,
    expiredAt,
    isExpired,
    isLoading,
    isInFlight,
    requestCreateInviteCode,
    copyCode,
    copyLink,
  };
}
