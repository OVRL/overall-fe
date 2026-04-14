"use client";

import { Suspense } from "react";
import Button from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";
import { useUserId } from "@/hooks/useUserId";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop } from "./MatchInfo";
import {
  formationHrefFromDisplay,
  type UpcomingMatchDisplay,
} from "./upcomingMatchDisplay";

interface UpcomingMatchDesktopProps {
  display: UpcomingMatchDisplay;
}

/**
 * FindTeamMember 쿼리 이후: 헤더와 동일하게 Player가 아닐 때만 포메이션 진입 UI 표시
 */
function MatchInfoDesktopWithCapabilities({
  userId,
  display,
  formationHref,
}: {
  userId: number;
  display: UpcomingMatchDisplay;
  formationHref: string;
}) {
  const { showRegisterGame } = useTeamManagementCapabilitiesForUser(userId);
  return (
    <MatchInfoDesktop
      display={display}
      formationHref={formationHref}
      showFormationSetup={showRegisterGame}
    />
  );
}

/**
 * 데스크탑용 다가오는 경기 컴포넌트 (>= 768px)
 */
const UpcomingMatchDesktop = ({ display }: UpcomingMatchDesktopProps) => {
  const formationHref = formationHrefFromDisplay(display);
  const userId = useUserId();
  const { openModal } = useModal("ATTENDANCE_VOTE");

  return (
    <div className="hidden md:flex flex-row justify-between items-center gap-4 relative">
      <div className="flex gap-x-6 w-full pr-25">
        <MatchHeader />
        {userId == null ? (
          <MatchInfoDesktop
            display={display}
            formationHref={formationHref}
            showFormationSetup={false}
          />
        ) : (
          <Suspense
            fallback={
              <MatchInfoDesktop
                display={display}
                formationHref={formationHref}
                showFormationSetup={false}
              />
            }
          >
            <MatchInfoDesktopWithCapabilities
              userId={userId}
              display={display}
              formationHref={formationHref}
            />
          </Suspense>
        )}
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
