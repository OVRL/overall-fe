import type { momVoteModalQuery } from "@/__generated__/momVoteModalQuery.graphql";

export type MyMatchMomRow =
  momVoteModalQuery["response"]["findMyMatchMom"][number];

/**
 * MOM 투표 행을 생성 시각 순으로 정렬해 TOP1→3 순서를 맞춥니다.
 */
export function sortMyMatchMomVotes(rows: readonly MyMatchMomRow[]): MyMatchMomRow[] {
  return [...rows].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

/** 서버 투표 1행 → 드롭다운 value 문자열 */
export function matchMomRowToPickValue(row: MyMatchMomRow): string | undefined {
  if (row.candidateMercenaryId != null) {
    return `m:${row.candidateMercenaryId}`;
  }
  if (row.candidateUserId != null) {
    return String(row.candidateUserId);
  }
  return undefined;
}

/** 투표 행에서 라벨 후보 (옵션 목록에 없을 때 표시용) */
export function pickLabelFromRow(row: MyMatchMomRow): string {
  const mercName = row.candidateMercenary?.name?.trim();
  if (mercName) return mercName;
  const userName = row.candidateUser?.name?.trim();
  if (userName) return userName;
  return "후보";
}

/**
 * 내 투표 3행을 TOP1~3 value로 변환합니다. 행이 3개 미만이면 빈 슬롯은 undefined.
 */
export function myVotesToTopPicks(
  sortedVotes: readonly MyMatchMomRow[],
): [string | undefined, string | undefined, string | undefined] {
  const v0 = sortedVotes[0];
  const v1 = sortedVotes[1];
  const v2 = sortedVotes[2];
  return [
    v0 ? matchMomRowToPickValue(v0) : undefined,
    v1 ? matchMomRowToPickValue(v1) : undefined,
    v2 ? matchMomRowToPickValue(v2) : undefined,
  ];
}
