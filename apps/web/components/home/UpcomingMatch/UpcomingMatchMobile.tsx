"use client";

import { Suspense } from "react";
import Link from "@/components/Link";
import { buttonVariants } from "@/components/ui/Button";
import Button from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { toast } from "@/lib/toast";
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
  headerRowClassName?: string;
  headerIconClassName?: string;
  showFormationSetup?: boolean;
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
  formationHref,
  primary,
  onAttendanceVote,
  onCopyTeamCode,
  showFormationSetupOverride,
}: {
  formationHref: string;
  primary: HomePrimaryCta;
  onAttendanceVote: () => void;
  onCopyTeamCode: () => void;
  showFormationSetupOverride?: boolean;
}) {
  const { showRegisterGame } = useTeamManagementCapabilitiesForUser();
  const showFormationSetup =
    showFormationSetupOverride !== undefined
      ? showFormationSetupOverride
      : showRegisterGame;
  return (
    <MobileUpcomingMatchActions
      formationHref={formationHref}
      showFormationSetup={showFormationSetup}
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
  const formationFromPanel = panel.showFormationSetup;
  const showFormationWhenLoggedOut = formationFromPanel ?? false;
  const showFormationFallback =
    formationFromPanel !== undefined ? formationFromPanel : false;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <MatchHeader
          title={panel.sectionTitle}
          rowClassName={panel.headerRowClassName}
          iconClassName={panel.headerIconClassName}
        />
        <MatchInfoMobile display={panel.display} />
      </div>
      {userId == null ? (
        <MobileUpcomingMatchActions
          formationHref={formationHref}
          showFormationSetup={showFormationWhenLoggedOut}
          primary={panel.primary}
          onAttendanceVote={onAttendanceVote}
          onCopyTeamCode={onCopyTeamCode}
        />
      ) : (
        <Suspense
          fallback={
            <MobileUpcomingMatchActions
              formationHref={formationHref}
              showFormationSetup={showFormationFallback}
              primary={panel.primary}
              onAttendanceVote={onAttendanceVote}
              onCopyTeamCode={onCopyTeamCode}
            />
          }
        >
          <MobileUpcomingMatchActionsWithCapabilities
            formationHref={formationHref}
            primary={panel.primary}
            onAttendanceVote={onAttendanceVote}
            onCopyTeamCode={onCopyTeamCode}
            showFormationSetupOverride={formationFromPanel}
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
  const { selectedTeamIdNum } = useSelectedTeamId();
  const { openModal } = useModal("ATTENDANCE_VOTE");
  const { openModal: openMomVoteModal } = useModal("MOM_VOTE");
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
          <Button
            type="button"
            variant="primary"
            size="m"
            className={cn(mobilePrimaryCtaClassName)}
            onClick={() => {
              if (selectedTeamIdNum == null) {
                toast.error("팀을 선택한 뒤 다시 시도해 주세요.");
                return;
              }
              const matchId = parseNumericIdFromRelayGlobalId(
                splitMomBanner.display.matchId,
              );
              if (matchId == null) {
                toast.error("경기 정보를 불러올 수 없습니다.");
                return;
              }
              openMomVoteModal({ matchId, teamId: selectedTeamIdNum });
            }}
          >
            MOM 투표하기
          </Button>
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
