import { MOCK_IMAGE_SRC } from "@/lib/utils";
import type { Position } from "@/types/position";
import type { Player, PlayerStats } from "../_types/player";
import type { findManyTeamMemberQueryQuery } from "@/__generated__/findManyTeamMemberQueryQuery.graphql";

/** findManyTeamMember 쿼리 멤버 한 건 타입 */
type QueryMember =
  findManyTeamMemberQueryQuery["response"]["findManyTeamMember"]["members"][number];

/**
 * 쿼리 결과 멤버를 테이블용 Player로 변환합니다.
 * 이미지 서버 도메인 미설정 시 오류를 피하기 위해 프로필 이미지는 항상 MOCK_IMAGE_SRC를 사용합니다.
 */
export function mapTeamMemberToPlayer(member: QueryMember): Player {
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
    image: MOCK_IMAGE_SRC,
    position: (member.position ?? "MF") as Position,
    backNumber: member.backNumber ?? 0,
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
