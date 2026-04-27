import { graphql, useMutation, UseMutationConfig } from "react-relay";
import { useUpdateTeamMutation as MutationType } from "../../../__generated__/useUpdateTeamMutation.graphql";
import { UploadableMap } from "relay-runtime";

const updateTeamMutation = graphql`
  mutation useUpdateTeamMutation($input: UpdateTeamInput!, $emblem: Upload) {
    updateTeam(input: $input, emblem: $emblem) {
      id
      name
      emblem
      activityArea
      region {
        code
        sidoName
        siggName
        dongName
        riName
        name
      }
      homeUniform
      awayUniform
      historyStartDate
      description
    }
  }
`;

export const useUpdateTeamMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(updateTeamMutation);

  const executeMutation = (
    config: Omit<UseMutationConfig<MutationType>, "mutation"> & {
      uploadables?: UploadableMap;
    },
  ) => {
    return commit({
      ...config,
      uploadables: config.uploadables,
    });
  };

  return { executeMutation, isInFlight };
}
