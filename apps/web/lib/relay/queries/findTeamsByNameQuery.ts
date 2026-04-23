import { graphql } from "react-relay";

/**
 * 팀 이름으로 단일 팀 조회 (상대팀 검색 모달용). 스키마의 findTeam(name) 사용.
 */
export const FindTeamsByNameQuery = graphql`
  query findTeamsByNameQuery($name: String!) {
    findTeam(name: $name) {
      __typename
      id
      name
      emblem
    }
  }
`;
