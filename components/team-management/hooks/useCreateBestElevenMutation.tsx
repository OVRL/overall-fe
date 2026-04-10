import { graphql, useMutation } from "react-relay";
import type { Position } from "@/types/position";
import type { useCreateBestElevenMutation as MutationType } from "../../../__generated__/useCreateBestElevenMutation.graphql";

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

export type CreateBestElevenMutationInput = {
  position: Position;
  teamId: number;
  userId: number;
};

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
