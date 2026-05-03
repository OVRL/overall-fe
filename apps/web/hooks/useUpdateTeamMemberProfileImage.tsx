"use client";

import { useUpdateTeamMemberMutation } from "@/components/team-management/hooks/useUpdateTeamMemberMutation";
import { useProfileImageUploadFlow } from "@/hooks/useProfileImageUploadFlow";
import { useBridge } from "@/hooks/bridge/useBridge";
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
 * 앱 환경(Bridge)과 웹 환경을 모두 지원하며 낙관적 업데이트를 구현합니다.
 */
export const useUpdateTeamMemberProfileImage = ({
  memberId,
  currentImage,
}: UseUpdateTeamMemberProfileImageProps) => {
  const { executeMutation } = useUpdateTeamMemberMutation();
  const { isNativeApp, openPhotoPicker } = useBridge();
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

  /**
   * 앱 환경일 경우 네이티브 픽커를, 웹 환경일 경우 기존 앨범 선택을 실행합니다.
   */
  const handlePickImage = useCallback(async () => {
    if (isNativeApp) {
      try {
        const result = await openPhotoPicker();
        if (result?.base64) {
          // base64 데이터를 File 객체로 변환하여 기존 저장 로직 재사용
          const res = await fetch(`data:${result.mimeType};base64,${result.base64}`);
          const blob = await res.blob();
          const file = new File([blob], "profile.webp", { type: result.mimeType });
          void handleSave(file);
        }
      } catch (error) {
        console.error("Failed to open native photo picker:", error);
      }
    } else {
      pickFromAlbum();
    }
  }, [isNativeApp, openPhotoPicker, pickFromAlbum, handleSave]);

  return {
    pickFromAlbum: handlePickImage,
    fileInputRef,
    onHiddenFileChange,
    isUpdating: isPending,
    previewImage: optimisticImage,
  };
};
