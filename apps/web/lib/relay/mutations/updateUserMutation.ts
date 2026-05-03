import { graphql } from "react-relay";

export const UpdateUserMutation = graphql`
  mutation updateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      birthDate
      activityArea
      mainPosition
      subPositions
      foot
      height
      weight
      favoritePlayer
      region {
        code
        sidoName
        siggName
        name
        dongName
        riName
      }
    }
  }
`;
