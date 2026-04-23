import { graphql } from "react-relay";

export const DeleteMatchMercenaryMutation = graphql`
  mutation deleteMatchMercenaryMutation($input: DeleteMatchMercenaryInput!) {
    deleteMatchMercenary(input: $input)
  }
`;
