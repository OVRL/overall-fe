import { graphql, useMutation, type UseMutationConfig } from "react-relay";
import type { useUpdateMatchMomVoteMutation as MutationType } from "@/__generated__/useUpdateMatchMomVoteMutation.graphql";

const mutation = graphql`
  mutation useUpdateMatchMomVoteMutation($input: UpdateMatchMomVoteInput!) {
    updateMatchMomVote(input: $input) {
      id
      matchId
      teamId
      voterUserId
      candidateUserId
      candidateMercenaryId
    }
  }
`;

export function useUpdateMatchMomVoteMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(mutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => commit(config);

  return { executeMutation, isInFlight };
}
