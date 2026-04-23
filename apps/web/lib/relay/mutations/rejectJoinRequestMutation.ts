import { graphql } from "react-relay";

export const RejectJoinRequestMutation = graphql`
  mutation rejectJoinRequestMutation($joinRequestId: Int!, $rejectedReason: String) {
    rejectJoinRequest(joinRequestId: $joinRequestId, rejectedReason: $rejectedReason) {
      id
      status
      rejectedReason
      reviewedAt
    }
  }
`;
