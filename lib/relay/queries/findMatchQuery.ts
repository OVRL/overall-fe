import { graphql } from "react-relay";

/**
 * SSR/클라이언트 공용: 팀별 경기 목록 조회.
 * Layout SSR(선택 팀 기준) 및 홈 다가오는 경기에서 동일 쿼리 사용.
 */
export const FindMatchQuery = graphql`
  query findMatchQuery($createdTeamId: Int!) {
    findMatch(createdTeamId: $createdTeamId) {
      __typename
      id
      matchDate
      startTime
      matchType
      description
      uniformType
      createdTeam {
        __typename
        id
        name
        emblem
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
