import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useCreateMatchMutation as MutationType } from "@/__generated__/useCreateMatchMutation.graphql";

const createMatchMutation = graphql`
  mutation useCreateMatchMutation($input: CreateMatchInput!) {
    createMatch(input: $input) {
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

export function useCreateMatchMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(createMatchMutation);

  const executeMutation = (config: Omit<UseMutationConfig<MutationType>, "mutation">) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
}
