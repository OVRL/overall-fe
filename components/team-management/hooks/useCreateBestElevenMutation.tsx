import { graphql, useMutation } from "react-relay";
import type {
  CreateBestElevenInput,
  useCreateBestElevenMutation as MutationType,
} from "../../../__generated__/useCreateBestElevenMutation.graphql";

const createBestElevenMutation = graphql`
  mutation useCreateBestElevenMutation($input: CreateBestElevenInput!) {
    createBestEleven(input: $input) {
      id
      position
      teamId
      userId
    }
  }
`;

/** GraphQL `CreateBestElevenInput`과 동일 — `types/position`의 `"용병"` 등 enum 밖 값은 불가 */
export type CreateBestElevenMutationInput = CreateBestElevenInput;

export function useCreateBestElevenMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(createBestElevenMutation);

  const executeMutation = (input: CreateBestElevenMutationInput) => {
    return new Promise<MutationType["response"]>((resolve, reject) => {
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
}
