import { graphql } from "react-relay";

/**
 * SSR/클라이언트 공용: 유저의 팀 멤버십 목록(팀 정보 포함).
 * Layout SSR 로더 및 헤더 팀 셀렉터에서 동일 쿼리 사용.
 */
export const FindTeamMemberQuery = graphql`
  query findTeamMemberQuery($userId: Int!) {
    findTeamMember(userId: $userId) {
      __typename
      id
      teamId
      team {
        __typename
        id
        name
        emblem
      }
    }
  }
`;
