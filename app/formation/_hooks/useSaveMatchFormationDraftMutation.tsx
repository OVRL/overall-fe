"use client";

import { graphql, useMutation } from "react-relay";
import type { useSaveMatchFormationDraftMutation as MutationType } from "@/__generated__/useSaveMatchFormationDraftMutation.graphql";

const saveMatchFormationDraftMutation = graphql`
  mutation useSaveMatchFormationDraftMutation(
    $input: SaveMatchFormationDraftInput!
  ) {
    saveMatchFormationDraft(input: $input) {
      id
      isDraft
      matchId
      quarter
      teamId
      tactics
      updatedAt
    }
  }
`;

export function useSaveMatchFormationDraftMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(
    saveMatchFormationDraftMutation,
  );
  return { commit, isInFlight };
}
