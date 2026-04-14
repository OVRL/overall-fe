import { graphql } from "react-relay";

export const FormationMatchAttendanceQuery = graphql`
  query formationMatchAttendanceQuery($matchId: Int!, $teamId: Int!) {
    findMatchAttendance(matchId: $matchId, teamId: $teamId) {
      id
      __typename
      attendanceStatus
      teamMember {
        id
        __typename
        foot
        preferredNumber
        preferredPosition
        profileImg
        overall {
          ovr
        }
        user {
          id
          __typename
          name
          preferredNumber
          profileImage
        }
      }
    }
    matchMercenaries(matchId: $matchId) {
      id
      __typename
      name
      matchId
      teamId
    }
  }
`;
