import { graphql } from "react-relay";

/**
 * 팀 목록 조회 (햄버거 메뉴 등).
 * id, name, emblem 필드만 요청.
 */
export const FindManyTeamQuery = graphql`
  query findManyTeamQuery($limit: Int!, $offset: Int!) {
    findManyTeam(limit: $limit, offset: $offset) {
      items {
        __typename
        id
        name
        emblem
      }
      totalCount
    }
  }
`;

export const FIND_MANY_TEAM_PAGE_SIZE = 10;
