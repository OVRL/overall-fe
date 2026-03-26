import { graphql, useMutation } from "react-relay";
import type { useDeleteMatchMutation as MutationType } from "../../../__generated__/useDeleteMatchMutation.graphql";

const deleteMatchMutation = graphql`
  mutation useDeleteMatchMutation($id: Int!) {
    deleteMatch(id: $id)
  }
`;

export const useDeleteMatchMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(deleteMatchMutation);

  const executeMutation = (id: number) => {
    return new Promise((resolve, reject) => {
      commit({
        variables: { id },
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
