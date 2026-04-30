import { graphql } from "react-relay";

/**
 * 랜딩·팀 가입 — 초대 코드로 팀 정보 + 내 가입 신청 이력(승인 대기 여부) 동시 조회
 */
export const FindTeamByInviteCodeQuery = graphql`
  query findTeamByInviteCodeQuery($inviteCode: String!) {
    findTeamByInviteCode(inviteCode: $inviteCode) {
      id
      name
      description
      activityArea
      emblem
      historyStartDate
      homeUniform
      awayUniform
      region {
        code
        sidoName
        siggName
        dongName
        riName
        name
      }
    }
    findMyJoinRequest {
      id
      status
      teamId
      rejectedReason
    }
  }
`;
