/**
 * 팀 생성 완료 후 /home에서 TeamCreatedModal을 한 번만 띄우기 위한 sessionStorage 키.
 * create-team 성공 시 설정하고, 홈 마운트 시 읽은 뒤 제거합니다.
 */
export const SHOW_TEAM_CREATED_MODAL_KEY = "showTeamCreatedModal";
