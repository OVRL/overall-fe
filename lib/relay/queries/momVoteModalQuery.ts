import { graphql } from "react-relay";

/** MOM 투표 모달: 참석자·집계·내 투표(있으면) 동시 조회 (후보는 ATTEND 팀원만, 용병 제외) */
export const MomVoteModalQuery = graphql`
  query momVoteModalQuery($matchId: Int!, $teamId: Int!) {
    findMatchAttendance(matchId: $matchId, teamId: $teamId) {
      id
      matchId
      userId
      user {
        id
        name
        profileImage
      }
      attendanceStatus
    }
    findMatchMom(matchId: $matchId, teamId: $teamId) {
      voteCount
      candidateUserId
      candidateMercenaryId
    }
    findMyMatchMom(matchId: $matchId) {
      id
      matchId
      teamId
      voterUserId
      candidateUserId
      candidateMercenaryId
      createdAt
      candidateUser {
        name
      }
      candidateMercenary {
        name
      }
    }
  }
`;
