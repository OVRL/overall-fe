"use client";

import ImgPlayer from "@/components/ui/ImgPlayer";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

import { useUpdateTeamMemberProfileImage } from "@/hooks/useUpdateTeamMemberProfileImage";

type UserIntroSectionProps = {
  member: ProfileTeamMemberRow | null;
};

import Icon from "@/components/ui/Icon";
import edit_icon from "@/public/icons/edit.svg";

const UserIntroSection = ({ member }: UserIntroSectionProps) => {
  const { pickFromAlbum, fileInputRef, onHiddenFileChange, previewImage, isUpdating } =
    useUpdateTeamMemberProfileImage({
      memberId: member?.id ?? 0,
      currentImage: member?.profileImg,
    });

  return (
    <div className="flex flex-col items-center justify-center shrink-0 md:h-[275px] md:w-[200px]">
      <div className="relative size-[200px]">
        <div className="size-full overflow-hidden rounded-full bg-gray-1200 border border-gray-1100">
          <ImgPlayer
            src={previewImage}
            alt="프로필 이미지"
            sizes="200px"
            className="size-full object-cover object-bottom"
          />
        </div>
        <PendingActionButton
          type="button"
          variant="ghost"
          pending={isUpdating}
          pendingLabel=""
          className="absolute bottom-0 right-0 size-10 flex items-center justify-center bg-gray-1200 hover:bg-gray-1100 rounded-full border-none shadow-lg p-0"
          onClick={pickFromAlbum}
        >
          <Icon src={edit_icon} width={20} height={20} className="text-gray-400" />
        </PendingActionButton>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onHiddenFileChange}
      />
    </div>
  );
};

export default UserIntroSection;
