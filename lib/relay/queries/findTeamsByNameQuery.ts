import { graphql } from "react-relay";

/**
 * 팀 이름으로 검색 (상대팀 검색 모달용).
 * id, name, emblem 필드만 요청.
 */
export const FindTeamsByNameQuery = graphql`
  query findTeamsByNameQuery($name: String!) {
    findTeamsByName(name: $name) {
      items {
        __typename
        id
        name
        emblem
      }
      hasNextPage
      totalCount
    }
  }
`;
