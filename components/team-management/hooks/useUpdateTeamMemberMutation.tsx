import { graphql, useMutation } from "react-relay";
import type { useUpdateTeamMemberMutation as MutationType } from "../../../__generated__/useUpdateTeamMemberMutation.graphql";

const updateTeamMemberMutation = graphql`
  mutation useUpdateTeamMemberMutation($input: UpdateTeamMemberInput!) {
    updateTeamMember(input: $input) {
      id
      role
      backNumber
      position
    }
  }
`;

export const useUpdateTeamMemberMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(updateTeamMemberMutation);

  const executeMutation = (input: { id: number; role?: any; backNumber?: number; position?: any }) => {
    return new Promise((resolve, reject) => {
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
};
