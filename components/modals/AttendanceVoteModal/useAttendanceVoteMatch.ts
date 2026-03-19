import { useLazyLoadQuery } from "react-relay";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import { pickSoonestMatch } from "@/utils/match/pickSoonestMatch";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

/**
 * SRP: "어떤 경기를 보여줄지"에 대한 변경은 이 훅만 수정하면 됨.
 * findMatch 쿼리 실행 + 다가오는 경기 1건 선택.
 */
export function useAttendanceVoteMatch(createdTeamId: number): {
  match: MatchNode | null;
} {
  const data = useLazyLoadQuery<findMatchQuery>(
    FindMatchQuery,
    { createdTeamId },
    { fetchPolicy: "store-or-network" },
  );

  const list = data?.findMatch ?? [];
  const forPick = list as unknown as MatchForUpcomingDisplay[];
  const soonestDisplay = pickSoonestMatch(forPick);
  const match = soonestDisplay
    ? (list.find(
        (m) =>
          m.matchDate === soonestDisplay.matchDate &&
          m.startTime === soonestDisplay.startTime,
      ) ?? null)
    : null;

  return { match };
}
