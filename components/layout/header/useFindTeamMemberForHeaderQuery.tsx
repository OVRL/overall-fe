"use client";

import { graphql, useLazyLoadQuery } from "react-relay";
import type { useFindTeamMemberForHeaderQuery as QueryType } from "@/__generated__/useFindTeamMemberForHeaderQuery.graphql";

const FindTeamMemberForHeaderQuery = graphql`
  query useFindTeamMemberForHeaderQuery($userId: Int!) {
    findTeamMember(userId: $userId) {
      id
      teamId
      team {
        id
        name
        emblem
      }
    }
  }
`;

/**
 * 헤더 팀 셀렉터용: 현재 유저의 팀 멤버십 목록을 팀 정보(이름, 엠블럼)와 함께 조회합니다.
 * userId는 useUserId() 또는 쿠키에서 사용하세요.
 */
export function useFindTeamMemberForHeader(userId: number) {
  const data = useLazyLoadQuery<QueryType>(
    FindTeamMemberForHeaderQuery,
    { userId },
    { fetchPolicy: "store-or-network" },
  );

  return data?.findTeamMember ?? [];
}
