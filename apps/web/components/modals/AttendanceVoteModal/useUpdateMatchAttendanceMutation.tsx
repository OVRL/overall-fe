import { graphql, useMutation, UseMutationConfig } from "react-relay";
import type { useUpdateMatchAttendanceMutation as MutationType } from "@/__generated__/useUpdateMatchAttendanceMutation.graphql";

const updateMatchAttendanceMutation = graphql`
  mutation useUpdateMatchAttendanceMutation($input: UpdateMatchAttendanceInput!) {
    updateMatchAttendance(input: $input) {
      id
      matchId
      teamId
      userId
      attendanceStatus
    }
  }
`;

export function useUpdateMatchAttendanceMutation() {
  const [commit, isInFlight] =
    useMutation<MutationType>(updateMatchAttendanceMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation">,
  ) => {
    return commit(config);
  };

  return { executeMutation, isInFlight };
}
