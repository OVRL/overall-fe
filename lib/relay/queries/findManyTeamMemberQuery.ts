import { graphql } from "react-relay";

/**
 * 로스터 SSR/클라이언트 공용 쿼리.
 * useFindManyTeamMemberQuery 훅과 loadFindManyTeamMemberSSR에서 동일한 쿼리를 사용합니다.
 */
export const FindManyTeamMemberQuery = graphql`
  query findManyTeamMemberQueryQuery($limit: Int!, $offset: Int!) {
    findManyTeamMember(limit: $limit, offset: $offset) {
      members {
        __typename
        id
        position
        backNumber
        joinedAt
        profileImg
        user {
          __typename
          id
          name
          profileImage
          birthDate
          subPositions
        }
        overall {
          __typename
          ovr
          appearances
          goals
          assists
          keyPasses
          attackPoints
          cleanSheets
          mom3
          mom8
          winRate
        }
      }
      totalCount
    }
  }
`;

export const ROSTER_PAGE_SIZE = 200;
