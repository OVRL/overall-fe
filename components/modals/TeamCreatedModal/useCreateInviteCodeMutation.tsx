import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useCreateInviteCodeMutation as MutationType } from "@/__generated__/useCreateInviteCodeMutation.graphql";

const createInviteCodeMutation = graphql`
  mutation useCreateInviteCodeMutation($teamId: Float!) {
    createInviteCode(teamId: $teamId) {
      code
    }
  }
`;

export function useCreateInviteCodeMutation() {
  const [commit, isInFlight] =
    useMutation<MutationType>(createInviteCodeMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
}
