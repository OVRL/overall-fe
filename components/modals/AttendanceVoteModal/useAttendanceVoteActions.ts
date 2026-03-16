import { toast } from "@/lib/toast";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { useCreateMatchAttendanceMutation } from "./useCreateMatchAttendanceMutation";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

/**
 * SRP: "참석 투표 모달에서의 사용자 액션(주소 복사, 참석)"에 대한 변경은 이 훅만 수정하면 됨.
 */
export function useAttendanceVoteActions(
  match: MatchNode | null,
  createdTeamId: number,
  userId: number | null,
  hideModal: () => void,
) {
  const { executeMutation, isInFlight } = useCreateMatchAttendanceMutation();

  const handleCopyAddress = () => {
    if (!match?.venue?.address) return;
    navigator.clipboard.writeText(match.venue.address).then(
      () => toast.success("주소가 복사되었습니다."),
      () => toast.error("주소 복사에 실패했습니다."),
    );
  };

  const handleAttend = () => {
    if (!match || userId == null) {
      toast.error("참석 투표에 필요한 정보가 없습니다.");
      return;
    }
    const matchId = Number(match.id);
    if (Number.isNaN(matchId)) {
      toast.error("경기 정보를 확인할 수 없습니다.");
      return;
    }
    executeMutation({
      variables: {
        input: {
          matchId,
          teamId: createdTeamId,
          userId,
          attendanceStatus: "ATTEND",
        },
      },
      onCompleted: () => {
        toast.success("참석으로 투표되었습니다.");
        hideModal();
      },
      onError: (err) => {
        toast.error(err?.message ?? "참석 투표에 실패했습니다.");
      },
    });
  };

  return { handleCopyAddress, handleAttend, isInFlight };
}
