"use client";

import { useUpdateTeamMemberMutation } from "@/components/team-management/hooks/useUpdateTeamMemberMutation";
import { useProfileImageUploadFlow } from "@/hooks/useProfileImageUploadFlow";
import { toast } from "@/lib/toast";
import { useCallback, useOptimistic, useState, useTransition } from "react";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import type { useUpdateTeamMemberMutation$data } from "@/__generated__/useUpdateTeamMemberMutation.graphql";

interface UseUpdateTeamMemberProfileImageProps {
  memberId: number | string;
  currentImage?: string | null;
}

/**
 * 팀 멤버 프로필 이미지를 수정하기 위한 로직을 처리하는 훅입니다.
 * 웹·앱 모두 `useProfileImageUploadFlow`를 통해 앨범 선택 후 `EDIT_PROFILE_IMAGE` 편집 모달을 거친 뒤 저장합니다.
 */
export const useUpdateTeamMemberProfileImage = ({
  memberId,
  currentImage,
}: UseUpdateTeamMemberProfileImageProps) => {
  const { executeMutation } = useUpdateTeamMemberMutation();
  const [isPending, startTransition] = useTransition();
  const [syncedImage, setSyncedImage] = useState<string | null>(null);

  const [optimisticImage, addOptimisticImage] = useOptimistic(
    syncedImage || currentImage,
    (_current: string | null | undefined, newImage: string) => newImage,
  );

  const handleSave = useCallback(
    async (file: File) => {
      const numericId = parseNumericIdFromRelayGlobalId(memberId);
      if (numericId === null) {
        toast.error("유효하지 않은 팀 멤버 ID입니다.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);

      startTransition(async () => {
        addOptimisticImage(objectUrl);

        try {
          const response = (await executeMutation(
            {
              id: numericId,
            },
            file,
          )) as { updateTeamMember: useUpdateTeamMemberMutation$data["updateTeamMember"] };

          const newProfileImg = response?.updateTeamMember?.profileImg;
          if (newProfileImg) {
            setSyncedImage(newProfileImg);
          }

          toast.success("프로필 이미지가 수정되었습니다.");
        } catch (error) {
          console.error("Failed to update team member profile image:", error);
          toast.error("프로필 이미지 수정에 실패했습니다.");
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      });
    },
    [memberId, executeMutation, addOptimisticImage],
  );

  const { pickFromAlbum, fileInputRef, onHiddenFileChange } =
    useProfileImageUploadFlow({
      currentImage: currentImage ?? undefined,
      onFileSelect: (file) => {
        void handleSave(file);
      },
    });

  return {
    pickFromAlbum,
    fileInputRef,
    onHiddenFileChange,
    isUpdating: isPending,
    previewImage: optimisticImage,
  };
};
