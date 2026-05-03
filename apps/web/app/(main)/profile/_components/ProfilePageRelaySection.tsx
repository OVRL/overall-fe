"use client";

import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useUserId } from "@/hooks/useUserId";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { ProfileFindTeamMemberQuery } from "@/lib/relay/queries/profileFindTeamMemberQuery";
import { selectProfileTeamMemberRow } from "@/lib/relay/selectProfileTeamMemberRow";
import type { profileFindTeamMemberQuery } from "@/__generated__/profileFindTeamMemberQuery.graphql";
import TeamSelectButtonContainer from "./TeamSelectButtonContainer";
import ProfileStats from "./ProfileStats";
import SeasonIntegratedRecords from "./SeasonIntegratedRecords";
import AttackContributionSection from "./AttackContributionSection";
import ProfileRevealSection from "./ProfileRevealSection";

/**
 * 프로필에서 필요한 findTeamMember 데이터를 한 번에 가져옵니다.
 * 팀 전환 시에는 SelectedTeamProvider의 selectedTeamId만 바뀌며,
 * 같은 쿼리 결과에서 다음 단계로 골라 쓰면 되므로 네트워크 refetch가 필요 없습니다.
 */
export default function ProfilePageRelaySection() {
  const userId = useUserId();

  if (userId === null) {
    return null;
  }

  return <ProfilePageRelayBody />;
}

function ProfilePageRelayBody() {
  const data = useLazyLoadQuery<profileFindTeamMemberQuery>(
    ProfileFindTeamMemberQuery,
    {},
    { fetchPolicy: "store-or-network" },
  );

  const members = useMemo(
    () => data?.findTeamMember ?? [],
    [data?.findTeamMember],
  );
  const { selectedTeamId } = useSelectedTeamId();
  const selectedMember = useMemo(
    () => selectProfileTeamMemberRow(members, selectedTeamId),
    [members, selectedTeamId],
  );

  return (
    <>
      <ProfileRevealSection>
        <TeamSelectButtonContainer members={members} />
      </ProfileRevealSection>
      <ProfileRevealSection className="flex w-full justify-center">
        <ProfileStats member={selectedMember} overall={selectedMember?.overall} />
      </ProfileRevealSection>
      <ProfileRevealSection>
        <SeasonIntegratedRecords />
      </ProfileRevealSection>
      <ProfileRevealSection>
        <AttackContributionSection />
      </ProfileRevealSection>
    </>
  );
}
