"use client";

import Link from "@/components/Link";
import { buttonVariants } from "@/components/ui/Button";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop } from "./MatchInfo";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { cn } from "@/lib/utils";
import type { UpcomingMatchDisplay } from "./upcomingMatchDisplay";

interface UpcomingMatchDesktopProps {
  display: UpcomingMatchDisplay;
}

/**
 * 데스크탑용 다가오는 경기 컴포넌트 (>= 768px)
 */
const UpcomingMatchDesktop = ({ display }: UpcomingMatchDesktopProps) => {
  const numericMatchId = parseNumericIdFromRelayGlobalId(display.matchId);
  const formationHref =
    numericMatchId != null
      ? `/formation/${numericMatchId}`
      : `/formation/${encodeURIComponent(display.matchId)}`;

  return (
    <div className="hidden md:flex flex-row justify-between items-center gap-4 relative">
      <div className="flex gap-x-6 w-full pr-25">
        <MatchHeader />
        <MatchInfoDesktop display={display} />
      </div>

      {/*
      참석투표 모달 복구 시: useModal("ATTENDANCE_VOTE") 및 Button import 후 openModal({}) 연결
      <Button
        variant="primary"
        size="m"
        className="absolute right-0 w-25 font-semibold text-Label-Fixed_black text-sm cursor-pointer p-3"
        onClick={() => openModal({})}
      >
        참석투표하기
      </Button>
      */}

      <Link
        href={formationHref}
        className={cn(
          buttonVariants({ variant: "primary", size: "m" }),
          "absolute right-0 w-25 font-semibold text-Label-Fixed_black text-sm cursor-pointer p-3",
        )}
      >
        포메이션 설정
      </Link>
    </div>
  );
};

export default UpcomingMatchDesktop;
