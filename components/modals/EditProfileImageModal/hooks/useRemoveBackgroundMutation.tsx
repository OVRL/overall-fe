import { graphql, useMutation } from "react-relay";
import { useRemoveBackgroundMutation as MutationType } from "@/__generated__/useRemoveBackgroundMutation.graphql";

export const useRemoveBackgroundMutation = () => {
  return useMutation<MutationType>(graphql`
    mutation useRemoveBackgroundMutation($image: Upload!) {
      removeBackground(image: $image) {
        image
      }
    }
  `);
};
