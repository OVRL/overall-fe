import { graphql } from "react-relay";

export const SearchTeamMemberQuery = graphql`
  query searchTeamMemberQuery($name: String!) {
    searchTeamMember(name: $name) {
      id
      __typename
      backNumber
      position
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
