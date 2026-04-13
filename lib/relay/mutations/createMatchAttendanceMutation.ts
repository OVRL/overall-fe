import { graphql } from "react-relay";

export const CreateMatchAttendanceMutation = graphql`
  mutation createMatchAttendanceMutation($input: CreateMatchAttendanceInput!) {
    createMatchAttendance(input: $input) {
      id
      __typename
      attendanceStatus
      memberType
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
  }
`;
