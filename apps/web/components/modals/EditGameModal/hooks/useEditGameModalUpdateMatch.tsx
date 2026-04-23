import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useEditGameModalUpdateMatchMutation as MutationType } from "@/__generated__/useEditGameModalUpdateMatchMutation.graphql";

const updateMatchMutation = graphql`
  mutation useEditGameModalUpdateMatchMutation($input: UpdateMatchInput!) {
    updateMatch(input: $input) {
      id
      matchDate
      matchType
      startTime
      endTime
      voteDeadline
      createdTeamId
      quarterCount
      quarterDuration
      description
      opponentTeamId
      uniformType
      venue {
        address
        latitude
        longitude
      }
    }
  }
`;

export function useUpdateMatchMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(updateMatchMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
}
