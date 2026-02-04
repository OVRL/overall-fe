import { graphql, useMutation } from "react-relay";
import { useModifyUserMutation as MutationType } from "@/__generated__/useModifyUserMutation.graphql";

export const useModifyUserMutation = () => {
  return useMutation<MutationType>(graphql`
    mutation useModifyUserMutation($input: UpdateUserInput!) {
      modifyUser(input: $input) {
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
