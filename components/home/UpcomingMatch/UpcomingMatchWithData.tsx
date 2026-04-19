"use client";

import { useLazyLoadQuery } from "react-relay";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useHomeUpcomingMatchLayoutSnapshot } from "@/components/providers/HomeUpcomingMatchLayoutSnapshotProvider";
import { useResolvedHomeUpcomingMatchLayout } from "./useResolvedHomeUpcomingMatchLayout";
import type { MatchForUpcomingDisplay } from "./upcomingMatchDisplay";
import HomeUpcomingInviteCopyCard from "./HomeUpcomingInviteCopyCard";
import NoUpcomingMatch from "./NoUpcomingMatch";
import OnboardingUpcomingMatch from "./OnboardingUpcomingMatch";
import UpcomingMatchDesktop from "./UpcomingMatchDesktop";
import UpcomingMatchMobile from "./UpcomingMatchMobile";
import { useInviteCodeForTeam } from "./useInviteCodeForTeam";

/** 다가오는 경기 없을 때: 팀원 1명이면 온보딩, 2명 이상이면 NoUpcomingMatch */
function NoMatchContent({
  isSoloTeam,
  teamId,
}: {
  isSoloTeam: boolean;
  teamId: number | null;
}) {
  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
      {isSoloTeam ? (
        <OnboardingUpcomingMatch key={teamId ?? "no-team"} teamId={teamId} />
      ) : (
        <NoUpcomingMatch />
      )}
    </div>
  );
}

/**
 * Relay 스토어에서 findMatch를 읽어 홈 경기 카드·우선 CTA를 표시합니다.
 */
export default function UpcomingMatchWithData() {
  const { selectedTeamIdNum, isSoloTeam } = useSelectedTeamId();

  if (selectedTeamIdNum == null) {
    return <NoMatchContent isSoloTeam={isSoloTeam} teamId={null} />;
  }

  return (
    <UpcomingMatchWithQuery
      createdTeamId={selectedTeamIdNum}
      isSoloTeam={isSoloTeam}
    />
  );
}

function UpcomingMatchWithQuery({
  createdTeamId,
  isSoloTeam,
}: {
  createdTeamId: number;
  isSoloTeam: boolean;
}) {
  const data = useLazyLoadQuery<findMatchQuery>(
    FindMatchQuery,
    { createdTeamId },
    { fetchPolicy: "store-or-network" },
  );

  const matches = (data?.findMatch ??
    []) as unknown as MatchForUpcomingDisplay[];
  const ssrSnapshot = useHomeUpcomingMatchLayoutSnapshot();
  const layout = useResolvedHomeUpcomingMatchLayout(
    createdTeamId,
    ssrSnapshot,
    matches,
  );

  const { copyCode } = useInviteCodeForTeam(createdTeamId);
  const onCopyTeamCode = () => copyCode();

  if (process.env.NODE_ENV === "development") {
    const runtime = typeof window !== "undefined" ? "client" : "server";
    console.log("[UpcomingMatchWithData] findMatch · 홈 레이아웃", {
      runtime,
      createdTeamId,
      rawCount: matches.length,
      layoutKind: layout.kind,
    });
  }

  if (layout.kind === "empty") {
    return <NoMatchContent isSoloTeam={isSoloTeam} teamId={createdTeamId} />;
  }

  if (layout.kind === "copy_only") {
    if (isSoloTeam) {
      return (
        <NoMatchContent isSoloTeam={isSoloTeam} teamId={createdTeamId} />
      );
    }
    return (
      <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
        <HomeUpcomingInviteCopyCard teamId={createdTeamId} />
      </div>
    );
  }

  const splitMomBanner =
    layout.kind === "split"
      ? {
          display: layout.topMom.display,
          momHref: layout.topMom.momHref,
        }
      : null;

  const mainPanel =
    layout.kind === "split"
      ? {
          display: layout.bottom.display,
          primary: layout.bottom.primary,
          sectionTitle: layout.bottom.sectionTitle,
        }
      : {
          display: layout.display,
          primary: layout.primary,
          sectionTitle: layout.sectionTitle,
          headerRowClassName: layout.headerRowClassName,
          headerIconClassName: layout.headerIconClassName,
          showFormationSetup: layout.showFormationSetup,
        };

  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
      <UpcomingMatchMobile
        splitMomBanner={splitMomBanner}
        main={mainPanel}
        onCopyTeamCode={onCopyTeamCode}
      />
      <UpcomingMatchDesktop
        splitMomBanner={splitMomBanner}
        main={mainPanel}
        onCopyTeamCode={onCopyTeamCode}
      />
    </div>
  );
}
