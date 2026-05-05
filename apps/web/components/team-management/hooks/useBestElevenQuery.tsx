import { graphql, useLazyLoadQuery } from "react-relay";
import type { useBestElevenQuery as QueryType } from "../../../__generated__/useBestElevenQuery.graphql";

export const useBestElevenFetchQuery = graphql`
  query useBestElevenQuery($teamId: Int!) {
    findManyTeamMember(teamId: $teamId, limit: 200) {
      members {
        __typename
        id
        foot
        preferredNumber
        preferredPosition
        role
        profileImg
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
      tactics
      teamId
      userId
    }
    findMatch(createdTeamId: $teamId) {
      id
      description
      matchDate
    }
  }
`;

export const useBestElevenQuery = (teamId: number) => {
  return useLazyLoadQuery<QueryType>(
    useBestElevenFetchQuery,
    { teamId },
    { fetchPolicy: "store-or-network" },
  );
};
