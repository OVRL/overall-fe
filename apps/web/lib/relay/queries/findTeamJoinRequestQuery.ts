import { graphql } from "react-relay";

export const FindTeamJoinRequestQuery = graphql`
  query findTeamJoinRequestQuery($teamId: Int!, $status: JoinRequestStatus) {
    findTeamJoinRequest(teamId: $teamId, status: $status) {
      id
      userId
      teamId
      status
      message
      rejectedReason
      createdAt
      reviewedAt
    }
  }
`;
