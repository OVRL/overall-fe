import { useState } from "react";
import { fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import { toast } from "@/lib/toast";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import type { useCreateMatchAttendanceMutation as CreateMatchAttendanceMutationType } from "@/__generated__/useCreateMatchAttendanceMutation.graphql";
import type { useUpdateMatchAttendanceMutation as UpdateMatchAttendanceMutationType } from "@/__generated__/useUpdateMatchAttendanceMutation.graphql";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { FindMatchAttendanceQuery } from "@/lib/relay/queries/findMatchAttendanceQuery";
import { observableToPromise } from "@/lib/relay/observableToPromise";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";
import { useCreateMatchAttendanceMutation } from "./useCreateMatchAttendanceMutation";
import { useUpdateMatchAttendanceMutation } from "./useUpdateMatchAttendanceMutation";
import type { MatchAttendanceRow } from "./findMyCommittedMatchAttendanceRow";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

type AttendanceChoice = "ATTEND" | "ABSENT";

export type AttendanceVoteSubmitContext = {
  /** 참석/불참으로 확정된 내 행(null이면 최초 투표 → create) */
  myCommittedRow: MatchAttendanceRow | null;
  /** true면 참석/불참 클릭 시 updateMatchAttendance */
  wantsRevote: boolean;
  /** 재투표(update) 성공 후 단일 버튼 UI로 복귀 */
  onRevoteComplete: () => void;
};

/**
 * SRP: 참석·불참 제출(create / update) 및 findMatchAttendance 캐시 갱신만 담당.
 * 최초 투표: createMatchAttendance, 다시 투표하기 이후: updateMatchAttendance.
 */
export function useAttendanceVoteSubmitActions(
  match: MatchNode | null,
  createdTeamId: number,
  userId: number | null,
  attendanceContext: AttendanceVoteSubmitContext,
) {
  const environment = useRelayEnvironment();
  const { executeMutation: executeCreate, isInFlight: isCreateInFlight } =
    useCreateMatchAttendanceMutation();
  const { executeMutation: executeUpdate, isInFlight: isUpdateInFlight } =
    useUpdateMatchAttendanceMutation();
  const [pendingChoice, setPendingChoice] = useState<AttendanceChoice | null>(
    null,
  );

  const { myCommittedRow, wantsRevote, onRevoteComplete } = attendanceContext;

  const isInFlight = isCreateInFlight || isUpdateInFlight;

  const refetchAttendance = (matchId: number) => {
    void observableToPromise(
      fetchQuery(
        environment,
        FindMatchAttendanceQuery,
        { matchId, teamId: createdTeamId },
        { fetchPolicy: "network-only" },
      ),
    ).catch(() => {});
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

    const shouldCreate = myCommittedRow == null;
    const shouldUpdate = myCommittedRow != null && wantsRevote;

    if (!shouldCreate && !shouldUpdate) {
      return;
    }

    const successMessage =
      attendanceStatus === "ATTEND"
        ? "참석으로 투표되었습니다."
        : "불참으로 투표되었습니다.";

    setPendingChoice(attendanceStatus);

    const onError = (err: Error) => {
      setPendingChoice(null);
      toast.error(
        getGraphQLErrorMessage(err, "투표 처리 중 오류가 발생했습니다."),
      );
    };

    if (shouldCreate) {
      executeCreate({
        variables: {
          input: {
            matchId,
            teamId: createdTeamId,
            userId,
            attendanceStatus,
          },
        },
        onCompleted: (response: CreateMatchAttendanceMutationType["response"]) => {
          setPendingChoice(null);
          if (response.createMatchAttendance == null) return;
          toast.success(successMessage);
          refetchAttendance(matchId);
        },
        onError,
      });
      return;
    }

    const recordId = parseMatchIdForApi(myCommittedRow.id);
    if (recordId == null) {
      setPendingChoice(null);
      toast.error("투표 정보를 확인할 수 없습니다.");
      return;
    }

    executeUpdate({
      variables: {
        input: {
          id: recordId,
          teamId: createdTeamId,
          attendanceStatus,
        },
      },
      onCompleted: (response: UpdateMatchAttendanceMutationType["response"]) => {
        setPendingChoice(null);
        if (response.updateMatchAttendance == null) return;
        toast.success(successMessage);
        onRevoteComplete();
        refetchAttendance(matchId);
      },
      onError,
    });
  };

  const handleAttend = () => submitVote("ATTEND");
  const handleAbsent = () => submitVote("ABSENT");

  return {
    handleAttend,
    handleAbsent,
    isInFlight,
    pendingVoteChoice: pendingChoice,
  };
}
