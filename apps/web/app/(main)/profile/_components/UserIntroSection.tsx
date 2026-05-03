"use client";

import ImgPlayer from "@/components/ui/ImgPlayer";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

import { useUpdateTeamMemberProfileImage } from "@/hooks/useUpdateTeamMemberProfileImage";

type UserIntroSectionProps = {
  member: ProfileTeamMemberRow | null;
};

const UserIntroSection = ({ member }: UserIntroSectionProps) => {
  const { pickFromAlbum, fileInputRef, onHiddenFileChange, previewImage, isUpdating } =
    useUpdateTeamMemberProfileImage({
      memberId: member?.id ?? 0,
      currentImage: member?.profileImg,
    });

  return (
    <div className="flex flex-col items-center justify-center gap-4 shrink-0 md:h-[275px] md:w-[200px]">
      <div className="relative size-[200px] overflow-hidden rounded-full bg-gray-1200 border border-gray-1100">
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
        pendingLabel="프로필 이미지 업로드 중"
        className="h-9.5 w-auto px-3 text-sm font-semibold text-Label-Tertiary bg-gray-1000 hover:bg-gray-900 rounded-lg border-none"
        onClick={pickFromAlbum}
      >
        수정하기
      </PendingActionButton>
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
