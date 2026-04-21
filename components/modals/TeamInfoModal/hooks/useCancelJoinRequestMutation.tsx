import { graphql, useMutation, type UseMutationConfig } from "react-relay";
import type { useCancelJoinRequestMutation as MutationType } from "@/__generated__/useCancelJoinRequestMutation.graphql";

const cancelJoinRequestMutation = graphql`
  mutation useCancelJoinRequestMutation($joinRequestId: Int!) {
    cancelJoinRequest(joinRequestId: $joinRequestId)
  }
`;

/** PENDING 가입 신청 취소(cancelJoinRequest) */
export function useCancelJoinRequestMutation() {
  const [commit, isInFlight] =
    useMutation<MutationType>(cancelJoinRequestMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => commit(config);

  return { executeMutation, isInFlight };
}
