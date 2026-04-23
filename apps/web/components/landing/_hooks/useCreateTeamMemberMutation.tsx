"use client";

import { graphql, useMutation, UseMutationConfig } from "react-relay";
import { useCreateTeamMemberMutation as MutationType } from "@/__generated__/useCreateTeamMemberMutation.graphql";

const createTeamMemberMutation = graphql`
  mutation useCreateTeamMemberMutation($input: JoinTeamInput!) {
    createTeamMember(input: $input) {
      id
      teamId
      userId
      role
      joinedAt
    }
  }
`;

/**
 * 팀 초대 코드로 팀 가입 시 사용하는 createTeamMember 뮤테이션 훅.
 * JoinTeamInput(email, inviteCode)으로 팀 멤버로 등록합니다.
 */
export const useCreateTeamMemberMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(createTeamMemberMutation);

  const executeMutation = (config: Omit<UseMutationConfig<MutationType>, "mutation">) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
};
