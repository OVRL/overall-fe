"use client";

import { graphql, useMutation } from "react-relay";
import type { useConfirmMatchFormationMutation as MutationType } from "@/__generated__/useConfirmMatchFormationMutation.graphql";

const confirmMatchFormationMutation = graphql`
  mutation useConfirmMatchFormationMutation(
    $draftId: Int!
    $userId: Int!
  ) {
    confirmMatchFormation(draftId: $draftId, userId: $userId) {
      id
      isDraft
      matchId
      teamId
      tactics
      updatedAt
    }
  }
`;

export function useConfirmMatchFormationMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(
    confirmMatchFormationMutation,
  );
  return { commit, isInFlight };
}
