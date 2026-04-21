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
        updater: (store) => {
          const root = store.getRoot();
          // 스토어 내 모든 findBestEleven 관련 필드에서 해당 ID를 제거
          // (간편하게 모든 인스턴스를 찾거나, teamId를 알 수 없으므로 광범위하게 처리)
          const deletedRecord = store.get(`BestElevenModel:${id}`);
          if (deletedRecord) {
            store.delete(deletedRecord.getDataID());
          }
        },
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
