import { graphql, useMutation } from "react-relay";
import type { useUpdateMatchFormationMutation as MutationType } from "../../../__generated__/useUpdateMatchFormationMutation.graphql";

const updateMatchFormationMutation = graphql`
  mutation useUpdateMatchFormationMutation($input: UpdateMatchFormationInput!) {
    updateMatchFormation(input: $input) {
      id
      tactics
    }
  }
`;

export const useUpdateMatchFormationMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(updateMatchFormationMutation);

  const executeMutation = (id: number, userId: number, tactics: unknown) => {
    return new Promise((resolve, reject) => {
      commit({
        variables: {
          input: {
            id,
            userId,
            tactics,
          },
        },
        onCompleted: (response, errors) => {
          if (errors) reject(errors);
          else resolve(response);
        },
        onError: (err) => reject(err),
      });
    });
  };

  return { executeMutation, isInFlight };
};
