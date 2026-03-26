import { graphql, useMutation, UseMutationConfig } from "react-relay";
import { RecordSourceSelectorProxy } from "relay-runtime";
import type { useCreateMatchMutation as MutationType } from "@/__generated__/useCreateMatchMutation.graphql";

const createMatchMutation = graphql`
  mutation useCreateMatchMutation($input: CreateMatchInput!) {
    createMatch(input: $input) {
      id
      matchDate
      matchType
      startTime
      endTime
      voteDeadline
      createdTeamId
      quarterCount
      quarterDuration
      description
      opponentTeamId
      teamName
      uniformType
      opponentTeam {
        name
      }
      venue {
        address
        latitude
        longitude
      }
    }
  }
`;

export function useCreateMatchMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(createMatchMutation);

  const executeMutation = (config: Omit<UseMutationConfig<MutationType>, "mutation">) => {
    return commit({
      ...config,
      updater: (store: RecordSourceSelectorProxy) => {
        const payload = store.getRootField("createMatch");
        if (!payload) return;

        const createdTeamId = payload.getValue("createdTeamId");
        if (createdTeamId == null) return;

        const root = store.getRoot();
        const matches = root.getLinkedRecords("findMatch", { createdTeamId });

        if (matches) {
          root.setLinkedRecords([payload, ...matches], "findMatch", { createdTeamId });
        }
      },
    });
  };

  return { executeMutation, isInFlight };
}
