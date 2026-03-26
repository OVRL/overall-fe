import { graphql, useLazyLoadQuery } from "react-relay";
import type { usePlayerManagementQuery as QueryType } from "../../../__generated__/usePlayerManagementQuery.graphql";

const playerManagementQuery = graphql`
  query usePlayerManagementQuery($teamId: Int!) {
    findManyTeamMember(teamId: $teamId, limit: 200) {
      members {
        id
        backNumber
        position
        user {
          name
          profileImage
        }
        overall {
          appearances
          goals
          assists
          keyPasses
          cleanSheets
          winRate
          attackPoints
        }
      }
      totalCount
    }
  }
`;

export const usePlayerManagementQuery = (teamId: number) => {
  return useLazyLoadQuery<QueryType>(
    playerManagementQuery,
    { teamId },
    { fetchPolicy: "store-or-network" }
  );
};
