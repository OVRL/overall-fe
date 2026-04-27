import { useCallback } from "react";
import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useCreateInviteCodeMutation as MutationType } from "@/__generated__/useCreateInviteCodeMutation.graphql";

const createInviteCodeMutation = graphql`
  mutation useCreateInviteCodeMutation($teamId: Float!) {
    createInviteCode(teamId: $teamId) {
      code
      expiredAt
    }
  }
`;

export function useCreateInviteCodeMutation() {
  const [commit, isInFlight] =
    useMutation<MutationType>(createInviteCodeMutation);

  /** 매 렌더마다 새 참조면 이 훅을 쓰는 useEffect가 무한 실행될 수 있음 */
  const executeMutation = useCallback(
    (config: Omit<UseMutationConfig<MutationType>, "mutation">) =>
      commit(config),
    [commit],
  );

  return { executeMutation, isInFlight };
}
