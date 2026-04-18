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
import { MatchInfoMobile } from "./MatchInfo";
import { UpcomingMatchPrimaryCtaButton } from "./UpcomingMatchPrimaryCtaButton";
import {
  formationHrefFromDisplay,
  type UpcomingMatchDisplay,
} from "./upcomingMatchDisplay";

export type UpcomingMatchMobilePanel = {
  display: UpcomingMatchDisplay;
  primary: HomePrimaryCta;
  sectionTitle: string;
  teaserDisplay?: UpcomingMatchDisplay | null;
};

export type UpcomingMatchMobileProps = {
  splitMomBanner?: {
    display: UpcomingMatchDisplay;
    momHref: string;
  } | null;
  main: UpcomingMatchMobilePanel | null;
  onCopyTeamCode: () => void;
};

const mobilePrimaryCtaClassName =
  "w-full font-semibold text-Label-Fixed_black text-sm cursor-pointer";

/** 포메이션 설정(링크) + 단일 우선 CTA */
function MobileUpcomingMatchActions({
  formationHref,
  showFormationSetup,
  primary,
  onAttendanceVote,
  onCopyTeamCode,
}: {
  formationHref: string;
  showFormationSetup: boolean;
  primary: HomePrimaryCta;
  onAttendanceVote: () => void;
  onCopyTeamCode: () => void;
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
      <UpcomingMatchPrimaryCtaButton
        primary={primary}
        onAttendanceVote={onAttendanceVote}
        onCopyTeamCode={onCopyTeamCode}
        className={mobilePrimaryCtaClassName}
      />
    </div>
  );
}

function MobileUpcomingMatchActionsWithCapabilities({
  userId,
  formationHref,
  primary,
  onAttendanceVote,
  onCopyTeamCode,
}: {
  userId: number;
  formationHref: string;
  primary: HomePrimaryCta;
  onAttendanceVote: () => void;
  onCopyTeamCode: () => void;
}) {
  const { showRegisterGame } = useTeamManagementCapabilitiesForUser(userId);
  return (
    <MobileUpcomingMatchActions
      formationHref={formationHref}
      showFormationSetup={showRegisterGame}
      primary={primary}
      onAttendanceVote={onAttendanceVote}
      onCopyTeamCode={onCopyTeamCode}
    />
  );
}

function MobileMainSection({
  userId,
  panel,
  onAttendanceVote,
  onCopyTeamCode,
}: {
  userId: number | null;
  panel: UpcomingMatchMobilePanel;
  onAttendanceVote: () => void;
  onCopyTeamCode: () => void;
}) {
  const formationHref = formationHrefFromDisplay(panel.display);
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <MatchHeader title={panel.sectionTitle} />
        <MatchInfoMobile display={panel.display} />
        {panel.teaserDisplay ? (
          <p className="mt-3 text-xs text-Label-Tertiary px-2">
            다음: {panel.teaserDisplay.formattedDateTime} ·{" "}
            {panel.teaserDisplay.homeTeam.name} vs{" "}
            {panel.teaserDisplay.awayTeam.name}
          </p>
        ) : null}
      </div>
      {userId == null ? (
        <MobileUpcomingMatchActions
          formationHref={formationHref}
          showFormationSetup={false}
          primary={panel.primary}
          onAttendanceVote={onAttendanceVote}
          onCopyTeamCode={onCopyTeamCode}
        />
      ) : (
        <Suspense
          fallback={
            <MobileUpcomingMatchActions
              formationHref={formationHref}
              showFormationSetup={false}
              primary={panel.primary}
              onAttendanceVote={onAttendanceVote}
              onCopyTeamCode={onCopyTeamCode}
            />
          }
        >
          <MobileUpcomingMatchActionsWithCapabilities
            userId={userId}
            formationHref={formationHref}
            primary={panel.primary}
            onAttendanceVote={onAttendanceVote}
            onCopyTeamCode={onCopyTeamCode}
          />
        </Suspense>
      )}
    </div>
  );
}

/**
 * 모바일용 다가오는 경기 컴포넌트 (< 768px)
 */
const UpcomingMatchMobile = ({
  splitMomBanner,
  main,
  onCopyTeamCode,
}: UpcomingMatchMobileProps) => {
  const userId = useUserId();
  const { openModal } = useModal("ATTENDANCE_VOTE");
  const onAttendanceVote = () => openModal({});

  return (
    <div className="flex flex-col gap-6 md:hidden w-full">
      {splitMomBanner ? (
        <div className="flex flex-col gap-3 pb-4 border-b border-border-card">
          <span className="text-xs text-Label-Tertiary text-center">
            직전 경기 · MOM
          </span>
          <p className="text-center text-sm text-white font-medium px-2">
            {splitMomBanner.display.formattedDateTime}
            <br />
            {splitMomBanner.display.homeTeam.name} vs{" "}
            {splitMomBanner.display.awayTeam.name}
          </p>
          <Link
            href={splitMomBanner.momHref}
            className={cn(
              buttonVariants({ variant: "primary", size: "m" }),
              mobilePrimaryCtaClassName,
            )}
          >
            MOM 투표하기
          </Link>
        </div>
      ) : null}

      {main ? (
        <MobileMainSection
          userId={userId}
          panel={main}
          onAttendanceVote={onAttendanceVote}
          onCopyTeamCode={onCopyTeamCode}
        />
      ) : null}
    </div>
  );
};

export default UpcomingMatchMobile;
