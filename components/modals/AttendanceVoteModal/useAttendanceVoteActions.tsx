import { useState } from "react";
import { fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import { toast } from "@/lib/toast";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import type { useCreateMatchAttendanceMutation as CreateMatchAttendanceMutationType } from "@/__generated__/useCreateMatchAttendanceMutation.graphql";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { FindMatchAttendanceQuery } from "@/lib/relay/queries/findMatchAttendanceQuery";
import { observableToPromise } from "@/lib/relay/observableToPromise";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";
import { useCreateMatchAttendanceMutation } from "./useCreateMatchAttendanceMutation";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

type AttendanceChoice = "ATTEND" | "ABSENT";

/**
 * SRP: "참석 투표 모달에서의 사용자 액션(주소 복사, 참석/불참 투표)"에 대한 변경은 이 훅만 수정하면 됨.
 */
export function useAttendanceVoteActions(
  match: MatchNode | null,
  createdTeamId: number,
  userId: number | null,
  hideModal: () => void,
) {
  const environment = useRelayEnvironment();
  const { executeMutation, isInFlight } = useCreateMatchAttendanceMutation();
  const [pendingChoice, setPendingChoice] = useState<AttendanceChoice | null>(
    null,
  );

  const handleCopyAddress = () => {
    if (!match?.venue?.address) return;
    navigator.clipboard.writeText(match.venue.address).then(
      () => toast.success("주소가 복사되었습니다."),
      () => toast.error("주소 복사에 실패했습니다."),
    );
  };

  const submitVote = (attendanceStatus: AttendanceChoice) => {
    if (!match || userId == null) {
      toast.error("투표에 필요한 정보가 없습니다.");
      return;
    }
    const matchId = parseMatchIdForApi(match.id);
    if (matchId == null) {
      toast.error("경기 정보를 확인할 수 없습니다.");
      return;
    }
    const successMessage =
      attendanceStatus === "ATTEND"
        ? "참석으로 투표되었습니다."
        : "불참으로 투표되었습니다.";

    setPendingChoice(attendanceStatus);
    executeMutation({
      variables: {
        input: {
          matchId,
          teamId: createdTeamId,
          userId,
          attendanceStatus,
          memberType: "MEMBER",
        },
      },
      onCompleted: (response: CreateMatchAttendanceMutationType["response"]) => {
        setPendingChoice(null);
        if (response.createMatchAttendance == null) return;
        toast.success(successMessage);
        hideModal();
        /* 참석 요약(findMatchAttendance) 캐시 갱신 — 모달 재진입 시 store-or-network가 최신을 쓰도록 */
        void observableToPromise(
          fetchQuery(
            environment,
            FindMatchAttendanceQuery,
            { matchId, teamId: createdTeamId },
            { fetchPolicy: "network-only" },
          ),
        ).catch(() => {
          /* refetch 실패해도 토스트·닫기는 이미 완료. 다음 진입 시 네트워크로 동기화됨 */
        });
      },
      onError: (err) => {
        setPendingChoice(null);
        toast.error(
          getGraphQLErrorMessage(err, "투표 처리 중 오류가 발생했습니다."),
        );
      },
    });
  };

  const handleAttend = () => submitVote("ATTEND");
  const handleAbsent = () => submitVote("ABSENT");

  return {
    handleCopyAddress,
    handleAttend,
    handleAbsent,
    isInFlight,
    pendingVoteChoice: pendingChoice,
  };
}
