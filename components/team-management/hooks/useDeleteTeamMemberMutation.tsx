import { graphql, useMutation } from "react-relay";
import type { useDeleteTeamMemberMutation as MutationType } from "../../../__generated__/useDeleteTeamMemberMutation.graphql";

const deleteTeamMemberMutation = graphql`
  mutation useDeleteTeamMemberMutation($id: Int!) {
    deleteTeamMember(id: $id)
  }
`;

export const useDeleteTeamMemberMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(deleteTeamMemberMutation);

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
