/**
 * 헤더 팀 셀렉터에서 선택한 팀 ID를 저장하는 쿠키 키.
 * - 읽기: layout SSR에서 cookies().get()으로 읽고, findTeamMember 결과와 조합해 초기값 계산.
 * - 쓰기: 클라이언트에서만 (사용자가 팀 선택 시 + SSR에서 팀 1개로 초기값 준 경우 한 번).
 */
export const SELECTED_TEAM_ID_COOKIE_KEY = "selectedTeamId";

const MAX_AGE_DAYS = 365;
const MAX_AGE_SECONDS = MAX_AGE_DAYS * 24 * 60 * 60;

/**
 * 클라이언트에서만 호출. 선택한 팀 ID를 쿠키에 저장합니다.
 * (사용자가 팀 선택 시, 또는 SSR에서 팀 1개로 초기값을 준 뒤 한 번 저장할 때 사용)
 */
export function setSelectedTeamIdCookie(teamId: string | null): void {
  if (typeof document === "undefined") return;

  if (teamId == null || teamId === "") {
    document.cookie = `${SELECTED_TEAM_ID_COOKIE_KEY}=; path=/; max-age=0`;
    return;
  }

  document.cookie = `${SELECTED_TEAM_ID_COOKIE_KEY}=${encodeURIComponent(teamId)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}
