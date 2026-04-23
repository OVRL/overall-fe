import { graphql } from "react-relay";

export const CreateMatchMercenaryMutation = graphql`
  mutation createMatchMercenaryMutation($input: AddMatchMercenaryInput!) {
    createMatchMercenary(input: $input) {
      id
      __typename
      name
      matchId
      teamId
    }
  }
`;
