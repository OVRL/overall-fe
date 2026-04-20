import { graphql } from "react-relay";

/** MOM 투표 모달: 참석자·용병·집계·내 투표(있으면) 동시 조회 */
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
    matchMercenaries(matchId: $matchId) {
      id
      name
      matchId
      teamId
    }
    matchMomVotes(matchId: $matchId, teamId: $teamId) {
      voteCount
      candidateUserId
      candidateMercenaryId
    }
    findMyMatchMomVote(matchId: $matchId, teamId: $teamId) {
      id
      matchId
      teamId
      voterUserId
      candidateUserId
      candidateMercenaryId
    }
  }
`;
