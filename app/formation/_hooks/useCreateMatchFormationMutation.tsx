"use client";

import { graphql, useMutation } from "react-relay";
import type { useCreateMatchFormationMutation as MutationType } from "@/__generated__/useCreateMatchFormationMutation.graphql";

const createMatchFormationMutation = graphql`
  mutation useCreateMatchFormationMutation($input: CreateMatchFormationInput!) {
    createMatchFormation(input: $input) {
      id
      isDraft
      matchId
      teamId
      tactics
      updatedAt
    }
  }
`;

export function useCreateMatchFormationMutation() {
  const [commit, isInFlight] = useMutation<MutationType>(
    createMatchFormationMutation,
  );
  return { commit, isInFlight };
}
