import type { Player, PlayerStats } from "../_types/player";
import type { findManyTeamMemberQueryQuery } from "@/__generated__/findManyTeamMemberQueryQuery.graphql";
import { relayPositionToAppPosition } from "@/lib/relay/relayPositionToAppPosition";
import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";

/** findManyTeamMember 쿼리 멤버 한 건 타입 */
type QueryMember =
  findManyTeamMemberQueryQuery["response"]["findManyTeamMember"]["members"][number];

/**
 * 쿼리 결과 멤버를 테이블용 Player로 변환합니다.
 * `image`는 원본 URL, `imageFallbackUrl`은 로드 실패·무효 시용 플레이스홀더입니다.
 */
export function mapTeamMemberToPlayer(member: QueryMember): Player {
  const raw = getTeamMemberProfileImageRawUrl(member);
  const overall = member.overall;
  const ovr = overall?.ovr ?? 0;
  const appearances = overall?.appearances ?? 0;
  const goals = overall?.goals ?? 0;
  const assists = overall?.assists ?? 0;
  const keyPasses = overall?.keyPasses ?? 0;
  const attackPoints = overall?.attackPoints ?? 0;
  const cleanSheets = overall?.cleanSheets ?? 0;
  const mom3 = overall?.mom3 ?? 0;
  // 쿼리/코드생성 반영 후 overall.mom8 타입 보장 (스키마 OverallModel에 mom8 존재)
  const mom8 = (overall as { mom8?: number } | null)?.mom8 ?? 0;
  const winRate = overall?.winRate ?? 0;

  // OverallModel 숫자 필드와 PlayerStats 매핑 일치 유지
  const stats: PlayerStats = {
    출장: appearances,
    오버롤: ovr,
    골: goals,
    어시: assists,
    기점: keyPasses,
    클린시트: cleanSheets,
    주발: "B",
    승률: `${winRate}%`,
    득점: goals,
    도움: assists,
    공격P: attackPoints,
    MOM3: mom3,
    MOM8: mom8,
  };

  return {
    id: member.id,
    name: member.user?.name ?? "",
    team: "",
    value: 0,
    image: raw || undefined,
    imageFallbackUrl: getTeamMemberProfileImageFallbackUrl(member),
    position: relayPositionToAppPosition(member.preferredPosition),
    backNumber: member.preferredNumber ?? 0,
    ovr,
    stats,
  };
}

/**
 * findManyTeamMember 쿼리 결과 members 배열을 Player[]로 변환합니다.
 */
export function mapTeamMembersToPlayers(
  members: ReadonlyArray<QueryMember>,
): Player[] {
  return members.map(mapTeamMemberToPlayer);
}
