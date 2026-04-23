import { graphql, useMutation } from "react-relay";
import type {
  CreateBestElevenInput,
  useCreateBestElevenMutation as MutationType,
} from "../../../__generated__/useCreateBestElevenMutation.graphql";

const createBestElevenMutation = graphql`
  mutation useCreateBestElevenMutation($input: CreateBestElevenInput!) {
    createBestEleven(input: $input) {
      id
      tactics
      teamId
      userId
    }
  }
`;

/** GraphQL `CreateBestElevenInput`과 동일 */
export type CreateBestElevenMutationInput = CreateBestElevenInput;

export function useCreateBestElevenMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(createBestElevenMutation);

  const executeMutation = (input: CreateBestElevenMutationInput) => {
    return new Promise<MutationType["response"]>((resolve, reject) => {
      commit({
        variables: { input },
        updater: (store) => {
          const payload = store.getRootField("createBestEleven");
          if (!payload) return;

          const root = store.getRoot();
          const teamId = input.teamId;
          const list = root.getLinkedRecords("findBestEleven", { teamId });
          
          if (list) {
            // 현재 유저의 기존 레코드를 목록에서 제거하고 새 레코드를 추가
            const userId = payload.getValue("userId");
            const newList = list.filter(item => 
              item != null && String(item.getValue("userId")) !== String(userId)
            );
            root.setLinkedRecords([...newList, payload], "findBestEleven", { teamId });
          }
        },
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
