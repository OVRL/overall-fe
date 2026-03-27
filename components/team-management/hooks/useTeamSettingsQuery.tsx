import { graphql, useLazyLoadQuery } from "react-relay";
import type { useTeamSettingsQuery as QueryType } from "../../../__generated__/useTeamSettingsQuery.graphql";

const teamSettingsQuery = graphql`
  query useTeamSettingsQuery($teamId: Int!) {
    findManyTeamMember(teamId: $teamId, limit: 100) {
      members {
        id
        backNumber
        position
        role
        joinedAt
        profileImg
        user {
          id
          name
          profileImage
          birthDate
        }
        team {
          id
          name
          emblem
          activityArea
          description
          historyStartDate
          homeUniform
          awayUniform
          region {
            code
            name
          }
        }
      }
      totalCount
    }
  }
`;

export const useTeamSettingsQuery = (teamId: number) => {
  return useLazyLoadQuery<QueryType>(
    teamSettingsQuery,
    { teamId },
    { fetchPolicy: "store-or-network" },
  );
};
