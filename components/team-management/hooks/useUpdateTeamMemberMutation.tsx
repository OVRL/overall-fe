import { graphql, useMutation } from "react-relay";
import type {
  useUpdateTeamMemberMutation as MutationType,
  UpdateTeamMemberInput,
} from "../../../__generated__/useUpdateTeamMemberMutation.graphql";

const updateTeamMemberMutation = graphql`
  mutation useUpdateTeamMemberMutation($input: UpdateTeamMemberInput!) {
    updateTeamMember(input: $input) {
      id
      role
      foot
      preferredNumber
      preferredPosition
    }
  }
`;

export const useUpdateTeamMemberMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(updateTeamMemberMutation);

  const executeMutation = (input: UpdateTeamMemberInput) => {
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
