"use client";

import Button from "@/components/ui/Button";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop } from "./MatchInfo";
import useModal from "@/hooks/useModal";

/**
 * 데스크탑용 다가오는 경기 컴포넌트 (>= 768px)
 */
const UpcomingMatchDesktop = () => {
  const { openModal } = useModal("ATTENDANCE_VOTE");

  return (
    <div className="hidden md:flex flex-row justify-between items-center gap-4 relative">
      <div className="flex gap-x-6 w-full pr-25">
        <MatchHeader />
        <MatchInfoDesktop />
      </div>

      <Button
        variant="primary"
        size="m"
        className="absolute right-4 w-25 font-medium text-black text-sm cursor-pointer"
        onClick={() => openModal({})}
      >
        참석투표하기
      </Button>
    </div>
  );
};

export default UpcomingMatchDesktop;
