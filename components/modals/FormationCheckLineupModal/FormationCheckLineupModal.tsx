"use client";

import { Suspense } from "react";
import useModal from "@/hooks/useModal";

import { toast } from "@/lib/toast";
import ModalLoadingFallback from "../ModalLoadingFallback";
import FormationCheckLineupModalContent from "./FormationCheckLineupModalContent";
import Icon from "@/components/ui/Icon";
import share from "@/public/icons/share.svg";
import close from "@/public/icons/close.svg";

export type FormationCheckLineupModalProps = {
  matchId: number;
  teamId: number;
};

/**
 * 포메이션 확인 — `ModalLayout` 없이 백드롭 위에 툴바(공유·닫기) + 본문 카드를 둡니다.
 * (MATCH LINEUP 목업: 액션이 카드 밖 상단에 위치)
 */
export default function FormationCheckLineupModal({
  matchId,
  teamId,
}: FormationCheckLineupModalProps) {
  const { hideModal } = useModal();

  const handleShare = async () => {
    const url = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/formation/${matchId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "MATCH LINEUP", url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("링크가 복사되었습니다.");
      } else {
        toast.error("이 환경에서는 공유를 지원하지 않습니다.");
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      toast.error("공유에 실패했습니다.");
    }
  };

  return (
    <div
      className="pointer-events-auto flex w-full max-w-[min(100vw-2rem,1180px)] flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-2.5 flex shrink-0 items-center justify-end gap-4">
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 hover:text-Fill_AccentPrimary active:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary/50"
          onClick={() => void handleShare()}
        >
          <Icon src={share} alt="share" width={20} height={20} />
          공유하기
        </button>
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 hover:text-Fill_AccentPrimary active:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary/50"
          onClick={hideModal}
        >
          <Icon src={close} alt="close" width={20} height={20} />
          닫기
        </button>
      </div>

      <Suspense fallback={<ModalLoadingFallback />}>
        <FormationCheckLineupModalContent matchId={matchId} teamId={teamId} />
      </Suspense>
    </div>
  );
}
