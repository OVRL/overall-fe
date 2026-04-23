import { graphql } from "react-relay";

export const FindMatchMomQuery = graphql`
  query findMatchMomQuery($matchId: Int!, $teamId: Int!) {
    findMatchMom(matchId: $matchId, teamId: $teamId) {
      candidateUserId
      candidateUser {
        id
        name
        profileImage
        mainPosition
        preferredNumber
      }
      candidateMercenaryId
      candidateMercenary {
        id
        name
      }
      voteCount
    }
  }
`;
