"use client";

import Button from "@/components/ui/Button";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop } from "./MatchInfo";
import useModal from "@/hooks/useModal";
import type { UpcomingMatchDisplay } from "./upcomingMatchDisplay";

interface UpcomingMatchDesktopProps {
  display: UpcomingMatchDisplay;
}

/**
 * 데스크탑용 다가오는 경기 컴포넌트 (>= 768px)
 */
const UpcomingMatchDesktop = ({ display }: UpcomingMatchDesktopProps) => {
  const { openModal } = useModal("ATTENDANCE_VOTE");

  return (
    <div className="hidden md:flex flex-row justify-between items-center gap-4 relative">
      <div className="flex gap-x-6 w-full pr-25">
        <MatchHeader />
        <MatchInfoDesktop display={display} />
      </div>

      <Button
        variant="primary"
        size="m"
        className="absolute right-0 w-25 font-semibold text-Label-Fixed_black text-sm cursor-pointer p-3"
        onClick={() => openModal({})}
      >
        참석투표하기
      </Button>
    </div>
  );
};

export default UpcomingMatchDesktop;
