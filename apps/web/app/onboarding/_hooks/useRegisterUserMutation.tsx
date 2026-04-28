import { graphql, useMutation } from "react-relay";
import type { useRegisterUserMutation as MutationType } from "@/__generated__/useRegisterUserMutation.graphql";

export function useRegisterUserMutation() {
  return useMutation<MutationType>(graphql`
    mutation useRegisterUserMutation($input: RegisterUserInput!, $profileImage: Upload!) {
      registerUser(input: $input, profileImage: $profileImage) {
        id
        email
        tokens {
          id
          accessToken
          refreshToken
        }
      }
    }
  `);
}

