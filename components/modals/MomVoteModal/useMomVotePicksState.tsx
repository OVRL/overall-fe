import { useCallback, useEffect, useMemo, useState } from "react";
import type { MyMatchMomRow } from "./momVoteMyVotesMapping";
import {
  myVotesToTopPicks,
  sortMyMatchMomVotes,
} from "./momVoteMyVotesMapping";

type UseMomVotePicksStateArgs = {
  myVotes: readonly MyMatchMomRow[];
  /** 뮤테이션 성공 후 쿼리 갱신 시 로컬 상태를 서버와 다시 맞출 때 증가 */
  refreshKey: number;
};

/**
 * MOM 투표 드롭다운 값·재투표 편집 모드 상태.
 * 서버 `findMyMatchMom` 스냅샷이 바뀌면(동일 데이터면 키 문자열로 안정화) 초기화합니다.
 */
export function useMomVotePicksState({
  myVotes,
  refreshKey,
}: UseMomVotePicksStateArgs) {
  const serverVotesFingerprint = useMemo(
    () =>
      [...myVotes]
        .sort((a, b) => a.id - b.id)
        .map(
          (r) =>
            `${r.id}:${r.candidateUserId ?? ""}:${r.candidateMercenaryId ?? ""}`,
        )
        .join("|"),
    [myVotes],
  );

  const hasVoted = myVotes.length > 0;

  const [top1, setTop1] = useState<string | undefined>();
  const [top2, setTop2] = useState<string | undefined>();
  const [top3, setTop3] = useState<string | undefined>();
  const [isRevoteEditing, setIsRevoteEditing] = useState(false);

  useEffect(() => {
    const sorted = sortMyMatchMomVotes(myVotes);
    const [a, b, c] = myVotesToTopPicks(sorted);
    setTop1(a);
    setTop2(b);
    setTop3(c);
    setIsRevoteEditing(false);
  }, [serverVotesFingerprint, refreshKey]);

  const picksDisabled = hasVoted && !isRevoteEditing;

  const beginRevoteEditing = useCallback(() => {
    setIsRevoteEditing(true);
  }, []);

  return {
    hasVoted,
    top1,
    top2,
    top3,
    setTop1,
    setTop2,
    setTop3,
    picksDisabled,
    isRevoteEditing,
    beginRevoteEditing,
  };
}
