import type { profileFindTeamMemberQuery } from "@/__generated__/profileFindTeamMemberQuery.graphql";

export type ProfileTeamMemberRow =
  profileFindTeamMemberQuery["response"]["findTeamMember"][number];
