import { graphql, useMutation } from "react-relay";
import type { useSocialLoginMutation as MutationType } from "@/__generated__/useSocialLoginMutation.graphql";

export function useSocialLoginMutation() {
  return useMutation<MutationType>(graphql`
    mutation useSocialLoginMutation($input: SocialLoginInput!) {
      socialLogin(input: $input) {
        id
        email
        accessToken
        refreshToken
      }
    }
  `);
}
