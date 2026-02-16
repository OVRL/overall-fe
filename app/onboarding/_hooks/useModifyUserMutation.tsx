import { graphql, useMutation } from "react-relay";
import { useModifyUserMutation as MutationType } from "@/__generated__/useModifyUserMutation.graphql";

export const useModifyUserMutation = () => {
  return useMutation<MutationType>(graphql`
    mutation useModifyUserMutation(
      $input: UpdateUserInput!
      $profileImage: Upload!
    ) {
      modifyUser(input: $input, profileImage: $profileImage) {
        id
        email
        name
        gender
        foot
        activityArea
        preferredNumber
        favoritePlayer
      }
    }
  `);
};
