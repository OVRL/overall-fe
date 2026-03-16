"use client";

import { useLazyLoadQuery } from "react-relay";
import type { findManyTeamMemberQueryQuery as QueryType } from "@/__generated__/findManyTeamMemberQueryQuery.graphql";
import {
  FindManyTeamMemberQuery,
  ROSTER_PAGE_SIZE,
} from "@/lib/relay/queries/findManyTeamMemberQuery";

/**
 * 로스터 패널용: 팀 멤버 목록을 페이지네이션 없이 최대 100명까지 조회합니다.
 * 리스트·상세(출장/골/도움/기점/클린시트/승률/OVR/입단일)에 필요한 필드만 요청합니다.
 */
/** 로스터 리스트/상세에서 사용하는 멤버 한 건 타입 */
export type RosterMember =
  QueryType["response"]["findManyTeamMember"]["members"][number];

export function useFindManyTeamMember() {
  const data = useLazyLoadQuery<QueryType>(
    FindManyTeamMemberQuery,
    { limit: ROSTER_PAGE_SIZE, offset: 0 },
    { fetchPolicy: "store-or-network" },
  );

  const result = data?.findManyTeamMember;
  const members = result?.members ?? [];
  const totalCount = result?.totalCount ?? 0;

  return { members, totalCount };
}

export { ROSTER_PAGE_SIZE, FindManyTeamMemberQuery };
