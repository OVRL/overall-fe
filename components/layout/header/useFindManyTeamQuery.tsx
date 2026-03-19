"use client";

import { useLazyLoadQuery } from "react-relay";
import type { findManyTeamQuery } from "@/__generated__/findManyTeamQuery.graphql";
import {
  FindManyTeamQuery,
  FIND_MANY_TEAM_PAGE_SIZE,
} from "@/lib/relay/queries/findManyTeamQuery";

const DEFAULT_TEAM_IMAGE = "/images/ovr.png";

/** 햄버거 메뉴 등에서 사용하는 팀 한 건 (이미지 URL은 서버 도메인 미설정 시 기본값 사용) */
export type HamburgerTeamOption = {
  id: string;
  name: string;
  imageUrl: string;
};

/**
 * findManyTeam 쿼리로 팀 목록 조회.
 * - store-or-network로 세션 동안 캐시 유지(메뉴 열 때마다 재요청하지 않음).
 * - emblem은 서버 도메인 미설정 시 로드 실패할 수 있어 기본 이미지로 통일합니다.
 */
export function useFindManyTeamQuery(): {
  teams: HamburgerTeamOption[];
  totalCount: number;
} {
  const data = useLazyLoadQuery<findManyTeamQuery>(
    FindManyTeamQuery,
    { limit: FIND_MANY_TEAM_PAGE_SIZE, offset: 0 },
    { fetchPolicy: "store-or-network" },
  );

  const raw = data?.findManyTeam;
  const items = raw?.items ?? [];
  const totalCount = raw?.totalCount ?? 0;

  const teams: HamburgerTeamOption[] = items.map((item) => ({
    id: item.id,
    name: item.name ?? "",
    imageUrl: DEFAULT_TEAM_IMAGE,
  }));

  return { teams, totalCount };
}
