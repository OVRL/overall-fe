import { graphql } from "react-relay";

export const FormationMatchAttendanceQuery = graphql`
  query formationMatchAttendanceQuery($matchId: Int!, $teamId: Int!) {
    findMatchAttendance(matchId: $matchId, teamId: $teamId) {
      id
      __typename
      attendanceStatus
      memberType
      teamMember {
        id
        __typename
        backNumber
        position
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
  }
`;
