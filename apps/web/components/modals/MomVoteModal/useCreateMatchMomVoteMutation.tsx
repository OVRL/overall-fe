import { graphql, useMutation, type UseMutationConfig } from "react-relay";
import type { useCreateMatchMomVoteMutation as MutationType } from "@/__generated__/useCreateMatchMomVoteMutation.graphql";

const mutation = graphql`
  mutation useCreateMatchMomVoteMutation($input: CreateMatchMomVoteInput!) {
    createMatchMom(input: $input) {
      id
      matchId
      teamId
      voterUserId
      candidateUserId
      candidateMercenaryId
    }
  }
`;

export function useCreateMatchMomVoteMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(mutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => commit(config);

  return { executeMutation, isInFlight };
}
