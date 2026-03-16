"use client";

import { useState } from "react";
import PositionChip from "@/components/PositionChip";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Position } from "@/types/position";
import PlayerListItemGradation from "./PlayerListItemGradation";
import type { RosterMember } from "@/components/home/Roster/useFindManyTeamMemberQuery";

// 이미지 서버 미구축으로 프로필 미사용 시 대체 이미지
const MOCK_PLAYER_IMAGE = "/images/ovr.png";

interface PlayerListItemProps {
  member: RosterMember;
  onClick?: () => void;
  /** LCP 이미지일 때 true (리스트 첫 항목 등) */
  priority?: boolean;
}

const PlayerListItem = ({ member, onClick, priority }: PlayerListItemProps) => {
  const [imageError, setImageError] = useState(false);
  const name = member.user?.name ?? "";
  const profileImg = member.profileImg ?? member.user?.profileImage;
  const playerImage =
    imageError || !profileImg ? MOCK_PLAYER_IMAGE : profileImg;

  return (
    <div
      onClick={onClick}
      className="flex items-center w-full hover:bg-gray-800/30 transition-colors cursor-pointer pl-2 pr-1.5 relative py-1"
      role="row"
    >
      <div className="flex items-center" role="cell">
        <div className="flex items-center">
          <div className="w-12.25 flex justify-center">
            <PositionChip
              position={(member.position ?? "MF") as Position}
              variant="outline"
            />
          </div>
          <span className="w-9.75 text-Label-Primary text-center text-sm md:text-base">
            {member.backNumber ?? "-"}
          </span>
        </div>
      </div>

      <div
        className="flex-1 flex items-center overflow-hidden justify-center"
        role="cell"
      >
        <div className="flex-none mr-2 md:mr-3">
          <ProfileAvatar
            src={playerImage}
            alt={name}
            size={36}
            onError={() => setImageError(true)}
            priority={priority}
          />
        </div>

        <span className="text-white font-medium truncate text-sm w-18.75 text-ellipsis">
          {name}
        </span>
      </div>

      <div className="w-12.25 flex justify-end" role="cell">
        <span className="text-Label-AccentPrimary text-sm w-full text-center">
          {member.overall?.ovr ?? "-"}
        </span>
      </div>

      {/* 구분선 */}
      <div className="absolute inset-x-0 bottom-0 h-px z-10 bg-[#252525]" />
      <PlayerListItemGradation
        position={(member.position ?? "MF") as Position}
      />
    </div>
  );
};

export default PlayerListItem;
