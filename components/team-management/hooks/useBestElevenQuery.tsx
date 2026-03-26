import { graphql, useLazyLoadQuery } from "react-relay";
import type { useBestElevenQuery as QueryType } from "../../../__generated__/useBestElevenQuery.graphql";

const bestElevenQuery = graphql`
  query useBestElevenQuery($teamId: Int!, $matchId: Int!) {
    findManyTeamMember(teamId: $teamId, limit: 200) {
      members {
        id
        backNumber
        position
        role
        user {
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
    findMatchFormation(matchId: $matchId, teamId: $teamId) {
      id
      quarter
      tactics
    }
  }
`;

export const BEST_ELEVEN_MATCH_ID = -1; // 팀 대표 베스트 11용 특수 ID

export const useBestElevenQuery = (teamId: number) => {
  return useLazyLoadQuery<QueryType>(
    bestElevenQuery,
    { teamId, matchId: BEST_ELEVEN_MATCH_ID },
    { fetchPolicy: "store-or-network" },
  );
};
