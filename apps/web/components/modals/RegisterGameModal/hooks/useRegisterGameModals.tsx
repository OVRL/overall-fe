"use client";

import { useCallback } from "react";
import useModal from "@/hooks/useModal";
import type { UseFormSetValue } from "react-hook-form";
import type { RegisterGameValues } from "../schema";
import type { TeamSearchResult } from "@/hooks/useTeamSearch";

interface UseRegisterGameModalsProps {
  setValue: UseFormSetValue<RegisterGameValues>;
}

/**
 * 경기 등록 폼에서 주소 검색 / 팀 검색 모달을 열고,
 * 완료 시 폼 필드를 setValue로 채우는 책임만 가집니다.
 */
export function useRegisterGameModals({ setValue }: UseRegisterGameModalsProps) {
  const { openModal: openAddressModal, hideModal: hideAddressModal } =
    useModal("DETAIL_ADDRESS_SEARCH");
  const { openModal: openTeamSearchModal } = useModal("TEAM_SEARCH");

  const handleAddressClick = useCallback(() => {
    openAddressModal({
      onComplete: (result: {
        address: string;
        latitude: number;
        longitude: number;
      }) => {
        setValue(
          "venue",
          {
            address: result.address,
            latitude: result.latitude,
            longitude: result.longitude,
          },
          { shouldValidate: true },
        );
        hideAddressModal();
      },
    });
  }, [openAddressModal, hideAddressModal, setValue]);

  const handleOpponentTeamClick = useCallback(() => {
    openTeamSearchModal({
      onComplete: (result: TeamSearchResult) => {
        setValue("opponentName", result.name, { shouldValidate: true });
        setValue(
          "opponentTeamId",
          result.id !== null ? result.id : null,
          { shouldValidate: true },
        );
      },
    });
  }, [openTeamSearchModal, setValue]);

  return {
    handleAddressClick,
    handleOpponentTeamClick,
  };
}
