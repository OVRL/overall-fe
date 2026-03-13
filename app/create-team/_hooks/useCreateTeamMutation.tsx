import { graphql, useMutation, UseMutationConfig } from "react-relay";
import { useCreateTeamMutation as MutationType } from "../../../__generated__/useCreateTeamMutation.graphql";
import { UploadableMap } from "relay-runtime";

const createTeamMutation = graphql`
  mutation useCreateTeamMutation($input: CreateTeamInput!, $emblem: Upload!) {
    createTeam(input: $input, emblem: $emblem) {
      id
      name
      emblem
      activityArea
      homeUniform
      awayUniform
      historyStartDate
      description
    }
  }
`;

export const useCreateTeamMutation = () => {
  const [commit, isInFlight] = useMutation<MutationType>(createTeamMutation);

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
};
