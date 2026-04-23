import { graphql, useMutation } from "react-relay";
import type {
  CreateMatchMomVoteInput,
  useCreateMatchMomMutation as MutationType,
} from "@/__generated__/useCreateMatchMomMutation.graphql";

const createMatchMomMutation = graphql`
  mutation useCreateMatchMomMutation($input: CreateMatchMomVoteInput!) {
    createMatchMom(input: $input) {
      id
      matchId
      teamId
      candidateUserId
      voterUserId
    }
  }
`;

export function useCreateMatchMomMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(createMatchMomMutation);

  const executeMutation = (input: CreateMatchMomVoteInput) => {
    return new Promise<MutationType["response"]>((resolve, reject) => {
      commit({
        variables: { input },
        onCompleted: (response, errors) => {
          if (errors) reject(errors);
          else resolve(response);
        },
        onError: (err) => reject(err),
      });
    });
  };

  return { executeMutation, isInFlight };
}
