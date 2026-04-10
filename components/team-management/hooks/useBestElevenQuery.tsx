import { graphql, useLazyLoadQuery } from "react-relay";
import type { useBestElevenQuery as QueryType } from "../../../__generated__/useBestElevenQuery.graphql";

const bestElevenQuery = graphql`
  query useBestElevenQuery($teamId: Int!) {
    findManyTeamMember(teamId: $teamId, limit: 200) {
      members {
        __typename
        id
        backNumber
        position
        role
        user {
          __typename
          id
          name
          profileImage
          birthDate
        }
        overall {
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
    }
    findBestEleven(teamId: $teamId) {
      id
      position
      teamId
      userId
    }
  }
`;

export const useBestElevenQuery = (teamId: number) => {
  return useLazyLoadQuery<QueryType>(
    bestElevenQuery,
    { teamId },
    { fetchPolicy: "network-only" },
  );
};
