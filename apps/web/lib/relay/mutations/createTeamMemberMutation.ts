import { graphql } from "react-relay";

export const CreateTeamMemberMutation = graphql`
  mutation createTeamMemberMutation($email: String!, $inviteCode: String!) {
    createTeamMember(input: { email: $email, inviteCode: $inviteCode }) {
      id
      userId
      teamId
      role
    }
  }
`;
