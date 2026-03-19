import type { findUserByIdQuery$data } from "@/__generated__/findUserByIdQuery.graphql";
import type { findTeamMemberQuery$data } from "@/__generated__/findTeamMemberQuery.graphql";
import type { UserModel } from "@/contexts/UserContext";
import { fetchQuery } from "relay-runtime";
import { getServerEnvironment } from "../getServerEnvironment";
import { FindMatchQuery } from "../queries/findMatchQuery";
import {
  FindManyTeamMemberQuery,
  ROSTER_PAGE_SIZE,
} from "../queries/findManyTeamMemberQuery";
import { FindTeamMemberQuery } from "../queries/findTeamMemberQuery";
import { FindUserByIdQuery } from "../queries/findUserByIdQuery";
import { observableToPromise } from "../observableToPromise";
import { serializeRelayStore } from "../serialization";
import type { SerializedRelayRecords } from "../serialization";
import { mapRelayUserToUserModel } from "../mapRelayUserToUserModel";
import {
  EMPTY_LAYOUT_STATE,
  type LayoutState,
} from "./layoutState";

export interface LoadLayoutSSROptions {
  accessToken: string | null;
  /** 토큰 만료 시 SSR에서 refresh 후 재시도에 사용 */
  refreshToken: string | null;
  /** 쿠키의 userId. 있으면 FindUserById, FindTeamMember 추가 로드 */
  userId: number | null;
  /** 쿠키의 선택 팀 ID (문자열). 팀 유효성·FindMatch 변수 계산에 사용 */
  selectedTeamIdFromCookie: string | null;
}

export interface LoadLayoutSSRResult {
  /** 직렬화된 Relay 스토어. RelayProvider initialRecords로 전달 */
  relayInitialRecords: SerializedRelayRecords;
  /** 레이아웃/Provider에 넘길 파생 상태 */
  layoutState: LayoutState;
}

/**
 * Layout 단일 진입점: 요청당 한 번, 하나의 Relay Environment에서
 * 유저/팀멤버/로스터/경기 쿼리를 실행하고 직렬화 + 파생 layoutState 반환.
 * (횡단: 인증·직렬화는 createServerFetch/getServerEnvironment에서 처리)
 */
export async function loadLayoutSSR(
  options: LoadLayoutSSROptions,
): Promise<LoadLayoutSSRResult> {
  const { accessToken, refreshToken, userId, selectedTeamIdFromCookie } =
    options;
  const environment = getServerEnvironment(accessToken, refreshToken);

  // accessToken이 없어도 refreshToken만 있으면 유저·팀 로드 시도 (createServerFetch에서 401 시 refresh 후 재시도)
  const hasUser =
    userId != null &&
    !Number.isNaN(userId) &&
    (accessToken != null || refreshToken != null);

  // 1단계: 유저·팀멤버·로스터 병렬 로드 (유저 있으면 3개, 없으면 로스터만)
  const rosterPromise = fetchQuery(
    environment,
    FindManyTeamMemberQuery,
    { limit: ROSTER_PAGE_SIZE, offset: 0 },
    { fetchPolicy: "network-only" },
  );

  const userPromise = hasUser
    ? observableToPromise(
        fetchQuery(
          environment,
          FindUserByIdQuery,
          { id: userId! },
          { fetchPolicy: "network-only" },
        ),
      )
    : Promise.resolve<findUserByIdQuery$data | null>(null);
  const teamMemberPromise = hasUser
    ? observableToPromise(
        fetchQuery(
          environment,
          FindTeamMemberQuery,
          { userId: userId! },
          { fetchPolicy: "network-only" },
        ),
      )
    : Promise.resolve<findTeamMemberQuery$data | null>(null);

  const [userData, teamMemberData] = (await Promise.all([
    userPromise,
    teamMemberPromise,
    observableToPromise(rosterPromise),
  ])) as [findUserByIdQuery$data | null, findTeamMemberQuery$data | null, unknown];

  const layoutState = deriveLayoutState(
    userData,
    teamMemberData,
    selectedTeamIdFromCookie,
    userId,
  );

  // 2단계: 선택 팀이 정해졌으면 FindMatch 로드 (createdTeamId는 숫자 teamId)
  const initialSelectedTeamIdNum = layoutState.initialSelectedTeamId
    ? getCreatedTeamIdNum(teamMemberData, layoutState.initialSelectedTeamId)
    : null;
  const layoutStateWithNum: LayoutState = {
    ...layoutState,
    initialSelectedTeamIdNum,
  };
  if (
    initialSelectedTeamIdNum != null &&
    (accessToken != null || refreshToken != null)
  ) {
    const matchObs = fetchQuery(
      environment,
      FindMatchQuery,
      { createdTeamId: initialSelectedTeamIdNum },
      { fetchPolicy: "network-only" },
    );
    await observableToPromise(matchObs);
  }

  const relayInitialRecords = serializeRelayStore(environment);
  return { relayInitialRecords, layoutState: layoutStateWithNum };
}

/** FindTeamMember 결과 + 쿠키로 LayoutState 파생 (레이아웃 전용 로직) */
function deriveLayoutState(
  userData: findUserByIdQuery$data | null,
  teamMemberData: findTeamMemberQuery$data | null,
  selectedTeamIdFromCookie: string | null,
  userId: number | null,
): LayoutState {
  const initialUser = userData?.findUserById
    ? relayUserToUserModel(userData.findUserById)
    : null;

  if (!teamMemberData?.findTeamMember?.length) {
    return {
      ...EMPTY_LAYOUT_STATE,
      userId,
      initialUser,
    };
  }

  const members = teamMemberData.findTeamMember;
  const teamsWithInfo = members.filter(
    (m): m is typeof m & { team: NonNullable<typeof m.team> } =>
      m.team != null,
  );
  const teamIds = teamsWithInfo.map((m) => m.team.id);

  let initialSelectedTeamId: string | null = selectedTeamIdFromCookie;
  let initialSelectedTeamIdFromSingleTeam = false;

  if (
    selectedTeamIdFromCookie != null &&
    teamIds.includes(selectedTeamIdFromCookie)
  ) {
    initialSelectedTeamId = selectedTeamIdFromCookie;
  } else if (teamsWithInfo.length === 1) {
    initialSelectedTeamId = teamsWithInfo[0]!.team.id;
    initialSelectedTeamIdFromSingleTeam = true;
  } else {
    initialSelectedTeamId = null;
  }

  let initialSelectedTeamName: string | null = null;
  let initialSelectedTeamImageUrl: string | null = null;
  if (initialSelectedTeamId != null) {
    const selected = teamsWithInfo.find(
      (m) => m.team.id === initialSelectedTeamId,
    );
    initialSelectedTeamName = selected?.team.name ?? null;
    initialSelectedTeamImageUrl = selected?.team.emblem ?? null;
  }

  const initialSelectedTeamIdNum = initialSelectedTeamId
    ? getCreatedTeamIdNum(teamMemberData, initialSelectedTeamId)
    : null;

  return {
    userId,
    initialUser,
    initialSelectedTeamId,
    initialSelectedTeamIdNum,
    initialSelectedTeamName,
    initialSelectedTeamImageUrl,
    initialSelectedTeamIdFromSingleTeam,
  };
}

function relayUserToUserModel(
  u: findUserByIdQuery$data["findUserById"],
): UserModel {
  return mapRelayUserToUserModel(u);
}

/** 선택 팀 id(문자열)에 해당하는 팀의 숫자 teamId. FindMatch(createdTeamId)용 */
function getCreatedTeamIdNum(
  teamMemberData: findTeamMemberQuery$data | null,
  selectedTeamId: string,
): number | null {
  if (!teamMemberData?.findTeamMember) return null;
  const m = teamMemberData.findTeamMember.find(
    (x) => x.team?.id === selectedTeamId,
  );
  return m?.teamId ?? null;
}

