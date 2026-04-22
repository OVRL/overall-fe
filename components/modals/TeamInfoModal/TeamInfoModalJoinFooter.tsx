"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import useModal from "@/hooks/useModal";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useCancelJoinRequestMutation } from "./hooks/useCancelJoinRequestMutation";
import { useRequestJoinTeamMutation } from "./hooks/useRequestJoinTeamMutation";

type Props = {
  inviteCode: string;
  /** 서버 findMyJoinRequest에서 해당 팀·PENDING 이면 전달 — 승인 대기 UI 초기 표시 */
  initialPendingJoinRequestId?: number | null;
  className?: string;
};

/**
 * 팀 정보 모달 하단 — 가입 신청 / 승인 대기·가입 취소.
 * - 가입/취소 비동기 완료는 joinEpochRef / cancelEpochRef 로 교차 무효화(레이스 방지).
 * - 가입 신청: 서버 응답 후 joinRequestId 필요 → Relay 스토어 낙관적 업데이트 미사용.
 * - 가입 취소: 로컬 낙관적 상태 + 실패 시 복구.
 */
export function TeamInfoModalJoinFooter({
  inviteCode,
  initialPendingJoinRequestId = null,
  className,
}: Props) {
  const { hideModal } = useModal();
  const { executeMutation: requestJoin, isInFlight: isRequestInFlight } =
    useRequestJoinTeamMutation();
  const { executeMutation: cancelJoin, isInFlight: isCancelInFlight } =
    useCancelJoinRequestMutation();

  /** null이면 아직 신청 전·취소 완료 후 */
  const [pendingJoinRequestId, setPendingJoinRequestId] = useState<
    number | null
  >(() => initialPendingJoinRequestId ?? null);

  /** 가입 신청 시작 시 취소 콜백 무효화, 취소 시작 시 가입 콜백 무효화 */
  const joinEpochRef = useRef(0);
  const cancelEpochRef = useRef(0);
  /** 연타로 이중 commit 방지 (Relay isInFlight보다 앞선 동기 가드) */
  const joinLockRef = useRef(false);

  const handleRequestJoin = useCallback(() => {
    if (joinLockRef.current) return;
    joinLockRef.current = true;
    cancelEpochRef.current += 1;
    const myJoin = ++joinEpochRef.current;

    requestJoin({
      variables: {
        input: { inviteCode },
      },
      onCompleted: (res) => {
        joinLockRef.current = false;
        if (myJoin !== joinEpochRef.current) return;

        const row = res.requestJoinTeam;
        if (row == null) {
          toast.error("가입 신청 응답을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.");
          return;
        }
        setPendingJoinRequestId(row.id);
        toast.success("가입 신청이 접수되었습니다. 관리자 승인을 기다려 주세요.");
      },
      onError: (err) => {
        joinLockRef.current = false;
        if (myJoin !== joinEpochRef.current) return;
        toast.error(getGraphQLErrorMessage(err));
      },
    });
  }, [inviteCode, requestJoin]);

  const handleCancelJoin = useCallback(() => {
    if (pendingJoinRequestId == null) return;

    const previousId = pendingJoinRequestId;
    joinEpochRef.current += 1;
    const myCancel = ++cancelEpochRef.current;

    // 낙관적: 즉시 신청 전 UI로 — 실패 시 복구
    setPendingJoinRequestId(null);

    cancelJoin({
      variables: { joinRequestId: previousId },
      onCompleted: (res) => {
        if (myCancel !== cancelEpochRef.current) return;

        if (res.cancelJoinRequest) {
          toast.success("가입 신청을 취소했습니다.");
          return;
        }
        setPendingJoinRequestId(previousId);
        toast.error("가입 취소에 실패했습니다.");
      },
      onError: (err) => {
        if (myCancel !== cancelEpochRef.current) return;
        setPendingJoinRequestId(previousId);
        toast.error(getGraphQLErrorMessage(err));
      },
    });
  }, [pendingJoinRequestId, cancelJoin]);

  const isPending = pendingJoinRequestId != null;
  const busy = isRequestInFlight || isCancelInFlight;

  return (
    <div className={cn("flex w-full gap-3 pt-1", className)}>
      {!isPending ? (
        <>
          <Button
            type="button"
            variant="primary"
            size="xl"
            className="flex-1 text-Label-Fixed_black"
            disabled={busy}
            aria-busy={isRequestInFlight}
            onClick={handleRequestJoin}
          >
            {isRequestInFlight ? (
              <LoadingSpinner label="가입 신청 처리 중" size="sm" />
            ) : (
              "가입 신청"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xl"
            className="flex-1"
            disabled={busy}
            onClick={hideModal}
          >
            취소
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="primary"
            size="xl"
            className="flex-1 text-Label-Fixed_black"
            disabled
            aria-disabled
          >
            승인 대기중
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xl"
            className="flex-1"
            disabled={busy}
            aria-busy={isCancelInFlight}
            onClick={handleCancelJoin}
          >
            {isCancelInFlight ? (
              <LoadingSpinner label="가입 취소 처리 중" size="sm" />
            ) : (
              "가입 취소"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
