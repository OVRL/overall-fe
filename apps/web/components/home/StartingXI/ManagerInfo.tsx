"use client";

import { useUserStore } from "@/contexts/UserContext";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import {
  getUserProfileImageFallbackUrl,
  getUserProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import OnboardingManager from "./OnboardingManager";

const ManagerStatItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-gray-500 text-xs md:text-sm">{label}</p>
    <p className="text-white font-bold text-sm md:text-base">{value}</p>
  </div>
);

const ManagerStats = () => (
  <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
    <ManagerStatItem label="경기수" value="30" />
    <ManagerStatItem label="승/무/패" value="20/5/5" />
    <ManagerStatItem label="팀 승률" value="60%" />
  </div>
);

const ManagerInfo = () => {
  const user = useUserStore((s) => s.user);
  const displayName = user?.name?.trim() || "정태우";
  const rawUrl = getUserProfileImageRawUrl(user);
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
        <p className="text-white font-bold text-base md:text-lg">
          {displayName}
        </p>
      </div>

      <ManagerStats />
    </div>
  );
};

const ManagerInfoWrapper = ({ isSoloTeam }: { isSoloTeam: boolean }) => (
  <div className="md:gap-6 flex-nowrap overflow-x-visible flex justify-center">
    {isSoloTeam ? <OnboardingManager /> : <ManagerInfo />}
  </div>
);

export default ManagerInfoWrapper;
