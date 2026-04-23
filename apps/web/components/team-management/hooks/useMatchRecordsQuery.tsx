import { graphql, useLazyLoadQuery } from "react-relay";
import type { useMatchRecordsQuery as QueryType } from "../../../__generated__/useMatchRecordsQuery.graphql";

const matchRecordsQuery = graphql`
  query useMatchRecordsQuery($teamId: Int!) {
    findMatch(createdTeamId: $teamId) {
      id
      matchDate
      matchType
      quarterCount
      quarterDuration
      teamName
      description
      opponentTeam {
        name
      }
      venue {
        address
      }
    }
  }
`;

export const useMatchRecordsQuery = (teamId: number) => {
  return useLazyLoadQuery<QueryType>(
    matchRecordsQuery,
    { teamId },
    { fetchPolicy: "store-or-network" }
  );
};
