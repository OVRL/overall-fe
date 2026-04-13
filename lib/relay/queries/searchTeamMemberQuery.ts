import { graphql } from "react-relay";

export const SearchTeamMemberQuery = graphql`
  query searchTeamMemberQuery($name: String!, $teamId: Int!) {
    searchTeamMember(name: $name, teamId: $teamId) {
      id
      __typename
      foot
      preferredNumber
      preferredPosition
      profileImg
      overall {
        ovr
      }
      user {
        id
        __typename
        name
        preferredNumber
        profileImage
      }
      teamId
      userId
    }
  }
`;
