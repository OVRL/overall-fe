"use client";

import { Suspense } from "react";
import Link from "@/components/Link";
import Button, { buttonVariants } from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";
import { useUserId } from "@/hooks/useUserId";
import { cn } from "@/lib/utils";
import MatchHeader from "./MatchHeader";
import { MatchInfoMobile } from "./MatchInfo";
import {
  formationHrefFromDisplay,
  type UpcomingMatchDisplay,
} from "./upcomingMatchDisplay";

interface UpcomingMatchMobileProps {
  display: UpcomingMatchDisplay;
}

const mobilePrimaryCtaClassName =
  "w-full font-semibold text-Label-Fixed_black text-sm cursor-pointer";

/** 포메이션 설정(링크) + 참석 투표 — 동일한 primary 버튼 스타일, 최대 너비 335px */
function MobileUpcomingMatchActions({
  formationHref,
  showFormationSetup,
  onAttendanceVote,
}: {
  formationHref: string;
  showFormationSetup: boolean;
  onAttendanceVote: () => void;
}) {
  return (
    <div className="w-full max-w-83.75 mx-auto flex flex-col gap-3">
      {showFormationSetup ? (
        <Link
          href={formationHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "m" }),
            mobilePrimaryCtaClassName,
            "text-Label-Tertiary",
          )}
        >
          포메이션 설정
        </Link>
      ) : null}
      <Button
        variant="primary"
        size="m"
        className={mobilePrimaryCtaClassName}
        onClick={onAttendanceVote}
      >
        참석투표하기
      </Button>
    </div>
  );
}

/**
 * FindTeamMember 쿼리 이후: 헤더와 동일하게 Player가 아닐 때만 포메이션 진입 UI 표시
 */
function MobileUpcomingMatchActionsWithCapabilities({
  userId,
  formationHref,
  onAttendanceVote,
}: {
  userId: number;
  formationHref: string;
  onAttendanceVote: () => void;
}) {
  const { showRegisterGame } = useTeamManagementCapabilitiesForUser(userId);
  return (
    <MobileUpcomingMatchActions
      formationHref={formationHref}
      showFormationSetup={showRegisterGame}
      onAttendanceVote={onAttendanceVote}
    />
  );
}

/**
 * 모바일용 다가오는 경기 컴포넌트 (< 768px)
 */
const UpcomingMatchMobile = ({ display }: UpcomingMatchMobileProps) => {
  const formationHref = formationHrefFromDisplay(display);
  const userId = useUserId();
  const { openModal } = useModal("ATTENDANCE_VOTE");
  const onAttendanceVote = () => openModal({});

  return (
    <div className="flex flex-col gap-6 md:hidden">
      <div className="text-center">
        <MatchHeader />
        <MatchInfoMobile display={display} />
      </div>
      {userId == null ? (
        <MobileUpcomingMatchActions
          formationHref={formationHref}
          showFormationSetup={false}
          onAttendanceVote={onAttendanceVote}
        />
      ) : (
        <Suspense
          fallback={
            <MobileUpcomingMatchActions
              formationHref={formationHref}
              showFormationSetup={false}
              onAttendanceVote={onAttendanceVote}
            />
          }
        >
          <MobileUpcomingMatchActionsWithCapabilities
            userId={userId}
            formationHref={formationHref}
            onAttendanceVote={onAttendanceVote}
          />
        </Suspense>
      )}
    </div>
  );
};

export default UpcomingMatchMobile;
