import { graphql } from "react-relay";

/**
 * SSR/클라이언트 공용: 팀별 경기 목록 조회.
 * Layout SSR(선택 팀 기준) 및 홈 다가오는 경기에서 동일 쿼리 사용.
 *
 * 종료 스코어: `MatchModel`에 필드가 생기면 본 fragment에 선택 필드를 추가하고
 * `mapFindMatchNodesToMatchForUpcomingDisplay`에서 `homeScore` / `awayScore`로 매핑합니다.
 */
export const FindMatchQuery = graphql`
  query findMatchQuery($createdTeamId: Int!) {
    findMatch(createdTeamId: $createdTeamId) {
      __typename
      id
      matchDate
      startTime
      endTime
      voteDeadline
      isFormationDraft
      matchType
      quarterCount
      quarterDuration
      description
      uniformType
      teamName
      createdTeam {
        __typename
        id
        name
        emblem
        homeUniform
        awayUniform
      }
      opponentTeam {
        __typename
        id
        name
        emblem
      }
      venue {
        address
        latitude
        longitude
      }
    }
  }
`;
