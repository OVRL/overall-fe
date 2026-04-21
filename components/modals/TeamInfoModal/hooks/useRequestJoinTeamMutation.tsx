import { graphql, useMutation, type UseMutationConfig } from "react-relay";
import type { useRequestJoinTeamMutation as MutationType } from "@/__generated__/useRequestJoinTeamMutation.graphql";

const requestJoinTeamMutation = graphql`
  mutation useRequestJoinTeamMutation($input: RequestJoinTeamInput!) {
    requestJoinTeam(input: $input) {
      id
      status
      teamId
      inviteCodeId
      createdAt
    }
  }
`;

/**
 * 팀 초대 코드로 가입 신청(requestJoinTeam).
 * 응답의 JoinRequest id는 취소 뮤테이션에 사용합니다.
 */
export function useRequestJoinTeamMutation() {
  const [commit, isInFlight] =
    useMutation<MutationType>(requestJoinTeamMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => commit(config);

  return { executeMutation, isInFlight };
}
