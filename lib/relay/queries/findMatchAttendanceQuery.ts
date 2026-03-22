import { graphql } from "react-relay";

/** 경기·팀 단위 참석 투표 현황 (모달 하단 요약·명단 팝오버용) */
export const FindMatchAttendanceQuery = graphql`
  query findMatchAttendanceQuery($matchId: Int!, $teamId: Int!) {
    findMatchAttendance(matchId: $matchId, teamId: $teamId) {
      userId
      user {
        name
        profileImage
      }
      attendanceStatus
    }
  }
`;
