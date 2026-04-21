"use client";

import { graphql, useLazyLoadQuery } from "react-relay";
import type { useFindTeamMemberQueryQuery as QueryType } from "@/__generated__/useFindTeamMemberQueryQuery.graphql";

const FindTeamMemberForGameQuery = graphql`
  query useFindTeamMemberQueryQuery {
    findTeamMember {
      __typename
      id
      teamId
    }
  }
`;

/**
 * 현재 로그인 유저의 팀 멤버십 목록을 조회합니다.
 * createdTeamId 결정 시 첫 번째 팀의 teamId를 사용할 수 있습니다.
 * Relay useLazyLoadQuery는 skip 미지원이므로, 로그인 확정 컴포넌트에서만 호출하세요.
 */
export function useFindTeamMemberForGame() {
  const data = useLazyLoadQuery<QueryType>(
    FindTeamMemberForGameQuery,
    {},
    { fetchPolicy: "store-or-network" },
  );

  const members = data?.findTeamMember ?? [];
  const createdTeamId = members.length > 0 ? members[0].teamId : null;

  return { members, createdTeamId };
}
