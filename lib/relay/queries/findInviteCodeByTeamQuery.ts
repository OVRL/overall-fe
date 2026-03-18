import { graphql } from "react-relay";

/**
 * 팀 ID로 기존 초대 코드 조회.
 * createInviteCode 실패 시 "이미 팀 초대 코드가 존재합니다"인 경우 재조회용.
 */
export const FindInviteCodeByTeamQuery = graphql`
  query findInviteCodeByTeamQuery($teamId: Int!) {
    findInviteCodeByTeam(teamId: $teamId) {
      code
    }
  }
`;
