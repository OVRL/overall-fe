import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useUpdateMatchMutation as MutationType } from "@/__generated__/useUpdateMatchMutation.graphql";

const updateMatchMutation = graphql`
  mutation useUpdateMatchMutation($input: UpdateMatchInput!) {
    updateMatch(input: $input) {
      id
      description
      matchDate
      opponentTeam {
        name
      }
    }
  }
`;

export function useUpdateMatchMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(updateMatchMutation);

  const executeMutation = (config: Omit<UseMutationConfig<MutationType>, "mutation">) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
}
