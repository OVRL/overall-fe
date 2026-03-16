import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useCreateMatchAttendanceMutation as MutationType } from "@/__generated__/useCreateMatchAttendanceMutation.graphql";

const createMatchAttendanceMutation = graphql`
  mutation useCreateMatchAttendanceMutation($input: CreateMatchAttendanceInput!) {
    createMatchAttendance(input: $input) {
      id
      matchId
      teamId
      userId
      attendanceStatus
    }
  }
`;

export function useCreateMatchAttendanceMutation() {
  const [commit, isInFlight] =
    useMutation<MutationType>(createMatchAttendanceMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
}
