import { toast } from "@/lib/toast";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

/** SRP: 참석 투표 모달의 경기장 주소 복사만 담당 */
export function useAttendanceVoteCopyAddress(match: MatchNode | null) {
  const handleCopyAddress = () => {
    if (!match?.venue?.address) return;
    navigator.clipboard.writeText(match.venue.address).then(
      () => toast.success("주소가 복사되었습니다."),
      () => toast.error("주소 복사에 실패했습니다."),
    );
  };

  return { handleCopyAddress };
}
