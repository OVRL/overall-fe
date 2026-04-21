"use client";

import { useLazyLoadQuery } from "react-relay";
import type { findTeamMemberQuery } from "@/__generated__/findTeamMemberQuery.graphql";
import { FindTeamMemberQuery } from "@/lib/relay/queries/findTeamMemberQuery";

/**
 * 헤더 팀 셀렉터용: 현재 유저의 팀 멤버십 목록을 팀 정보(이름, 엠블럼)와 함께 조회합니다.
 * Layout SSR에서 동일 쿼리로 로드하므로 store-or-network 시 캐시에서 즉시 반환됩니다.
 */
export function useFindTeamMemberForHeader() {
  const data = useLazyLoadQuery<findTeamMemberQuery>(
    FindTeamMemberQuery,
    {},
    { fetchPolicy: "store-or-network" },
  );

  return data?.findTeamMember ?? [];
}
