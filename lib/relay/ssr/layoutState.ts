import type { UserModel } from "@/contexts/UserContext";

/**
 * Layout SSR 로더가 파생해 클라이언트 Provider에 전달하는 상태.
 * (관심사 분리: 서버는 쿼리 실행·파생, 레이아웃은 이 값만 소비)
 */
export interface LayoutState {
  /** 클라이언트에서 FindUserById 쿼리 변수로 사용 (Relay 스토어 읽기용) */
  userId: number | null;
  /** 현재 유저 (FindUserById 결과 → UserModel). 클라이언트가 Relay에서 읽을 때까지 폴백용 */
  initialUser: UserModel | null;
  /** findTeamMember에 team이 붙은 소속이 1개 이상 (다중 팀인데 쿠키 미매칭이어도 true) */
  hasAnyTeamMembership: boolean;
  /** 선택된 팀 ID (Relay 노드 id 문자열) */
  initialSelectedTeamId: string | null;
  /** 선택된 팀의 숫자 ID. FindMatch(createdTeamId) 등 API 변수용 */
  initialSelectedTeamIdNum: number | null;
  /** 표시용 팀 이름 */
  initialSelectedTeamName: string | null;
  /** 표시용 팀 이미지 URL */
  initialSelectedTeamImageUrl: string | null;
  /** 팀이 1개일 때 서버가 초기값으로 넣어준 경우. 클라이언트에서 쿠키 저장용 */
  initialSelectedTeamIdFromSingleTeam: boolean;
  /** 로스터 팀원이 1명(나 혼자)일 때 true. 홈 온보딩 UI 분기용 (findManyTeamMember totalCount 기반) */
  initialIsSoloTeam: boolean;
}

export const EMPTY_LAYOUT_STATE: LayoutState = {
  userId: null,
  initialUser: null,
  hasAnyTeamMembership: false,
  initialSelectedTeamId: null,
  initialSelectedTeamIdNum: null,
  initialSelectedTeamName: null,
  initialSelectedTeamImageUrl: null,
  initialSelectedTeamIdFromSingleTeam: false,
  initialIsSoloTeam: false,
};
