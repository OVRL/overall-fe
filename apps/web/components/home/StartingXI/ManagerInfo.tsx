"use client";

import { Suspense, useMemo } from "react";
import { useUserStore } from "@/contexts/UserContext";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import {
  getUserProfileImageFallbackUrl,
  getUserProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import OnboardingManager from "./OnboardingManager";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useBestElevenQuery } from "@/components/team-management/hooks/useBestElevenQuery";
import { extractPrimaryManagerMember, computeManagerStats } from "@/lib/formation/managerStats";

const ManagerStatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-500 text-xs md:text-sm">{label}</p>
    <p className="text-white font-bold text-sm md:text-base">{value}</p>
  </div>
);

function ManagerInfoInner({ teamId }: { teamId: number }) {
  const user = useUserStore((s) => s.user);

  const bestElevenData = useBestElevenQuery(teamId);

  const managerMemberInfo = useMemo(() => {
    const members = bestElevenData.findManyTeamMember?.members ?? [];
    return extractPrimaryManagerMember(members, bestElevenData.findBestEleven ?? []);
  }, [bestElevenData.findManyTeamMember, bestElevenData.findBestEleven]);

  const managerUser = managerMemberInfo?.user;

  const stats = useMemo(() => {
    return computeManagerStats(managerMemberInfo?.overall);
  }, [managerMemberInfo]);

  const displayName = managerUser?.name?.trim() || user?.name?.trim() || "감독";
  const rawUrl = managerUser?.profileImage ?? getUserProfileImageRawUrl(user);
  const fallbackUrl = getUserProfileImageFallbackUrl(user);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative shrink-0">
        <ProfileAvatar
          src={rawUrl || undefined}
          fallbackSrc={fallbackUrl}
          alt={`감독 ${displayName}`}
          size={56}
        />
      </div>

      <div className="text-left">
        <p className="text-gray-500 text-xs md:text-sm">감독</p>
        <p className="text-white font-bold text-base md:text-lg">{displayName}</p>
      </div>

      <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
        <ManagerStatItem label="경기수" value={String(stats.total)} />
        <ManagerStatItem label="승/무/패" value={`${stats.wins}/${stats.draws}/${stats.losses}`} />
        <ManagerStatItem label="승률" value={`${stats.winRate}%`} />
      </div>
    </div>
  );
}

function ManagerInfoFallback() {
  const user = useUserStore((s) => s.user);
  const fallbackUrl = getUserProfileImageFallbackUrl(user);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative shrink-0">
        <ProfileAvatar src={undefined} fallbackSrc={fallbackUrl} alt="감독" size={56} />
      </div>
      <div className="text-left">
        <p className="text-gray-500 text-xs md:text-sm">감독</p>
        <p className="text-white font-bold text-base md:text-lg">-</p>
      </div>
      <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
        <ManagerStatItem label="경기수" value="-" />
        <ManagerStatItem label="승/무/패" value="-/-/-" />
        <ManagerStatItem label="팀 승률" value="-%" />
      </div>
    </div>
  );
}

const ManagerInfo = () => {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (selectedTeamIdNum == null) return <ManagerInfoFallback />;

  return (
    <Suspense fallback={<ManagerInfoFallback />}>
      <ManagerInfoInner teamId={selectedTeamIdNum} />
    </Suspense>
  );
};

const ManagerInfoWrapper = ({ isSoloTeam }: { isSoloTeam: boolean }) => (
  <div className="md:gap-6 flex-nowrap overflow-x-visible flex justify-center">
    {isSoloTeam ? <OnboardingManager /> : <ManagerInfo />}
  </div>
);

export default ManagerInfoWrapper;
