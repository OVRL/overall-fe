import { graphql } from "react-relay";

export const UpdateMatchAttendanceMutation = graphql`
  mutation updateMatchAttendanceMutation($input: UpdateMatchAttendanceInput!) {
    updateMatchAttendance(input: $input) {
      id
      __typename
      attendanceStatus
    }
  }
`;
