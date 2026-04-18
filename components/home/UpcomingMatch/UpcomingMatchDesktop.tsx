"use client";

import { Suspense } from "react";
import Link from "@/components/Link";
import { buttonVariants } from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";
import { useUserId } from "@/hooks/useUserId";
import { cn } from "@/lib/utils";
import type { HomePrimaryCta } from "@/utils/match/computeHomeUpcomingMatchLayout";
import MatchHeader from "./MatchHeader";
import { MatchInfoDesktop } from "./MatchInfo";
import { UpcomingMatchPrimaryCtaButton } from "./UpcomingMatchPrimaryCtaButton";
import {
  formationHrefFromDisplay,
  type UpcomingMatchDisplay,
} from "./upcomingMatchDisplay";

export type UpcomingMatchDesktopPanel = {
  display: UpcomingMatchDisplay;
  primary: HomePrimaryCta;
  sectionTitle: string;
  teaserDisplay?: UpcomingMatchDisplay | null;
};

export type UpcomingMatchDesktopProps = {
  /** 36h 이내 겹침 시 상단 MOM 스트립 */
  splitMomBanner?: {
    display: UpcomingMatchDisplay;
    momHref: string;
  } | null;
  /** null이면 본문(매치 행) 없음 — split 시 상단만 있을 수 있음 */
  main: UpcomingMatchDesktopPanel | null;
  onCopyTeamCode: () => void;
};

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

function DesktopMatchBlock({
  userId,
  panel,
  onAttendanceVote,
  onCopyTeamCode,
}: {
  userId: number | null;
  panel: UpcomingMatchDesktopPanel;
  onAttendanceVote: () => void;
  onCopyTeamCode: () => void;
}) {
  const formationHref = formationHrefFromDisplay(panel.display);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row justify-between items-center gap-4 relative w-full">
        <div className="flex gap-x-6 w-full pr-25">
          <MatchHeader title={panel.sectionTitle} />
          {userId == null ? (
            <MatchInfoDesktop
              display={panel.display}
              formationHref={formationHref}
              showFormationSetup={false}
            />
          ) : (
            <Suspense
              fallback={
                <MatchInfoDesktop
                  display={panel.display}
                  formationHref={formationHref}
                  showFormationSetup={false}
                />
              }
            >
              <MatchInfoDesktopWithCapabilities
                userId={userId}
                display={panel.display}
                formationHref={formationHref}
              />
            </Suspense>
          )}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-25 flex justify-end">
          <UpcomingMatchPrimaryCtaButton
            primary={panel.primary}
            onAttendanceVote={onAttendanceVote}
            onCopyTeamCode={onCopyTeamCode}
            className="w-full p-3 text-Label-Fixed_black"
          />
        </div>
      </div>

      {panel.teaserDisplay ? (
        <p className="text-xs text-Label-Tertiary md:pl-33 max-w-full truncate">
          다음: {panel.teaserDisplay.formattedDateTime} ·{" "}
          {panel.teaserDisplay.homeTeam.name} vs{" "}
          {panel.teaserDisplay.awayTeam.name}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 데스크탑용 다가오는 경기 컴포넌트 (>= 768px)
 */
const UpcomingMatchDesktop = ({
  splitMomBanner,
  main,
  onCopyTeamCode,
}: UpcomingMatchDesktopProps) => {
  const userId = useUserId();
  const { openModal } = useModal("ATTENDANCE_VOTE");
  const onAttendanceVote = () => openModal({});

  return (
    <div className="hidden md:flex flex-col gap-6 w-full">
      {splitMomBanner ? (
        <div className="flex flex-row items-center justify-between gap-4 pb-4 border-b border-border-card">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs text-Label-Tertiary">직전 경기 · MOM</span>
            <span className="text-sm text-white font-medium truncate">
              {splitMomBanner.display.formattedDateTime} ·{" "}
              {splitMomBanner.display.homeTeam.name} vs{" "}
              {splitMomBanner.display.awayTeam.name}
            </span>
          </div>
          <Link
            href={splitMomBanner.momHref}
            className={cn(
              buttonVariants({ variant: "primary", size: "m" }),
              "shrink-0 font-semibold text-Label-Fixed_black text-sm px-4 py-2.5",
            )}
          >
            MOM 투표하기
          </Link>
        </div>
      ) : null}

      {main ? (
        <DesktopMatchBlock
          userId={userId}
          panel={main}
          onAttendanceVote={onAttendanceVote}
          onCopyTeamCode={onCopyTeamCode}
        />
      ) : null}
    </div>
  );
};

export default UpcomingMatchDesktop;
