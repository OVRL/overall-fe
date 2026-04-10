"use client";

import { graphql, useMutation } from "react-relay";
import type { useUpdateMatchFormationForDraftMutation as MutationType } from "@/__generated__/useUpdateMatchFormationForDraftMutation.graphql";

const updateMatchFormationForDraftMutation = graphql`
  mutation useUpdateMatchFormationForDraftMutation(
    $input: UpdateMatchFormationInput!
  ) {
    updateMatchFormation(input: $input) {
      id
      tactics
    }
  }
`;

export function useUpdateMatchFormationForDraftMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(
    updateMatchFormationForDraftMutation,
  );
  return { commit, isInFlight };
}
