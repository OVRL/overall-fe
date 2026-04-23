import type { findMatchMomQuery } from "@/__generated__/findMatchMomQuery.graphql";
import type { GachaCardProps } from "@/components/ui/mom/GachaCard";

type FindMatchMomRow = NonNullable<
  findMatchMomQuery["response"]["findMatchMom"]
>[number];

/**
 * `findMatchMom` 결과를 `MomOverlay`가 요구하는 `GachaCardProps`로 변환한다.
 * - 최대 3명까지만 반환
 * - name은 항상 string 보장
 */
export function mapFindMatchMomToGachaCandidates(
  rows: ReadonlyArray<FindMatchMomRow>,
): GachaCardProps[] {
  return rows.slice(0, 3).map((r) => {
    if (r.candidateUser) {
      return {
        id: r.candidateUser.id,
        name: r.candidateUser.name ?? "알 수 없음",
        position: r.candidateUser.mainPosition ?? null,
        number: r.candidateUser.preferredNumber ?? null,
        profileImage: r.candidateUser.profileImage ?? null,
      };
    }
    return {
      id:
        r.candidateMercenary?.id ??
        r.candidateMercenaryId ??
        `merc-${r.voteCount}`,
      name: r.candidateMercenary?.name ?? "용병",
      position: "용병",
      number: null,
      profileImage: null,
    };
  });
}

