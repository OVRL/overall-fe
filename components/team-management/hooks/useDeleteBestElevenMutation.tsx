import { graphql, useMutation } from "react-relay";

const deleteBestElevenMutation = graphql`
  mutation useDeleteBestElevenMutation($id: Int!) {
    deleteBestEleven(id: $id)
  }
`;

type DeleteBestElevenMutationType = {
  response: { readonly deleteBestEleven: boolean };
  variables: { id: number };
};

export function useDeleteBestElevenMutation() {
  const [commit, isInFlight] = useMutation<DeleteBestElevenMutationType>(
    deleteBestElevenMutation
  );

  const executeMutation = (id: number) => {
    return new Promise<boolean>((resolve, reject) => {
      commit({
        variables: { id },
        onCompleted: (response, errors) => {
          if (errors) reject(errors);
          else resolve(response.deleteBestEleven);
        },
        onError: (err) => reject(err),
      });
    });
  };

  return { executeMutation, isInFlight };
}
