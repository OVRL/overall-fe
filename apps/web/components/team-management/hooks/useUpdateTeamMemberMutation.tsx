import { graphql, useMutation } from "react-relay";
import type {
  useUpdateTeamMemberMutation as MutationType,
  UpdateTeamMemberInput,
} from "../../../__generated__/useUpdateTeamMemberMutation.graphql";

const updateTeamMemberMutation = graphql`
  mutation useUpdateTeamMemberMutation(
    $input: UpdateTeamMemberInput!
    $profileImage: Upload
  ) {
    updateTeamMember(input: $input, profileImage: $profileImage) {
      id
      role
      foot
      preferredNumber
      preferredPosition
      profileImg
    }
  }
`;

export const useUpdateTeamMemberMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(updateTeamMemberMutation);

  const executeMutation = (
    input: UpdateTeamMemberInput,
    profileImage?: File | null,
  ) => {
    return new Promise((resolve, reject) => {
      commit({
        variables: {
          input,
          profileImage: null,
        },
        uploadables: profileImage ? { profileImage } : undefined,
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
