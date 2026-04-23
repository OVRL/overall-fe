"use client";

import { useEffect } from "react";
import useModal from "@/hooks/useModal";
import { SHOW_TEAM_CREATED_MODAL_KEY } from "@/lib/teamCreatedModalStorage";

/**
 * 팀 생성 직후 sessionStorage 플래그가 있으면 TeamCreatedModal을 한 번만 띄우고 플래그를 제거합니다.
 * 앱 루트(/) 등 팀 생성 완료 후 도착하는 페이지에서 호출합니다.
 */
export function useTeamCreatedModalTrigger(): void {
  const { openModal } = useModal("TEAM_CREATED");

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const show = sessionStorage.getItem(SHOW_TEAM_CREATED_MODAL_KEY);
    if (show === "1") {
      sessionStorage.removeItem(SHOW_TEAM_CREATED_MODAL_KEY);
      openModal({});
    }
  }, [openModal]);
}
